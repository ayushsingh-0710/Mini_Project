import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/storage";
import { MdDescription, MdCheckCircle, MdPendingActions, MdPayments } from "react-icons/md";

const ClaimStatus = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const data = getUserData();
    setClaims(data.claims || []);
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Claim Status</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Track your submitted claims, view their progress, and check the latest updates.
        </p>
      </div>

      {claims.length === 0 ? (
        <div
          className="chart-card"
          style={{
            borderRadius: 24,
            padding: 34,
            textAlign: "center",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)"
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 14 }}>📄</div>
          <h3 style={{ marginBottom: 8 }}>No claims found</h3>
          <p style={{ color: "var(--text-secondary)" }}>You have not filed any claims yet.</p>
        </div>
      ) : (
        claims.map((claim) => (
          <div
            key={claim.id}
            className="chart-card"
            style={{
              marginBottom: 22,
              borderRadius: 24,
              padding: 24,
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.8)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(56,189,248,0.14)",
                      color: "#0284c7",
                      fontWeight: 800,
                      fontSize: 12
                    }}
                  >
                    {claim.id}
                  </span>

                  <span className={`badge badge-${claim.status}`}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>
                  {claim.plan} ({claim.type})
                </div>

                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 640 }}>
                  {claim.description}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{claim.amount}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Filed: {claim.filed}</div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
                marginBottom: 22
              }}
            >
              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "rgba(2,132,199,0.08)",
                  display: "flex",
                  gap: 10,
                  alignItems: "center"
                }}
              >
                <MdDescription style={{ fontSize: 22, color: "#0284c7" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Claim Type</div>
                  <div style={{ fontWeight: 700 }}>{claim.type}</div>
                </div>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "rgba(234,179,8,0.10)",
                  display: "flex",
                  gap: 10,
                  alignItems: "center"
                }}
              >
                <MdPendingActions style={{ fontSize: 22, color: "#ca8a04" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Current Status</div>
                  <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{claim.status}</div>
                </div>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "rgba(34,197,94,0.10)",
                  display: "flex",
                  gap: 10,
                  alignItems: "center"
                }}
              >
                <MdPayments style={{ fontSize: 22, color: "#16a34a" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Amount</div>
                  <div style={{ fontWeight: 700 }}>{claim.amount}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(248,250,252,0.95)",
                borderRadius: 18,
                padding: 18,
                border: "1px solid #e2e8f0"
              }}
            >
              <h4 style={{ margin: "0 0 14px 0", fontSize: 15, fontWeight: 800 }}>Claim Progress</h4>

              <div className="claim-timeline">
                {claim.timeline?.map((step, idx) => (
                  <div key={idx} className="timeline-item">
                    <div
                      className={`timeline-dot ${
                        step.done ? (step.active ? "active" : "done") : "pending"
                      }`}
                    >
                      {step.done && !step.active && (
                        <span style={{ fontSize: 10, color: "var(--emerald)" }}>
                          <MdCheckCircle />
                        </span>
                      )}
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-title">{step.label}</div>
                      <div className="timeline-meta">{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClaimStatus;