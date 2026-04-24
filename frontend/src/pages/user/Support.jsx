import React from "react";
import { MdCall, MdEmail, MdChat, MdHelpOutline, MdArrowForward } from "react-icons/md";

const Support = () => {
  const supportCards = [
    {
      title: "Call Support",
      icon: <MdCall style={{ fontSize: 34, color: "#0284c7" }} />,
      text: "Talk directly to our support team for policy, claim, or payment help.",
      action: () => alert("📞 Support Number: +91 98765 43210"),
      color: "rgba(2,132,199,0.12)"
    },
    {
      title: "Email Support",
      icon: <MdEmail style={{ fontSize: 34, color: "#16a34a" }} />,
      text: "Send us your issue details and we will get back to you quickly.",
      action: () => alert("📧 support@easyinsure.com"),
      color: "rgba(34,197,94,0.12)"
    },
    {
      title: "Live Chat",
      icon: <MdChat style={{ fontSize: 34, color: "#f59e0b" }} />,
      text: "Get instant help from our support desk through live chat.",
      action: () => alert("💬 Live chat feature coming soon"),
      color: "rgba(245,158,11,0.12)"
    },
    {
      title: "FAQs",
      icon: <MdHelpOutline style={{ fontSize: 34, color: "#8b5cf6" }} />,
      text: "Find answers to the most common insurance related questions.",
      action: () => alert("❓ FAQ section coming soon"),
      color: "rgba(139,92,246,0.12)"
    }
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Support Center</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Need help with policies, payments, claims, or account issues? Choose any support option below.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20
        }}
      >
        {supportCards.map((card) => (
          <div
            key={card.title}
            className="chart-card"
            onClick={card.action}
            style={{
              padding: 24,
              borderRadius: 24,
              cursor: "pointer",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
              transition: "all 0.25s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 16px 34px rgba(15,23,42,0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(15,23,42,0.06)";
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: "18px",
                background: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18
              }}
            >
              {card.icon}
            </div>

            <h3 style={{ marginBottom: 10, fontSize: 18, fontWeight: 800 }}>{card.title}</h3>

            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
              {card.text}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#0284c7",
                fontSize: 13,
                fontWeight: 700
              }}
            >
              Get Help <MdArrowForward />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;