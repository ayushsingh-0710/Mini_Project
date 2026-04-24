import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/storage";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const data = getUserData();
    const policies = data.policies || [];

    const paymentData = policies.map((policy, index) => ({
      id: `PAY-${policy.id}`,
      policyName: policy.name,
      amount: `₹${(index + 1) * 1500}`,
      status: "paid",
      paidAt: policy.boughtAt || new Date().toLocaleString()
    }));

    setPayments(paymentData);
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Payments</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          View your policy payment history and status.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="chart-card">
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <h3>No payments yet</h3>
            <p>Your payment records will appear here.</p>
          </div>
        </div>
      ) : (
        payments.map((payment) => (
          <div key={payment.id} className="chart-card" style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{payment.policyName}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Payment ID: {payment.id}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Paid At: {payment.paidAt}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{payment.amount}</div>
                <span className="badge badge-approved">{payment.status}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Payments;