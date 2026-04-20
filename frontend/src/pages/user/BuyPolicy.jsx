import React, { useState } from "react";
import { getUserData, saveUserData } from "../../utils/storage";
import {
  MdDirectionsCar,
  MdHome,
  MdHealthAndSafety,
  MdClose,
  MdCheckCircle
} from "react-icons/md";

const BuyPolicy = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const policies = [
    {
      id: 1,
      name: "Motor & Car Insurance",
      icon: <MdDirectionsCar style={{ color: "#f87171", fontSize: 42 }} />,
      description: "Protect your car from accidents, theft, repairs, and third-party damage.",
      features: [
        "Accident damage coverage",
        "Third-party liability cover",
        "Theft protection",
        "Cashless garage support"
      ]
    },
    {
      id: 2,
      name: "Home Insurance",
      icon: <MdHome style={{ color: "#fbbf24", fontSize: 42 }} />,
      description: "Secure your home and belongings from fire, theft, and natural disasters.",
      features: [
        "Fire damage protection",
        "Natural disaster coverage",
        "Burglary and theft cover",
        "Household items protection"
      ]
    },
    {
      id: 3,
      name: "Medical Insurance",
      icon: <MdHealthAndSafety style={{ color: "#34d399", fontSize: 42 }} />,
      description: "Get financial support for hospitalization, treatment, and emergency healthcare.",
      features: [
        "Hospitalization cover",
        "Pre and post hospitalization",
        "Cashless treatment",
        "Emergency medical support"
      ]
    }
  ];

  const handleBuyPolicy = (policyName) => {
    const data = getUserData();

    if (!data.policies) data.policies = [];
    if (!data.notifications) data.notifications = [];

    const alreadyBought = data.policies.find((p) => p.name === policyName);

    if (alreadyBought) {
      alert(policyName + " already purchased");
      return;
    }

    const newPolicy = {
      id: Date.now(),
      name: policyName,
      status: "active",
      boughtAt: new Date().toLocaleString()
    };

    data.policies.push(newPolicy);

    data.notifications.unshift({
      id: Date.now(),
      message: `${policyName} policy purchased`,
      time: new Date().toLocaleString()
    });

    saveUserData(data);

    alert(policyName + " purchased successfully");
    setSelectedPolicy(null);
  };

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
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "22px"
        }}
      >
        {policies.map((policy) => (
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
              {policy.icon}
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

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text-secondary)"
              }}
            >
              {policy.description}
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
              width: "540px",
              maxWidth: "95%",
              background: "rgba(255,255,255,0.97)",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.20)",
              border: "1px solid rgba(255,255,255,0.8)"
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
                  {selectedPolicy.icon}
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
                    Policy details and features
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
                Features
              </h4>

              <div style={{ display: "grid", gap: 10 }}>
                {selectedPolicy.features.map((feature, index) => (
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
                onClick={() => handleBuyPolicy(selectedPolicy.name)}
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
                Buy Policy
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