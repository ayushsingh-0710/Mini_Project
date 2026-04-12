import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdFilterList, MdDownload } from 'react-icons/md';
import { usePortal } from '../../context/PortalContext';

const initialPolicies = [];

const typeColors = { Health: 'green', Life: 'blue', Auto: 'amber', Home: 'purple', Travel: 'cyan' };

const PolicyModal = ({ policy, onClose }) => {
  const isEdit = !!policy;
  const [form, setForm] = useState(policy || { holder: '', type: 'Health', plan: '', premium: '', coverage: '', agent: '', status: 'active' });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Policy' : 'Create New Policy'}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Policy Holder</label>
              <input className="form-input" placeholder="Full name" value={form.holder} onChange={e => setForm({ ...form, holder: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Insurance Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {['Health', 'Life', 'Auto', 'Home', 'Travel'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Plan Name</label>
            <input className="form-input" placeholder="e.g. Health Plus Pro" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Annual Premium (₹)</label>
              <input className="form-input" placeholder="12,500" value={form.premium} onChange={e => setForm({ ...form, premium: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Coverage Amount (₹)</label>
              <input className="form-input" placeholder="10,00,000" value={form.coverage} onChange={e => setForm({ ...form, coverage: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assigned Agent</label>
              <select className="form-select" value={form.agent} onChange={e => setForm({ ...form, agent: e.target.value })}>
                <option>Ravi Kumar</option>
                <option>Sneha Kapoor</option>
                <option>Deepak Nair</option>
                <option>Meena Das</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>
            {isEdit ? 'Save Changes' : 'Create Policy'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewModal = ({ policy, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <span className="modal-title">Policy Details — {policy.id}</span>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        {[
          ['Policy ID', policy.id], ['Holder', policy.holder], ['Type', policy.type],
          ['Plan', policy.plan], ['Premium', policy.premium], ['Coverage', policy.coverage],
          ['Start Date', policy.start], ['End Date', policy.end], ['Agent', policy.agent],
        ].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{l}</span>
            <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Status</span>
          <span className={`badge badge-${policy.status}`}>{policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}</span>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

const PolicyManagement = () => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({ type: 'All', status: 'All', search: '' });
  const { refreshKey } = usePortal();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/policies');
        const data = await response.json();
        if (response.ok) {
          setPolicies(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch policies', err);
      }
    };
    fetchPolicies();
  }, [refreshKey]);

  const filtered = policies.filter(p => {
    if (filter.type !== 'All' && p.type !== filter.type) return false;
    if (filter.status !== 'All' && p.status !== filter.status) return false;
    if (filter.search && !p.holder.toLowerCase().includes(filter.search.toLowerCase()) && !p.id.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/policies/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPolicies(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete policy', err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Policy Management</h1>
          <p>Total {policies.length} policies · {policies.filter(p => p.status === 'active').length} active</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><MdDownload /> Export</button>
          <button className="btn btn-primary" onClick={() => setModal('create')}><MdAdd /> New Policy</button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Policies', value: policies.length, color: 'blue' },
          { label: 'Active', value: policies.filter(p => p.status === 'active').length, color: 'green' },
          { label: 'Pending', value: policies.filter(p => p.status === 'pending').length, color: 'amber' },
          { label: 'Expired', value: policies.filter(p => p.status === 'expired').length, color: 'rose' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`} style={{ padding: '16px 20px' }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 28, marginTop: 8 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-row">
        <input className="filter-input" placeholder="🔍  Search by holder name or policy ID..." value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} />
        <select className="filter-select" value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
          {['All', 'Health', 'Life', 'Auto', 'Home', 'Travel'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="filter-select" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
          {['All', 'active', 'pending', 'expired'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">All Policies</div>
            <div className="table-card-subtitle">Showing {filtered.length} of {policies.length} policies</div>
          </div>
          <button className="btn btn-secondary btn-sm"><MdFilterList /> Filter</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Policy ID</th>
              <th>Holder</th>
              <th>Type</th>
              <th>Plan</th>
              <th>Premium</th>
              <th>Coverage</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ color: '#60a5fa', fontWeight: 700 }}>{p.id}</td>
                <td className="name-cell">{p.holder}</td>
                <td>
                  <span className={`badge badge-${typeColors[p.type] === 'blue' ? 'review' : typeColors[p.type] === 'green' ? 'active' : typeColors[p.type] === 'amber' ? 'pending' : 'approved'}`} style={{ fontSize: 10 }}>{p.type}</span>
                </td>
                <td>{p.plan}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.premium}</td>
                <td style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>{p.coverage}</td>
                <td style={{ fontSize: 12 }}>{p.start} → {p.end}</td>
                <td><span className={`badge badge-${p.status}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-xs" onClick={() => { setSelected(p); setModal('view'); }}><MdVisibility /></button>
                    <button className="btn btn-secondary btn-xs" onClick={() => { setSelected(p); setModal('edit'); }}><MdEdit /></button>
                    <button className="btn btn-danger btn-xs" onClick={() => handleDelete(p.id)}><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No policies found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>

      {modal === 'create' && <PolicyModal onClose={() => setModal(null)} />}
      {modal === 'edit' && <PolicyModal policy={selected} onClose={() => setModal(null)} />}
      {modal === 'view' && <ViewModal policy={selected} onClose={() => setModal(null)} />}
    </div>
  );
};

export default PolicyManagement;
