import React from 'react';
import { MdPeople, MdPolicy, MdAssignment, MdTrendingUp } from 'react-icons/md';

const AgentDashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Agent Dashboard</h1>
          <p>Manage leads, clients, quotes, policies, sales and commission.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 28 }}>
        {[
          { label: 'Assigned Leads', val: 12, color: 'blue', sub: '+4 this week' },
          { label: 'Policies Sold', val: 8, color: 'green', sub: 'active sales' },
          { label: 'Quotes Created', val: 15, color: 'amber', sub: 'pending follow-up' },
          { label: 'Commission', val: '₹24,500', color: 'purple', sub: 'this month' },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-change up">
              <span>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <h3>Today’s Agent Tasks</h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Client</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>

            <tbody>
              {[
                ['Call new health lead', 'Riya Sharma', 'Pending', 'High'],
                ['Send quote document', 'Amit Verma', 'In Progress', 'Medium'],
                ['Follow up premium payment', 'Neha Singh', 'Pending', 'High'],
                ['Recommend life policy', 'Rahul Jain', 'Completed', 'Low'],
              ].map((r, i) => (
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>
                    <span className={r[2] === 'Completed' ? 'badge badge-active' : 'badge badge-pending'}>
                      {r[2]}
                    </span>
                  </td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 24 }}>
        <div className="chart-card">
          <h3>Lead Summary</h3>
          <p style={{ color: 'var(--text-secondary)' }}>New leads assigned for customer follow-up and policy discussion.</p>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10, color: 'var(--blue-light)' }}>
            <MdPeople /> 12
          </div>
        </div>

        <div className="chart-card">
          <h3>Policy Performance</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Track policies recommended and sold by you.</p>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10, color: 'var(--emerald-light)' }}>
            <MdPolicy /> 8
          </div>
        </div>

        <div className="chart-card">
          <h3>Quote Activity</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Quotes generated for interested customers.</p>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10, color: 'var(--amber)' }}>
            <MdAssignment /> 15
          </div>
        </div>

        <div className="chart-card">
          <h3>Sales Growth</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Your sales and commission growth overview.</p>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10, color: '#8b5cf6' }}>
            <MdTrendingUp /> +18%
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;