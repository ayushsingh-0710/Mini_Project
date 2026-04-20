import React, { useEffect, useState } from "react";
import { getUserData, saveUserData } from "../../utils/storage";
import {
  MdDirectionsCar,
  MdHome,
  MdFlight,
  MdFace,
  MdShield,
  MdHealthAndSafety,
  MdLaptopMac,
  MdClose
} from "react-icons/md";
import Partners from "../../components/Partners";
import Footer from "../../components/Footer";

const insurances = [
  {
    id: "motor",
    title: "Motor & Car Insurance",
    icon: <MdDirectionsCar style={{ color: "#f87171" }} />,
    description: "Protect your car against accidents, theft, third-party damage, and repairs.",
    features: [
      "Accident damage coverage",
      "Third-party liability",
      "Theft protection",
      "Cashless garage support"
    ]
  },
  {
    id: "home",
    title: "Home Insurance",
    icon: <MdHome style={{ color: "#fbbf24" }} />,
    description: "Protect your home and belongings from fire, theft, and natural disasters.",
    features: [
      "Fire damage protection",
      "Natural disaster coverage",
      "Burglary and theft cover",
      "Household items protection"
    ]
  },
  {
    id: "travel",
    title: "Travel Insurance",
    icon: <MdFlight style={{ color: "#60a5fa" }} />,
    description: "Stay covered during domestic and international travel emergencies.",
    features: [
      "Trip cancellation cover",
      "Lost baggage protection",
      "Emergency medical support",
      "Passport loss assistance"
    ]
  },
  {
    id: "domestic",
    title: "Domestic Helper",
    icon: <MdFace style={{ color: "#a78bfa" }} />,
    description: "Insurance support for domestic helper medical and accidental needs.",
    features: [
      "Medical expense coverage",
      "Accident protection",
      "Employer liability support",
      "Emergency assistance"
    ]
  },
  {
    id: "accident",
    title: "Personal Accident",
    icon: <MdShield style={{ color: "#facc15" }} />,
    description: "Financial protection in case of accidental injury, disability, or death.",
    features: [
      "Accidental death benefit",
      "Disability cover",
      "Hospital support",
      "Income protection"
    ]
  },
  {
    id: "medical",
    title: "Medical Insurance",
    icon: <MdHealthAndSafety style={{ color: "#34d399" }} />,
    description: "Get support for hospitalization, treatment, and emergency medical expenses.",
    features: [
      "Hospitalization cover",
      "Pre and post hospitalization",
      "Cashless treatment",
      "Emergency care support"
    ]
  },
  {
    id: "expat",
    title: "Expat Medical Visa",
    icon: <MdShield style={{ color: "#2dd4bf" }} />,
    description: "Medical insurance designed for visa and expat-related requirements.",
    features: [
      "Visa-compliant plans",
      "Emergency medical help",
      "Global support",
      "Flexible cover options"
    ]
  },
  {
    id: "cyber",
    title: "Personal Cyber",
    icon: <MdLaptopMac style={{ color: "#4b5563" }} />,
    description: "Protect yourself from cyber fraud, identity theft, and digital risks.",
    features: [
      "Online fraud protection",
      "Identity theft support",
      "Cyber extortion cover",
      "Digital transaction security"
    ]
  }
];

const moreProductsData = {
  Personal: [
    {
      category: "Investment Plans",
      items: [
        { name: "LIC Plans", icon: "🛡️" },
        { name: "Investment", icon: "💰" },
        { name: "Child Savings Plan", icon: "🧸" },
        { name: "Guaranteed Return Plan", icon: "💯" },
        { name: "Retirement Plan", icon: "👴" },
        { name: "Tax Saving Investment", icon: "🧾" },
        { name: "Pension For Life", icon: "🛋️" },
        { name: "Smart Deposit", icon: "🪙" },
        { name: "ULIPs", icon: "📈", badge: "New" },
        { name: "Dollar Based Investment Plan", icon: "💵" }
      ]
    },
    {
      category: "Other Plans",
      items: [
        { name: "Car Insurance", icon: "🚗" },
        { name: "Brand New Car", icon: "✨🚗" },
        { name: "2 Wheeler Insurance", icon: "🛵" },
        { name: "Travel Insurance", icon: "✈️" },
        { name: "Home Insurance", icon: "🏠" },
        { name: "Taxi Insurance", icon: "🚖" },
        { name: "Commercial Vehicle", icon: "🚚" },
        { name: "Employee Group Health Insurance", icon: "👥💉" },
        { name: "Corporate Insurance", icon: "🏢" },
        { name: "Pet Insurance", icon: "🐕" },
        { name: "Personal Cyber Insurance", icon: "💻🛡️" }
      ]
    }
  ],
  Business: [
    {
      category: "Marine & Property Insurance",
      items: [
        { name: "Marine Insurance", icon: "🚢", badge: "Save upto 42%" },
        { name: "Fire & Burglary", icon: "🔥" },
        { name: "Shop Owner Insurance", icon: "🏪" },
        { name: "Office Package Policy", icon: "🗄️" }
      ]
    },
    {
      category: "Employee Benefits",
      items: [
        { name: "Employee Group Health Insurance", icon: "👨‍👩‍👧‍👦", badge: "Save upto 65%" },
        { name: "Group Personal Accident", icon: "🩺", badge: "Save upto 78%" },
        { name: "Group Term Life", icon: "☂️" },
        { name: "COVID-19 Group Health Plan", icon: "🦠" }
      ]
    },
    {
      category: "Liability",
      items: [
        { name: "Professional Indemnity for Doctors", icon: "👨‍⚕️", badge: "Save upto 88%" },
        { name: "Professional Indemnity for Companies", icon: "🏬", badge: "Save upto 50%" },
        { name: "Workmen Compensation", icon: "👷‍♂️", badge: "Save upto 85%" },
        { name: "General Liability", icon: "🧳" },
        { name: "Cyber Risk Insurance", icon: "🔐" },
        { name: "Directors & Officers Liability", icon: "👔" }
      ]
    },
    {
      category: "Engineering",
      items: [
        { name: "Contractor's All Risk", icon: "🧰" },
        { name: "Erection All Risk", icon: "🏗️" },
        { name: "Contractor's Plant & Machinery", icon: "🚜" }
      ]
    }
  ]
};

