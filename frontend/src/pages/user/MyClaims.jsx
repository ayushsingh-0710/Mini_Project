import React, { useState } from 'react';
import { MdAdd, MdUpload, MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';

const myClaims = [];

const NewClaimModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ policy: '', type: '', amount: '', description: '' });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">File New Claim — Step {step} of 3</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {/* Progress */}
        <div style={{ padding: '0 24px', paddingTop: 16 }}>
          <div className="progress-bar-wrap">
            <div className="progress-bar blue" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, marginBottom: 4 }}>
            {['Policy Select', 'Claim Details', 'Documents'].map((l, i) => (
              <span key={l} style={{ fontSize: 11, color: i + 1 <= step ? 'var(--blue-light)' : 'var(--text-muted)', fontWeight: i + 1 <= step ? 600 : 400 }}>{l}</span>
            ))}
          </div>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Select Policy</label>
                <select className="form-select" value={form.policy} onChange={e => setForm({ ...form, policy: e.target.value })}>
                  <option value="">— Choose a policy —</option>
                  <option value="POL-2891">POL-2891 · Health Plus Pro</option>
                  <option value="POL-2856">POL-2856 · Life Shield Premium</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Claim Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="">— Select claim type —</option>
                  <option>Hospitalization</option><option>Surgery</option><option>Accident</option>
                  <option>Critical Illness</option><option>Property Damage</option><option>Other</option>
                </select>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="form-group">
                <label className="form-label">Claim Amount (₹)</label>
                <input className="form-input" placeholder="e.g. 25,000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Incident Date</label>
                <input className="form-input" type="date" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Briefly describe the incident and reason for claim..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                Please upload supporting documents (bills, reports, photos). Max 10MB per file.
              </p>
              {['Medical Bills / Receipts', 'Doctor\'s Report / Prescription', 'FIR / Police Report (if applicable)', 'ID Proof'].map(d => (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: 10, border: '1px dashed rgba(0,0,0,0.1)', marginBottom: 10, cursor: 'pointer' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d}</span>
                  <button className="btn btn-secondary btn-xs"><MdUpload /> Upload</button>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="modal-footer">
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {step < 3
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button className="btn btn-success" onClick={onClose}><MdCheckCircle /> Submit Claim</button>
          }
        </div>
      </div>
    </div>
  );
};

const MyClaims = () => {
  const [modal, setModal] = useState(false);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Claims</h1>
          <p>{myClaims.length} total claims · {myClaims.filter(c => c.status === 'approved').length} approved</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal(true)}><MdAdd /> File New Claim</button>
        </div>
      </div>

      {/* Claims */}
      {myClaims.map(c => (
        <div key={c.id} className="chart-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: 'var(--blue-light)', fontWeight: 700, fontSize: 15 }}>{c.id}</span>
                <span className={`badge badge-${c.status}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 3 }}>{c.plan} ({c.type})</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.description}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.status === 'approved' ? 'var(--emerald-light)' : 'var(--text-primary)' }}>{c.amount}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Filed: {c.filed}</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="claim-timeline">
            {c.timeline.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className={`timeline-dot ${t.done ? (t.active ? 'active' : 'done') : 'pending'}`}>
                  {t.done && !t.active && <span style={{ fontSize: 10, color: 'var(--emerald)' }}>✓</span>}
                </div>
                <div className="timeline-content">
                  <div className="timeline-title" style={{ color: t.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{t.label}</div>
                  <div className="timeline-meta">{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty if no claims */}
      {myClaims.length === 0 && (
        <div className="chart-card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No claims yet</h3>
            <p>File a claim when you need to claim your insurance benefits</p>
            <button className="btn btn-primary" style={{ margin: '16px auto' }} onClick={() => setModal(true)}><MdAdd /> File First Claim</button>
          </div>
        </div>
      )}

      {modal && <NewClaimModal onClose={() => setModal(false)} />}
    </div>
  );
};

export default MyClaims;
