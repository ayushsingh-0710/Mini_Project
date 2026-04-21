import React, { useEffect, useState } from "react";
import { getUserData, saveUserData } from "../../utils/storage";
import { MdAdd, MdUpload, MdCheckCircle } from "react-icons/md";

const NewClaimModal = ({ onClose, onSubmit, policies }) => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    policy: "",
    type: "",
    amount: "",
    description: "",
    incidentDate: "",
    documents: {
      medicalBills: null,
      doctorReport: null,
      firReport: null,
      idProof: null
    }
  });

  const documentFields = [
    { key: "medicalBills", label: "Medical Bills / Receipts" },
    { key: "doctorReport", label: "Doctor's Report / Prescription" },
    { key: "firReport", label: "FIR / Police Report (if applicable)" },
    { key: "idProof", label: "ID Proof" }
  ];

  const handleFileChange = (field, file) => {
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.policy || !form.type) {
        alert("Please select policy and claim type");
        return;
      }
    }

    if (step === 2) {
      if (!form.amount || !form.description || !form.incidentDate) {
        alert("Please fill all claim details");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handleSubmitClaim = () => {
    if (!form.policy || !form.type || !form.amount || !form.description || !form.incidentDate) {
      alert("Please fill all claim details");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 580, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">File New Claim — Step {step} of 3</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ padding: "0 24px", paddingTop: 16 }}>
          <div className="progress-bar-wrap">
            <div className="progress-bar blue" style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              marginBottom: 4
            }}
          >
            {["Policy Select", "Claim Details", "Documents"].map((label, i) => (
              <span
                key={label}
                style={{
                  fontSize: 11,
                  color: i + 1 <= step ? "var(--blue-light)" : "var(--text-muted)",
                  fontWeight: i + 1 <= step ? 600 : 400
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Select Policy</label>
                <select
                  className="form-select"
                  value={form.policy}
                  onChange={(e) => setForm({ ...form, policy: e.target.value })}
                >
                  <option value="">— Choose a policy —</option>
                  {policies.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Claim Type</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">— Select claim type —</option>
                  <option>Hospitalization</option>
                  <option>Surgery</option>
                  <option>Accident</option>
                  <option>Critical Illness</option>
                  <option>Property Damage</option>
                  <option>Other</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label className="form-label">Claim Amount (₹)</label>
                <input
                  className="form-input"
                  placeholder="e.g. 25,000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Incident Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.incidentDate}
                  onChange={(e) => setForm({ ...form, incidentDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Briefly describe the incident and reason for claim..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  marginBottom: 16,
                  lineHeight: 1.6
                }}
              >
                Please upload supporting documents (bills, reports, photos). Max 10MB per file.
              </p>

              {documentFields.map((doc) => (
                <div
                  key={doc.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: 10,
                    border: "1px dashed rgba(0,0,0,0.1)",
                    marginBottom: 10,
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {doc.label}
                    </span>

                    {form.documents[doc.key] && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--blue-light)",
                          marginTop: 4
                        }}
                      >
                        {form.documents[doc.key].name}
                      </span>
                    )}
                  </div>

                  <label className="btn btn-success" style={{ cursor: "pointer" }}>
                    <MdUpload /> Upload
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                    />
                  </label>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}

          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          {step < 3 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmitClaim}>
              <MdCheckCircle /> Submit Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyClaims = () => {
  const [modal, setModal] = useState(false);
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const data = getUserData();

    setClaims(data.claims || []);

    const defaultPolicies = [
      { id: 1, name: "Motor & Car Insurance" },
      { id: 2, name: "Home Insurance" },
      { id: 3, name: "Medical Insurance" }
    ];

    setPolicies(
      data.policies && data.policies.length > 0 ? data.policies : defaultPolicies
    );
  }, []);

  const handleSubmitClaim = (form) => {
    const data = getUserData();

    if (!data.claims) data.claims = [];
    if (!data.notifications) data.notifications = [];

    const newClaim = {
      id: `CLM-${Date.now()}`,
      plan: form.policy,
      type: form.type,
      status: "pending",
      description: form.description,
      amount: `₹${form.amount}`,
      filed: new Date().toLocaleDateString(),
      incidentDate: form.incidentDate,
      documents: {
        medicalBills: form.documents.medicalBills ? form.documents.medicalBills.name : "",
        doctorReport: form.documents.doctorReport ? form.documents.doctorReport.name : "",
        firReport: form.documents.firReport ? form.documents.firReport.name : "",
        idProof: form.documents.idProof ? form.documents.idProof.name : ""
      },
      timeline: [
        {
          label: "Claim Filed",
          date: new Date().toLocaleDateString(),
          done: true,
          active: false
        },
        {
          label: "Under Review",
          date: "In Progress",
          done: true,
          active: true
        },
        {
          label: "Approved",
          date: "Pending",
          done: false,
          active: false
        },
        {
          label: "Payment Disbursed",
          date: "Pending",
          done: false,
          active: false
        }
      ]
    };

    data.claims.unshift(newClaim);

    data.notifications.unshift({
      id: Date.now(),
      message: `Claim submitted for ${form.policy}`,
      time: new Date().toLocaleString()
    });

    saveUserData(data);
    setClaims(data.claims);
    setModal(false);

    alert("✅ Claim submitted successfully");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Claims</h1>
          <p>
            {claims.length} total claims · {claims.filter((c) => c.status === "approved").length} approved
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <MdAdd /> File New Claim
          </button>
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="chart-card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No claims yet</h3>
            <p>File a claim when you need to claim your insurance benefits</p>
            <button
              className="btn btn-primary"
              style={{ margin: "16px auto" }}
              onClick={() => setModal(true)}
            >
              <MdAdd /> File First Claim
            </button>
          </div>
        </div>
      ) : (
        claims.map((claim) => (
          <div key={claim.id} className="chart-card" style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: "var(--blue-light)", fontWeight: 700, fontSize: 15 }}>
                    {claim.id}
                  </span>
                  <span className={`badge badge-${claim.status}`}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    marginBottom: 3
                  }}
                >
                  {claim.plan} ({claim.type})
                </div>

                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {claim.description}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color:
                      claim.status === "approved"
                        ? "var(--emerald-light)"
                        : "var(--text-primary)"
                  }}
                >
                  {claim.amount}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Filed: {claim.filed}
                </div>
              </div>
            </div>

            <div className="claim-timeline">
              {claim.timeline.map((step, i) => (
                <div key={i} className="timeline-item">
                  <div
                    className={`timeline-dot ${
                      step.done ? (step.active ? "active" : "done") : "pending"
                    }`}
                  >
                    {step.done && !step.active && (
                      <span style={{ fontSize: 10, color: "var(--emerald)" }}>✓</span>
                    )}
                  </div>

                  <div className="timeline-content">
                    <div
                      className="timeline-title"
                      style={{
                        color: step.done ? "var(--text-primary)" : "var(--text-muted)"
                      }}
                    >
                      {step.label}
                    </div>
                    <div className="timeline-meta">{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {modal && (
        <NewClaimModal
          onClose={() => setModal(false)}
          onSubmit={handleSubmitClaim}
          policies={policies}
        />
      )}
    </div>
  );
};

export default MyClaims;