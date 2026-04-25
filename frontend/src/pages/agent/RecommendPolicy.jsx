import React, { useState } from 'react';

const RecommendPolicy = () => {
  const [form, setForm] = useState({
    client: '',
    age: '',
    need: 'Health',
    budget: ''
  });

  const [result, setResult] = useState('');

  const recommend = (e) => {
    e.preventDefault();

    if (form.need === 'Health') {
      setResult('Recommended Policy: Health Secure Plus');
    } else if (form.need === 'Life') {
      setResult('Recommended Policy: Life Shield Plan');
    } else if (form.need === 'Motor') {
      setResult('Recommended Policy: Vehicle Protect');
    } else {
      setResult('Recommended Policy: Family Care Plan');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Recommend Policy</h1>
          <p>Suggest the best policy based on customer requirements.</p>
        </div>
      </div>

      <div className="chart-card">
        <form onSubmit={recommend} style={{ display: 'grid', gap: 16 }}>
          <input
            className="form-input"
            placeholder="Client Name"
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            required
          />

          <input
            className="form-input"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />

          <select
            className="form-select"
            value={form.need}
            onChange={(e) => setForm({ ...form, need: e.target.value })}
          >
            <option>Health</option>
            <option>Life</option>
            <option>Motor</option>
            <option>Family</option>
          </select>

          <input
            className="form-input"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            required
          />

          <button className="btn btn-primary" type="submit">
            Recommend
          </button>
        </form>

        {result && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'rgba(16,185,129,0.08)' }}>
            <h3 style={{ color: 'var(--emerald-light)', marginBottom: 6 }}>
              {result}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              This policy matches the customer’s selected need and budget preference.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendPolicy;