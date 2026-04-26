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
import { getAllPolicies } from "../../api/policyApi";
import { useNavigate } from "react-router-dom";
import Partners from "../../components/Partners";
import Footer from "../../components/Footer";

const insurances = [
  {
    id: "motor",
    title: "Motor & Car Insurance",
    icon: <MdDirectionsCar style={{ color: "#f87171" }} />,
    short: "Starting at ₹2,094",
    description: "Get protection against accidents, theft, third-party liability, and repair expenses.",
    features: ["Accident cover", "Third-party cover", "Cashless garages", "Theft protection"]
  },
  {
    id: "home",
    title: "Home Insurance",
    icon: <MdHome style={{ color: "#fbbf24" }} />,
    short: "Starting at ₹1,299",
    description: "Protect your home structure and belongings from fire, burglary, and natural disasters.",
    features: ["Fire protection", "Burglary cover", "Natural disaster cover", "Contents protection"]
  },
  {
    id: "travel",
    title: "Travel Insurance",
    icon: <MdFlight style={{ color: "#60a5fa" }} />,
    short: "Starting at ₹599",
    description: "Stay covered for medical emergencies, baggage loss, and trip cancellation.",
    features: ["Medical emergency", "Lost baggage", "Trip cancellation", "Passport loss"]
  },
  {
    id: "domestic",
    title: "Domestic Helper",
    icon: <MdFace style={{ color: "#a78bfa" }} />,
    short: "Starting at ₹899",
    description: "Insurance support for domestic helper medical and accidental needs.",
    features: ["Medical support", "Accident cover", "Employer liability", "Emergency support"]
  },
  {
    id: "accident",
    title: "Personal Accident",
    icon: <MdShield style={{ color: "#facc15" }} />,
    short: "Starting at ₹499",
    description: "Financial support in case of accidental injury, disability, or death.",
    features: ["Death benefit", "Disability cover", "Hospital support", "Income protection"]
  },
  {
    id: "medical",
    title: "Medical Insurance",
    icon: <MdHealthAndSafety style={{ color: "#34d399" }} />,
    short: "Starting at ₹3,499",
    description: "Get support for hospitalization, treatment, and emergency medical expenses.",
    features: ["Hospitalization", "Cashless treatment", "Daycare cover", "Emergency care"]
  },
  {
    id: "expat",
    title: "Expat Medical Visa",
    icon: <MdShield style={{ color: "#2dd4bf" }} />,
    short: "Starting at ₹2,999",
    description: "Medical insurance designed for visa and expat-related requirements.",
    features: ["Visa plans", "Emergency help", "Global support", "Flexible cover"]
  },
  {
    id: "cyber",
    title: "Personal Cyber",
    icon: <MdLaptopMac style={{ color: "#4b5563" }} />,
    short: "Starting at ₹799",
    description: "Protect yourself from cyber fraud, identity theft, and digital risks.",
    features: ["Online fraud cover", "Identity theft", "Cyber extortion", "Transaction safety"]
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

const quoteMap = {
  motor: [
    { company: "HDFC Ergo", price: "₹2,094", cover: "Comprehensive Cover" },
    { company: "ICICI Lombard", price: "₹2,240", cover: "Premium Car Cover" },
    { company: "TATA AIG", price: "₹2,399", cover: "Zero Dep Add-on" }
  ],
  home: [
    { company: "Bajaj Allianz", price: "₹1,299", cover: "Basic Home Shield" },
    { company: "ICICI Lombard", price: "₹1,499", cover: "Home + Contents" },
    { company: "HDFC Ergo", price: "₹1,650", cover: "Premium Home Guard" }
  ],
  travel: [
    { company: "Care Travel", price: "₹599", cover: "Single Trip Plan" },
    { company: "Reliance", price: "₹749", cover: "Family Travel Cover" },
    { company: "TATA AIG", price: "₹899", cover: "International Travel Plan" }
  ],
  domestic: [
    { company: "SafeHelp", price: "₹899", cover: "Basic Helper Cover" },
    { company: "SecureLife", price: "₹1,050", cover: "Medical + Accident" },
    { company: "TrustCare", price: "₹1,199", cover: "Complete Helper Cover" }
  ],
  accident: [
    { company: "Axis Accident", price: "₹499", cover: "Basic Personal Accident" },
    { company: "Care Plus", price: "₹699", cover: "Family Accident Cover" },
    { company: "Shield Max", price: "₹899", cover: "Premium Protection" }
  ],
  medical: [
    { company: "Star Health", price: "₹3,499", cover: "Health Starter Plan" },
    { company: "Niva Bupa", price: "₹3,850", cover: "Hospital Cashless" },
    { company: "Care Health", price: "₹4,250", cover: "Advanced Medical Cover" }
  ],
  expat: [
    { company: "VisaCare", price: "₹2,999", cover: "Expat Standard" },
    { company: "Global Health", price: "₹3,350", cover: "Worldwide Medical" },
    { company: "Travel Shield", price: "₹3,699", cover: "Visa Premium Plan" }
  ],
  cyber: [
    { company: "CyberSafe", price: "₹799", cover: "Digital Fraud Cover" },
    { company: "SecureNet", price: "₹999", cover: "Identity Theft Protection" },
    { company: "ShieldTech", price: "₹1,199", cover: "Premium Cyber Plan" }
  ]
};

const moreProductQuotes = [
  { company: "HDFC Ergo", price: "₹999", cover: "Basic Cover" },
  { company: "ICICI Lombard", price: "₹1,249", cover: "Standard Cover" },
  { company: "TATA AIG", price: "₹1,499", cover: "Premium Cover" }
];

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
  const [showQuotes, setShowQuotes] = useState(false);
  const [showMoreProductQuotes, setShowMoreProductQuotes] = useState(false);
  const [apiPolicies, setApiPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [policyError, setPolicyError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getUserData();
    const profile = data.profile || {};
    setProfileName(profile.name || profile.fullName || "User");

    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      let uid = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          uid = payload.id;
        } catch(e) {}
      }

      if (uid) {
         try {
           const [purchasesRes, claimsRes] = await Promise.all([
             fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchases/user/${uid}`),
             fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/claims/user/${uid}`)
           ]);
           
           if(purchasesRes.ok) {
             const pData = await purchasesRes.json();
             if(pData.success && pData.data) {
                setTotalPolicies(pData.data.length);
                setActivePolicies(pData.data.filter(p => p.status === 'active').length);
             }
           }
           
           if(claimsRes.ok) {
             const cData = await claimsRes.json();
             if(cData.success && cData.data) {
                setTotalClaims(cData.data.length);
                setApprovedClaims(cData.data.filter(c => c.status === 'approved').length);
             }
           }
         } catch(err) {
           console.error("Error fetching dashboard stats:", err);
         }
      }
    };

    fetchDashboardData();

    const fetchApiPolicies = async () => {
      try {
        const response = await getAllPolicies();
        if (response.success && response.data) {
          setApiPolicies(response.data);
        } else {
          setPolicyError("Unable to load policies");
        }
      } catch (err) {
        setPolicyError("Unable to load policies");
      } finally {
        setLoadingPolicies(false);
      }
    };
    fetchApiPolicies();
  }, []);

  const refreshStats = () => {
    const data = getUserData();
    const policies = data.policies || [];
    const claims = data.claims || [];

    setTotalPolicies(policies.length);
    setActivePolicies(policies.filter((p) => p.status === "active").length);
    setTotalClaims(claims.length);
    setApprovedClaims(claims.filter((c) => c.status === "approved").length);
  };

  const handleBuyPolicy = (policy) => {
    const data = getUserData();

    if (!data.policies) data.policies = [];
    if (!data.notifications) data.notifications = [];

    const policyName = policy.title || policy.name;

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
    refreshStats();

    alert(policyName + " purchased successfully");
    setSelectedPolicy(null);
    setShowQuotes(false);
  };

  const handleBuyMoreProduct = (product) => {
    const data = getUserData();

    if (!data.policies) data.policies = [];
    if (!data.notifications) data.notifications = [];

    const alreadyBought = data.policies.find((p) => p.name === product.name);

    if (alreadyBought) {
      alert(product.name + " already purchased");
      return;
    }

    const newPolicy = {
      id: Date.now(),
      name: product.name,
      status: "active",
      boughtAt: new Date().toLocaleString()
    };

    data.policies.push(newPolicy);

    data.notifications.unshift({
      id: Date.now(),
      message: `${product.name} purchased`,
      time: new Date().toLocaleString()
    });

    saveUserData(data);
    refreshStats();

    alert(product.name + " purchased successfully");
    setSelectedMoreProduct(null);
    setShowMoreProductQuotes(false);
  };

  const handleViewPrices = () => {
    setShowQuotes(true);
  };

  const currentQuotes = selectedPolicy ? quoteMap[selectedPolicy.id] || [] : [];

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
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          width: "100%",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
        }}
      >
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>Top Available Policies</h3>
        </div>

        {loadingPolicies ? (
          <p style={{ gridColumn: "1 / -1" }}>Loading policies...</p>
        ) : policyError ? (
          <p style={{ gridColumn: "1 / -1", color: "red" }}>{policyError}</p>
        ) : apiPolicies.length === 0 ? (
          <p style={{ gridColumn: "1 / -1" }}>No policies available.</p>
        ) : (
          apiPolicies.slice(0, 8).map((policy) => (
            <div
              key={policy.id}
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                textAlign: "left"
              }}
            >
              <h4 style={{ margin: 0, fontSize: 16, color: "var(--text-primary)" }}>{policy.name}</h4>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--blue-dark)" }}>{policy.provider}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Type: {policy.type}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Premium: ₹{policy.premium?.toLocaleString()}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Coverage: ₹{policy.coverageAmount?.toLocaleString()}</span>
              
              <button
                onClick={() => navigate("/user/buy-policy")}
                style={{
                  marginTop: "auto",
                  padding: "8px 12px",
                  background: "var(--blue-light)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                View / Buy
              </button>
            </div>
          ))
        )}
      </div>

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
                          onClick={() => {
                            setShowMoreProductQuotes(false);
                            setSelectedMoreProduct({
                              name: item.name,
                              icon: item.icon,
                              badge: item.badge || "",
                              category: section.category,
                              description: `${item.name} is available under ${section.category}. You can view details and buy this product.`,
                              features: [
                                "Quick claim process",
                                "Affordable plans",
                                "Trusted coverage",
                                "24/7 support"
                              ]
                            });
                          }}
                          style={{
                            padding: "18px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.2s",
                            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                            minHeight: "150px"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 10px 24px rgba(15, 23, 42, 0.10)";
                            e.currentTarget.style.border = "1px solid #38bdf8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.05)";
                            e.currentTarget.style.border = "1px solid #e2e8f0";
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
                                  background: "#dcfce7",
                                  color: "#166534",
                                  fontSize: 9,
                                  fontWeight: 800,
                                  padding: "2px 7px",
                                  borderRadius: 999,
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {item.badge}
                              </div>
                            )}

                            <div
                              style={{
                                width: 62,
                                height: 62,
                                borderRadius: "50%",
                                background: "#f8fafc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 34,
                                boxShadow: "inset 0 0 0 1px #e2e8f0"
                              }}
                            >
                              {item.icon}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#334155",
                              lineHeight: 1.4,
                              maxWidth: "100px"
                            }}
                          >
                            {item.name}
                          </div>
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

      {selectedMoreProduct && (
        <div
          onClick={() => {
            setSelectedMoreProduct(null);
            setShowMoreProductQuotes(false);
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(8px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "620px",
              maxWidth: "95%",
              background: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
              border: "1px solid #e2e8f0"
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0284c7, #38bdf8)",
                padding: "24px 28px",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    backdropFilter: "blur(6px)"
                  }}
                >
                  {selectedMoreProduct.icon}
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9, marginBottom: 6 }}>
                    {selectedMoreProduct.category}
                  </div>

                  <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
                    {selectedMoreProduct.name}
                  </h2>

                  <p style={{ margin: "8px 0 0 0", fontSize: 14, opacity: 0.95 }}>
                    Starting from <strong>₹999</strong> • Instant support available
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedMoreProduct(null);
                  setShowMoreProductQuotes(false);
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontSize: 22,
                  cursor: "pointer"
                }}
              >
                <MdClose />
              </button>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <p
                style={{
                  fontSize: 15,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginTop: 0,
                  marginBottom: 20
                }}
              >
                {selectedMoreProduct.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginBottom: 22
                }}
              >
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Plan Type</div>
                  <div style={{ fontWeight: 800, color: "#0f172a" }}>Standard</div>
                </div>

                <div
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Claim Support</div>
                  <div style={{ fontWeight: 800, color: "#0f172a" }}>24/7 Available</div>
                </div>

                <div
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Processing</div>
                  <div style={{ fontWeight: 800, color: "#0f172a" }}>Quick Approval</div>
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "18px",
                  padding: "18px",
                  border: "1px solid #e2e8f0",
                  marginBottom: 22
                }}
              >
                <h3 style={{ margin: "0 0 14px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                  What's Included
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 12
                  }}
                >
                  {selectedMoreProduct.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "12px 14px",
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#334155"
                      }}
                    >
                      ✅ {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                  Why Choose This Plan
                </h3>

                <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", lineHeight: 1.8, fontSize: 14 }}>
                  <li>Affordable pricing with flexible coverage options</li>
                  <li>Fast quote comparison and easy policy purchase</li>
                  <li>Trusted assistance and smooth claim support</li>
                  <li>Suitable for users looking for reliable everyday protection</li>
                </ul>
              </div>

              {showMoreProductQuotes && (
                <div
                  style={{
                    marginBottom: 20,
                    background: "#f1f5f9",
                    borderRadius: "16px",
                    padding: "16px",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <h3 style={{ margin: "0 0 12px 0" }}>Available Quotes</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {moreProductQuotes.map((quote, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 14px",
                          borderRadius: "12px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700 }}>{quote.company}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{quote.cover}</div>
                        </div>
                        <div style={{ fontWeight: 800, color: "#0284c7" }}>{quote.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 14 }}>
                <button
                  onClick={() => handleBuyMoreProduct(selectedMoreProduct)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg, #0284c7, #38bdf8)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(56,189,248,0.28)"
                  }}
                >
                  Buy Now
                </button>

                <button
                  onClick={() => setShowMoreProductQuotes(true)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "14px",
                    border: "1px solid #38bdf8",
                    background: "#ffffff",
                    color: "#0284c7",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: "pointer"
                  }}
                >
                  View Prices
                </button>

                <button
                  onClick={() => {
                    setSelectedMoreProduct(null);
                    setShowMoreProductQuotes(false);
                  }}
                  style={{
                    padding: "14px 18px",
                    borderRadius: "14px",
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
        </div>
      )}

      <Partners />

      <div style={{ margin: "40px -20px -20px -20px" }}>
        <Footer />
      </div>
    </div>
  );
};

export default UserDashboard;