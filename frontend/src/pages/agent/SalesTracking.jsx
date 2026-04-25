import React from 'react';

const SalesTracking = () => {
  const sales = [
    ['Health Secure Plus', 'Riya Sharma', '₹12,000', 'Completed'],
    ['Life Shield Plan', 'Amit Verma', '₹9,500', 'Pending'],
    ['Vehicle Protect', 'Neha Singh', '₹6,000', 'Completed'],
    ['Family Care Plan', 'Rahul Jain', '₹18,000', 'In Progress'],
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Sales Tracking</h1>
          <p>Track sold policies and pending conversions.</p>
        </div>
      </div>

      <div className="chart-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Policy</th>
              <th>Client</th>
              <th>Premium</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((s, i) => (
              <tr key={i}>
                <td>{s[0]}</td>
                <td>{s[1]}</td>
                <td>{s[2]}</td>
                <td>
                  <span className={s[3] === 'Completed' ? 'badge badge-active' : 'badge badge-pending'}>
                    {s[3]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTracking;