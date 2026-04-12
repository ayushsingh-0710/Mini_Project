import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdBlock, MdCheckCircle, MdVisibility, MdEmail, MdPhone } from 'react-icons/md';
import { usePortal } from '../../context/PortalContext';

const initialUsers = [];

const avatarColors = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#f43f5e','#06b6d4','#ec4899','#14b8a6'];

const UserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState(user || { name: '', email: '', phone: '', city: '', status: 'active' });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{user ? 'Edit User' : 'Add New User'}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="e.g. Priya Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="user@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" placeholder="Mumbai" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>{user ? 'Save Changes' : 'Add User'}</button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { refreshKey } = usePortal();

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if(data.data) setUsers(data.data);
      })
      .catch(console.error);
  }, [refreshKey]);

  const toggleStatus = async (id) => {
    // find user first to get what the new status should be
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveUser = async (formData) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const result = await res.json();
        setUsers(prev => [...prev, result.data]);
        setModal(null);
      }
    } catch (err) {
      console.error('Error saving user', err);
    }
  };

  const filtered = users.filter(u => {
    if (statusFilter !== 'All' && u.status !== statusFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>User Management</h1>
          <p>{users.length} registered clients · {users.filter(u => u.status === 'active').length} active</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('add'); }}><MdAdd /> Add User</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Users', val: users.length, color: 'blue' },
          { label: 'Active', val: users.filter(u => u.status === 'active').length, color: 'green' },
          { label: 'Inactive', val: users.filter(u => u.status === 'inactive').length, color: 'amber' },
          { label: 'Blocked', val: users.filter(u => u.status === 'blocked').length, color: 'rose' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`} style={{ padding: '16px 20px' }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 26, marginTop: 8 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-row">
        <input className="filter-input" placeholder="🔍  Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All', 'active', 'inactive', 'blocked'].map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Users Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map((u, i) => (
          <div key={u.id} className="chart-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>
              {u.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{u.name}</span>
                <span className={`badge badge-${u.status === 'active' ? 'active' : u.status === 'blocked' ? 'rejected' : 'pending'}`} style={{ fontSize: 10 }}>
                  {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdEmail style={{ fontSize: 13 }} />{u.email}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <MdPhone style={{ fontSize: 13 }} />{u.phone}
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Policies</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue-light)' }}>{u.policies}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{u.city}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Joined</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.joined}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-xs" onClick={() => { setSelected(u); setModal('edit'); }}><MdEdit /> Edit</button>
                <button className={`btn btn-xs ${u.status === 'blocked' ? 'btn-success' : 'btn-danger'}`} onClick={() => toggleStatus(u.id)}>
                  {u.status === 'blocked' ? <><MdCheckCircle /> Unblock</> : <><MdBlock /> Block</>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && <UserModal user={selected} onClose={() => setModal(null)} onSave={handleSaveUser} />}
    </div>
  );
};

export default UserManagement;