const UserDashboard = () => {
  const [profileName, setProfileName] = useState("");
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [activePolicies, setActivePolicies] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [approvedClaims, setApprovedClaims] = useState(0);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal");
  const [selectedMoreProduct, setSelectedMoreProduct] = useState(null);

  useEffect(() => {
    const data = getUserData();

    const policies = data.policies || [];
    const claims = data.claims || [];
    const profile = data.profile || {};

    setProfileName(profile.name || profile.fullName || "User");
    setTotalPolicies(policies.length);
    setActivePolicies(policies.filter((p) => p.status === "active").length);
    setTotalClaims(claims.length);
    setApprovedClaims(claims.filter((c) => c.status === "approved").length);
  }, []);

  const handleBuyPolicy = (policy) => {
    const data = getUserData();

    if (!data.policies) data.policies = [];
    if (!data.notifications) data.notifications = [];

    const alreadyBought = data.policies.find((p) => p.name === policy.title);

    if (alreadyBought) {
      alert(policy.title + " already purchased");
      return;
    }

    const newPolicy = {
      id: Date.now(),
      name: policy.title,
      status: "active",
      boughtAt: new Date().toLocaleString()
    };

    data.policies.push(newPolicy);

    data.notifications.unshift({
      id: Date.now(),
      message: `${policy.title} policy purchased`,
      time: new Date().toLocaleString()
    });

    saveUserData(data);

    setTotalPolicies(data.policies.length);
    setActivePolicies(data.policies.filter((p) => p.status === "active").length);

    alert(policy.title + " purchased successfully");
    setSelectedPolicy(null);
  };

  return (
    <div className="page-container" style={{ position: "relative" }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", gap: 5, fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
            <span>Main Services</span>
            <span style={{ color: "var(--text-secondary)" }}>/</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Insurance Policies</span>
          </div>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Welcome, {profileName}</h2>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
            Insurance Policies
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Look through all the insurance policies and services we provide at EasyInsure
          </p>
        </div>

        <button
          onClick={() => setShowMoreProducts(true)}
          style={{
            background: "var(--bg-card)",
            color: "var(--blue-dark)",
            border: "1px solid var(--blue-primary)",
            padding: "10px 18px",
            borderRadius: "12px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--blue-primary)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-card)";
            e.currentTarget.style.color = "var(--blue-dark)";
          }}
        >
          View More Products
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "20px"
        }}
      >
        <div className="chart-card">
          <h4>Total Policies</h4>
          <h2>{totalPolicies}</h2>
        </div>

        <div className="chart-card">
          <h4>Active Policies</h4>
          <h2>{activePolicies}</h2>
        </div>

        <div className="chart-card">
          <h4>Total Claims</h4>
          <h2>{totalClaims}</h2>
        </div>

        <div className="chart-card">
          <h4>Approved Claims</h4>
          <h2>{approvedClaims}</h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          maxWidth: "900px",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
          position: "relative"
        }}
      >
        {insurances.map((ins) => (
          <div
            key={ins.id}
            onClick={() => setSelectedPolicy(ins)}
            style={{
              padding: "24px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              background: selectedPolicy?.id === ins.id ? "var(--bg-secondary)" : "var(--bg-card)",
              border: selectedPolicy?.id === ins.id ? "2px solid var(--blue-light)" : "1px solid rgba(255,255,255,0.7)",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: selectedPolicy?.id === ins.id ? "0 10px 25px -5px rgba(56, 189, 248, 0.3)" : "none",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontSize: 40,
                background: "rgba(255,255,255,0.5)",
                padding: "16px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {ins.icon}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: selectedPolicy?.id === ins.id ? "var(--blue-dark)" : "var(--text-primary)"
              }}
            >
              {ins.title}
            </span>
          </div>
        ))}
      </div>

      {selectedPolicy && !showMoreProducts && (
        <div
          onClick={() => setSelectedPolicy(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "520px",
              maxWidth: "95%",
              background: "rgba(255,255,255,0.96)",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
              border: "1px solid rgba(255,255,255,0.8)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                {selectedPolicy.title}
              </h2>
              <button
                onClick={() => setSelectedPolicy(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 22,
                  color: "var(--text-muted)",
                  cursor: "pointer"
                }}
              >
                <MdClose />
              </button>
            </div>

            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              {selectedPolicy.description}
            </p>

            <h4 style={{ marginBottom: 12, color: "var(--text-primary)" }}>Features</h4>
            <ul style={{ paddingLeft: 20, marginBottom: 24, color: "var(--text-secondary)" }}>
              {selectedPolicy.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: 8 }}>
                  {feature}
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleBuyPolicy(selectedPolicy)}
                style={{
                  background: "linear-gradient(135deg, #0284c7, #38bdf8)",
                  color: "#fff",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(56, 189, 248, 0.35)"
                }}
              >
                Buy Policy
              </button>

              <button
                onClick={() => setSelectedPolicy(null)}
                style={{
                  background: "#fff",
                  color: "var(--text-primary)",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "1px solid var(--border)",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showMoreProducts && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "900px",
              maxHeight: "85vh",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", margin: 0 }}>More Products</h2>
              <button
                onClick={() => setShowMoreProducts(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b"
                }}
              >
                <MdClose style={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 32, padding: "0 32px", borderBottom: "1px solid #e2e8f0" }}>
              {["Personal", "Business"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "16px 0",
                    fontSize: 15,
                    fontWeight: 700,
                    color: activeTab === tab ? "#2563eb" : "#64748b",
                    borderBottom: `3px solid ${activeTab === tab ? "#2563eb" : "transparent"}`,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {tab} Insurance
                </button>
              ))}
            </div>

            <div style={{ padding: "32px", overflowY: "auto", flex: 1, backgroundColor: "#f8fafc" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "40px" }}>
                {moreProductsData[activeTab].map((section, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#334155", margin: 0 }}>{section.category}</h3>
                      <div style={{ height: 2, background: "#cbd5e1", flex: 1 }}></div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                      {section.items.map((item, idxi) => (
                        <div
                        key={idxi}
                        onClick={() =>
                          setSelectedMoreProduct({
                            name: item.name,
                            icon: item.icon,
                            category: section.category,
                            description: `${item.name} insurance details`,
                            features: [
                              "Quick claim process",
                              "Affordable plans",
                              "Trusted coverage",
                              "24/7 support"
                            ]
                          })
                        }
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          gap: 8,
                          cursor: "pointer"
                        }}
                      >
                          <div style={{ position: "relative" }}>
                            {item.badge && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: -14,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  background: "#86efac",
                                  color: "#065f46",
                                  fontSize: 9,
                                  fontWeight: 800,
                                  padding: "2px 6px",
                                  borderRadius: 10,
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {item.badge}
                              </div>
                            )}
                            <div style={{ fontSize: 42, textShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>{item.icon}</div>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", lineHeight: 1.3 }}>{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Partners />

      <div style={{ margin: "40px -20px -20px -20px" }}>
      {selectedMoreProduct && (
  <div
    onClick={() => setSelectedMoreProduct(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        width: "400px"
      }}
    >
      <h2>{selectedMoreProduct.name}</h2>

      <p>{selectedMoreProduct.description}</p>

      <h4>Features</h4>
      <ul>
        {selectedMoreProduct.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
  
  <button
    onClick={() => {
      alert(selectedMoreProduct.name + " purchased");
    }}
    style={{
      flex: 1,
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #0284c7, #38bdf8)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(56, 189, 248, 0.3)",
      transition: "0.2s"
    }}
    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
  >
    Buy Now
  </button>

  <button
    onClick={() => setSelectedMoreProduct(null)}
    style={{
      flex: 1,
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      background: "#fff",
      color: "#333",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.2s"
    }}
    onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
    onMouseLeave={(e) => (e.target.style.background = "#fff")}
  >
    Close
  </button>

</div>

    </div>
  </div>
)}
        <Footer />
      </div>
    </div>
  );
};

export default UserDashboard;