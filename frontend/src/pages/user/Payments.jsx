import React, { useState } from 'react';
import { MdCreditCard, MdDownload, MdCheckCircle } from 'react-icons/md';

const transactions = [];

const upcoming = [];

const PayModal = ({ payment, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <span className="modal-title">Pay Premium</span>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '20px', marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Amount Due</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)' }}>{payment.amount}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{payment.policy}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select className="form-select">
            <option>UPI</option><option>Net Banking</option>
            <option>Credit Card</option><option>Debit Card</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">UPI ID / Card Number</label>
          <input className="form-input" placeholder="Enter UPI ID or card number" />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-success" onClick={onClose}><MdCheckCircle /> Pay {payment.amount}</button>
      </div>
    </div>
  </div>
);

const Payments = () => {
  const [payModal, setPayModal] = useState(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Payments</h1>
          <p>Manage your premium payments and view transaction history</p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="payment-summary-card">
        <div>
          <div className="payment-total-label">Total Paid This Year</div>
          <div className="payment-total-amount">₹0</div>
          <div className="payment-total-sub">Across 0 insurance policies</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Next Payment Due</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--rose-light)' }}>₹0</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No upcoming payments</div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Upcoming Payments</div>
            <div className="chart-subtitle">Don't miss your due dates</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {upcoming.map((u, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: u.urgent ? 'rgba(244,63,94,0.07)' : 'rgba(0,0,0,0.03)', border: `1px solid ${u.urgent ? 'rgba(244,63,94,0.2)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: u.urgent ? 'rgba(244,63,94,0.15)' : 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {u.urgent ? '⚠️' : '💳'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{u.policy}</div>
                  <div style={{ fontSize: 12, color: u.urgent ? 'var(--rose-light)' : 'var(--text-muted)' }}>Due: {u.due}{u.urgent ? ' — URGENT' : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: u.urgent ? 'var(--rose-light)' : 'var(--text-primary)' }}>{u.amount}</span>
                <button className="btn btn-primary btn-sm" onClick={() => setPayModal(u)}><MdCreditCard /> Pay Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">Transaction History</div>
            <div className="table-card-subtitle">{transactions.length} payments recorded</div>
          </div>
          <button className="btn btn-secondary btn-sm"><MdDownload /> Export</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Txn ID</th><th>Policy</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th><th>Receipt</th></tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td style={{ color: '#60a5fa', fontWeight: 700 }}>{t.id}</td>
                <td className="name-cell">{t.policy}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{t.amount}</td>
                <td style={{ fontSize: 12 }}>{t.date}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{t.method}</td>
                <td><span className="badge badge-paid">Paid</span></td>
                <td><button className="btn btn-secondary btn-xs"><MdDownload /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payModal && <PayModal payment={payModal} onClose={() => setPayModal(null)} />}
    </div>
  );
};

export default Payments;
