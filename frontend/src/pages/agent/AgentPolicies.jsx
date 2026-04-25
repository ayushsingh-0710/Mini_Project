import React from 'react';

const AgentPolicies = () => {
  const policies = [
    { name: 'Health Secure Plus', type: 'Health', premium: '₹12,000/year', coverage: '₹5,00,000' },
    { name: 'Life Shield Plan', type: 'Life', premium: '₹9,500/year', coverage: '₹10,00,000' },
    { name: 'Vehicle Protect', type: 'Motor', premium: '₹6,000/year', coverage: '₹3,00,000' },
    { name: 'Family Care Plan', type: 'Health', premium: '₹18,000/year', coverage: '₹8,00,000' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Available Policies</h1>
          <p>Policies available for agent recommendation and sale.</p>
        </div>
      </div>

      <div className="chart-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Type</th>
                <th>Premium</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.premium}</td>
                  <td>{p.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentPolicies;