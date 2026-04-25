import React from 'react';

const Commission = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Commission</h1>
          <p>View monthly earnings and commission history.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
        <div className="stat-card green">
          <div className="stat-label">Current Month</div>
          <div className="stat-value">₹24,500</div>
          <div className="stat-change up">earned</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-label">Pending</div>
          <div className="stat-value">₹8,200</div>
          <div className="stat-change up">to be released</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-label">Total</div>
          <div className="stat-value">₹1,45,000</div>
          <div className="stat-change up">lifetime</div>
        </div>
      </div>

      <div className="chart-card">
        <h3>Commission History</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Policies Sold</th>
              <th>Commission</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>January</td>
              <td>6</td>
              <td>₹18,000</td>
            </tr>
            <tr>
              <td>February</td>
              <td>8</td>
              <td>₹24,500</td>
            </tr>
            <tr>
              <td>March</td>
              <td>5</td>
              <td>₹15,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Commission;