import React, { useState, useEffect } from "react";
import { getUserData, saveUserData } from "../../utils/storage";
import { getAllPolicies, createPaymentOrder, verifyPayment } from "../../api/policyApi";
import {
  MdDirectionsCar,
  MdHome,
  MdHealthAndSafety,
  MdCardTravel,
  MdFavorite,
  MdSecurity,
  MdClose,
  MdCheckCircle
} from "react-icons/md";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const BuyPolicy = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await getAllPolicies();
        if (response.success) {
          setPolicies(response.data);
        }
      } catch (err) {
        setError('Failed to fetch policies.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'vehicle': return <MdDirectionsCar style={{ color: "#f87171", fontSize: 42 }} />;
      case 'property': return <MdHome style={{ color: "#fbbf24", fontSize: 42 }} />;
      case 'health': return <MdHealthAndSafety style={{ color: "#34d399", fontSize: 42 }} />;
      case 'travel': return <MdCardTravel style={{ color: "#60a5fa", fontSize: 42 }} />;
      case 'life': return <MdFavorite style={{ color: "#a78bfa", fontSize: 42 }} />;
      default: return <MdSecurity style={{ color: "#9ca3af", fontSize: 42 }} />;
    }
  };

  const handleBuyPolicy = async (policyObj) => {
    const token = localStorage.getItem('token');

    let activeUserId = null;
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.id) {
        activeUserId = decoded.id;
      }
    }

    if (!activeUserId) {
      alert("Please login first to buy a policy.");
      return;
    }

    // Attempt local storage logic for UI mirroring 
    const data = getUserData();
    if (!data.policies) data.policies = [];
    if (!data.notifications) data.notifications = [];
    const alreadyBoughtLocal = data.policies.find((p) => p.name === policyObj.name);

    if (alreadyBoughtLocal) {
      alert(policyObj.name + " already purchased (found in local context)");
      return;
    }

    try {
      // 1. Create Order
      const amountInPaise = policyObj.premium * 100;
      const orderRes = await createPaymentOrder({
        amount: amountInPaise,
        policyIdFromAPI: policyObj.id
      });

      if (!orderRes.success) {
        alert("Failed to create order");
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderRes.keyId,
        amount: amountInPaise,
        currency: "INR",
        name: "Insurance Portal",
        description: `Purchase ${policyObj.name}`,
        order_id: orderRes.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              purchaseData: {
                userId: activeUserId,
                policyIdFromAPI: policyObj.id,
                policyName: policyObj.name,
                provider: policyObj.provider,
                policyType: policyObj.type,
                premium: policyObj.premium,
                coverageAmount: policyObj.coverageAmount
              }
            });

            if (verifyRes.success) {
              // Mirror UI success dynamically in local JSON storage structure
              const newPolicyLocal = {
                id: Date.now(),
                name: policyObj.name,
                status: "active",
                boughtAt: new Date().toLocaleString()
              };
              data.policies.push(newPolicyLocal);
              data.notifications.unshift({
                id: Date.now(),
                message: `${policyObj.name} policy successfully transacted`,
                time: new Date().toLocaleString()
              });
              saveUserData(data);

              alert(policyObj.name + " purchased successfully!");
              setSelectedPolicy(null);
            } else {
               alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed.");
          }
        },
        theme: {
          color: "#0284c7"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Error during purchase process.');
    }
  };

  const filteredPolicies = filterType === 'all' ? policies : policies.filter(p => p.type.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: "34px",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8
          }}
        >
          Buy Policy
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            maxWidth: 700
          }}
        >
          Choose the insurance policy that fits your needs and view its features before purchasing.
        </p>

        {/* Filter Selection */}
        <select
          style={{
            marginTop: 15,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            width: '200px',
            fontSize: 14,
            outline: 'none'
          }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="health">Health</option>
          <option value="vehicle">Vehicle</option>
          <option value="property">Property</option>
          <option value="travel">Travel</option>
          <option value="life">Life</option>
        </select>
      </div>

      {loading && <p>Loading policies catalog... Please wait.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "22px"
        }}
      >
        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            onClick={() => setSelectedPolicy(policy)}
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.7)",
              borderRadius: "22px",
              padding: "26px 20px",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(31, 38, 135, 0.10)",
              transition: "all 0.25s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: "220px",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 14px 30px rgba(31, 38, 135, 0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(31, 38, 135, 0.10)";
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
              }}
            >
              {getIcon(policy.type)}
            </div>

            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 10
              }}
            >
              {policy.name}
            </h3>

            <p style={{ margin: "5px 0", fontSize: 12, fontWeight: 700, color: "#0284c7" }}>
              Provider: {policy.provider}
            </p>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                marginTop: 0
              }}
            >
              Premium: ₹{policy.premium.toLocaleString()} / {policy.duration}
            </p>
          </div>
        ))}
      </div>

      {selectedPolicy && (
        <div
          onClick={() => setSelectedPolicy(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "600px",
              maxWidth: "95%",
              background: "rgba(255,255,255,0.97)",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.20)",
              border: "1px solid rgba(255,255,255,0.8)",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
                  }}
                >
                  {getIcon(selectedPolicy.type)}
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: 0
                    }}
                  >
                    {selectedPolicy.name}
                  </h2>
                  <p
                    style={{
                      margin: "6px 0 0 0",
                      fontSize: 13,
                      color: "var(--text-secondary)"
                    }}
                  >
                    Provided by: <b>{selectedPolicy.provider}</b> | Type: {selectedPolicy.type}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPolicy(null)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "none",
                  background: "#f1f5f9",
                  color: "#475569",
                  fontSize: 22,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <MdClose />
              </button>
            </div>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginBottom: 20
              }}
            >
              {selectedPolicy.description}
            </p>

            <div style={{ display: 'flex', gap: '15px', marginBottom: 20 }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Premium</span>
                <strong style={{ color: '#0284c7' }}>₹{selectedPolicy.premium.toLocaleString()}</strong>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Coverage</span>
                <strong style={{ color: '#0f766e' }}>₹{selectedPolicy.coverageAmount.toLocaleString()}</strong>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Eligibility</span>
                <strong style={{ color: '#334155', fontSize: 13 }}>{selectedPolicy.eligibility}</strong>
              </div>
            </div>

            <div
              style={{
                background: "rgba(248,250,252,0.9)",
                borderRadius: "16px",
                padding: "18px",
                marginBottom: 22,
                border: "1px solid #e2e8f0"
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)"
                }}
              >
                Policy Benefits
              </h4>

              <div style={{ display: "grid", gap: 10 }}>
                {selectedPolicy.benefits?.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      color: "#334155"
                    }}
                  >
                    <MdCheckCircle style={{ color: "#22c55e", fontSize: 18 }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleBuyPolicy(selectedPolicy)}
                style={{
                  flex: 1,
                  padding: "13px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #0284c7, #38bdf8)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(56, 189, 248, 0.35)"
                }}
              >
                Buy Policy Now
              </button>

              <button
                onClick={() => setSelectedPolicy(null)}
                style={{
                  flex: 1,
                  padding: "13px 16px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  color: "#334155",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyPolicy;