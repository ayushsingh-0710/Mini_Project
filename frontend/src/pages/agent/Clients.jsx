import React from 'react';

const Clients = () => {
  const clients = [
    { name: 'Riya Sharma', policy: 'Health Secure Plus', status: 'Active', premium: '₹12,000/year' },
    { name: 'Amit Verma', policy: 'Life Shield Plan', status: 'Pending', premium: '₹9,500/year' },
    { name: 'Neha Singh', policy: 'Vehicle Protect', status: 'Active', premium: '₹6,000/year' },
    { name: 'Rahul Jain', policy: 'Family Care Plan', status: 'In Progress', premium: '₹18,000/year' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Clients</h1>
          <p>Manage your converted customers and policyholders.</p>
        </div>
      </div>

      <div className="chart-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Policy</th>
              <th>Premium</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.policy}</td>
                <td>{c.premium}</td>
                <td>
                  <span className={c.status === 'Active' ? 'badge badge-active' : 'badge badge-pending'}>
                    {c.status}
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

export default Clients;