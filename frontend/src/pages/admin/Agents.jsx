import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdStar, MdStarBorder, MdPhone, MdEmail, MdLocationOn, MdTrendingUp } from 'react-icons/md';
import { usePortal } from '../../context/PortalContext';

const initialAgents = [];

const agentColors = ['linear-gradient(135deg, #3b82f6, #8b5cf6)', 'linear-gradient(135deg, #10b981, #06b6d4)', 'linear-gradient(135deg, #f59e0b, #f43f5e)', 'linear-gradient(135deg, #8b5cf6, #f43f5e)', 'linear-gradient(135deg, #06b6d4, #10b981)'];

const AgentModal = ({ agent, onClose, onSave }) => {
  const [form, setForm] = useState(agent || { name: '', email: '', phone: '', city: '', specialization: 'Health & Life' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = agent 
        ? `https://mini-project-g2lv.onrender.com/api/admin/agents/${agent.id}`
        : 'https://mini-project-g2lv.onrender.com/api/admin/agents';
      const method = agent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      if (response.ok) {
        onSave(data.data);
        onClose();
      } else {
        alert(data.message || 'Error saving agent');
      }
    } catch (err) {
      console.error('Failed to save agent', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{agent ? 'Edit Agent' : 'Add New Agent'}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Agent full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="agent@insureiq.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" placeholder="Mumbai" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <select className="form-select" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}>
                <option>Health & Life</option><option>Life & Travel</option>
                <option>Home & Auto</option><option>Health & Auto</option><option>Travel & Life</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : (agent ? 'Save Changes' : 'Add Agent')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const { refreshKey } = usePortal();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('https://mini-project-g2lv.onrender.com/api/admin/agents');
        const data = await response.json();
        if (response.ok) {
          setAgents(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch agents', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [refreshKey]);

  const handleSave = (savedAgent) => {
    if (selected) {
      setAgents(agents.map(a => a.id === savedAgent.id ? savedAgent : a));
    } else {
      setAgents([...agents, savedAgent]);
    }
  };

  const renderStars = (rating) => {
    return [1,2,3,4,5].map(s => (
      s <= Math.floor(rating)
        ? <MdStar key={s} style={{ color: '#f59e0b', fontSize: 14 }} />
        : <MdStarBorder key={s} style={{ color: '#4b5a72', fontSize: 14 }} />
    ));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Agents</h1>
          <p>{agents.length} agents · {agents.filter(a => a.status === 'active').length} active</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('add'); }}><MdAdd /> Add Agent</button>
        </div>
      </div>

      {/* Leaderboard Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 28 }}>
        {[
          { label: 'Total Agents', val: agents.length, color: 'blue', sub: 'registered' },
          { label: 'Total Policies', val: agents.length ? agents.reduce((a, c) => a + c.policies, 0) : 0, color: 'green', sub: 'managed' },
          { label: 'Total Claims', val: agents.length ? agents.reduce((a, c) => a + c.claims, 0) : 0, color: 'amber', sub: 'handled' },
          { label: 'Top Rating', val: agents.length ? Math.max(...agents.map(a => a.rating)) : 0, color: 'purple', sub: 'avg score' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`} style={{ padding: '16px 20px' }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 26, marginTop: 8 }}>{s.val}</div>
            <div className="stat-change up"><span>{s.sub}</span></div>
          </div>
        ))}
      </div>

      {/* Agents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {agents.map((a, i) => (
          <div key={a.id} className="chart-card" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Top Gradient Strip */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: agentColors[i % agentColors.length] }} />

            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: agentColors[i % agentColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                {a.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 2 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--blue-light)', fontWeight: 600, marginBottom: 4 }}>{a.specialization}</div>
                  </div>
                  <span className={`badge ${a.status === 'active' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: 10 }}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {renderStars(a.rating)}
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 4 }}>{a.rating}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {[
                { icon: <MdEmail style={{ fontSize: 13 }} />, val: a.email },
                { icon: <MdPhone style={{ fontSize: 13 }} />, val: a.phone },
                { icon: <MdLocationOn style={{ fontSize: 13 }} />, val: `${a.city} · Joined ${a.joined}` },
              ].map((r, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.icon}</span>{r.val}
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Policies', val: a.policies, color: 'var(--blue-light)' },
                { label: 'Claims', val: a.claims, color: 'var(--amber)' },
                { label: 'Revenue', val: a.revenue, color: 'var(--emerald-light)' },
              ].map(m => (
                <div key={m.label} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setSelected(a); setModal('edit'); }}>
              <MdEdit /> Edit Agent
            </button>
          </div>
        ))}
      </div>

      {modal && (
        <AgentModal 
          agent={selected} 
          onClose={() => setModal(null)} 
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Agents;
