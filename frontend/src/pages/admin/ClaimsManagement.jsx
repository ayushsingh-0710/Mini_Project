import React, { useState, useEffect } from 'react';
import { MdAdd, MdCheckCircle, MdCancel, MdVisibility, MdDownload, MdFilterList } from 'react-icons/md';
import { usePortal } from '../../context/PortalContext';
import API_BASE_URL from '../../apiConfig';

const initialClaims = [];

const NewClaimModal = ({ isOpen, onClose, data, setData, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">New Claim</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Holder Name</label>
                <input required style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: 13 }} value={data.holder} onChange={e => setData({ ...data, holder: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Policy ID</label>
                <input required style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: 13 }} value={data.policy} placeholder="e.g. POL-1004" onChange={e => setData({ ...data, policy: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Claim Type</label>
                <select style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: 13 }} value={data.type} onChange={e => setData({ ...data, type: e.target.value })}>
                  <option value="Health">Health</option>
                  <option value="Auto">Auto</option>
                  <option value="Life">Life</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Claim Amount</label>
                <input required style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: 13 }} value={data.amount} placeholder="e.g. ₹50,000" onChange={e => setData({ ...data, amount: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Filed Date</label>
                <input type="date" required style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: 13 }} value={data.filed} onChange={e => setData({ ...data, filed: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Agent Name</label>
                <input required style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: 13 }} value={data.agent} onChange={e => setData({ ...data, agent: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Reason / Description</label>
              <textarea required style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: 13 }} rows="3" value={data.reason} onChange={e => setData({ ...data, reason: e.target.value })} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><MdAdd style={{ marginRight: 4 }} /> Submit Claim</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClaimDetailModal = ({ claim, onClose, onApprove, onReject }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <span className="modal-title">Claim Details — {claim.id}</span>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        {[
          ['Claim ID', claim.id], ['Policy Holder', claim.holder],
          ['Policy ID', claim.policy], ['Insurance Type', claim.claimType],
          ['Claim Amount', `₹${Number(claim.amount || 0).toLocaleString('en-IN')}`],
          ['Filed On', claim.date], ['Handled By', claim.agent],
        ].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{l}</span>
            <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 12, display: 'block', marginBottom: 6 }}>REASON / DESCRIPTION</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{claim.description}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Status</span>
          <span className={`badge badge-${claim.status}`}>{claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</span>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
        {claim.status === 'pending' || claim.status === 'review' ? (
          <>
            <button className="btn btn-danger" onClick={() => { onReject(claim.id); onClose(); }}>
              <MdCancel /> Reject
            </button>
            <button className="btn btn-success" onClick={() => { onApprove(claim.id); onClose(); }}>
              <MdCheckCircle /> Approve
            </button>
          </>
        ) : null}
      </div>
    </div>
  </div>
);

const ClaimsManagement = () => {
  const [claims, setClaims] = useState(initialClaims);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({ status: 'All', type: 'All', search: '' });
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [newClaimData, setNewClaimData] = useState({ holder: '', policy: '', type: 'Health', amount: '', filed: '', agent: '', reason: '' });
  const { refreshKey } = usePortal();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/claims`)
      .then(res => res.json())
      .then(data => {
        if(data && data.data) {
          const mapped = data.data.map(c => ({
            id: c._id || 'Unknown ID',
            holder: c.userId?.name || c.userId || 'Unknown',
            policy: c.policyName || 'Standard',
            claimType: c.claimType || 'Unknown',
            amount: Number(c.amount || 0),
            date: c.date ? new Date(c.date).toLocaleDateString() : 'N/A',
            agent: 'Portal / Autocreated',
            description: c.description || 'N/A',
            status: c.status || 'pending'
          }));
          setClaims(mapped);
        } else {
          setClaims([]);
        }
      })
      .catch(err => {
        console.error(err);
        setClaims([]);
      });
  }, [refreshKey]);

  const approve = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/claims/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    } catch (err) { console.error(err); }
  };

  const reject = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/claims/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    } catch (err) { console.error(err); }
  };

  const handleAddClaim = async (e) => {
    e.preventDefault();
    try {
      // Basic formatting for amount if user forgets rupee symbol, though optional
      let formattedAmount = newClaimData.amount;
      if (!formattedAmount.startsWith('₹')) {
        formattedAmount = `₹${formattedAmount}`;
      }
      
      const payload = { ...newClaimData, amount: formattedAmount };
      
      const res = await fetch(`${API_BASE_URL}/api/admin/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();
        setClaims(prev => [result.data, ...prev]);
        setIsNewClaimOpen(false);
        setNewClaimData({ holder: '', policy: '', type: 'Health', amount: '', filed: '', agent: '', reason: '' });
      }
    } catch (err) { console.error('Error creating claim:', err); }
  };

  const filtered = claims.filter(c => {
    if (filter.status !== 'All' && c.status !== filter.status) return false;
    if (filter.type !== 'All' && c.claimType !== filter.type) return false;
    if (filter.search && !c.holder.toLowerCase().includes(filter.search.toLowerCase()) && !c.id.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const counts = { total: claims.length, pending: claims.filter(c => c.status === 'pending').length, approved: claims.filter(c => c.status === 'approved').length, review: claims.filter(c => c.status === 'review').length, rejected: claims.filter(c => c.status === 'rejected').length };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Claims Management</h1>
          <p>{counts.pending} pending · {counts.review} under review · {counts.approved} approved</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setIsNewClaimOpen(true)}><MdAdd /> New Claim</button>
          <button className="btn btn-secondary"><MdDownload /> Export</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Claims',  val: counts.total,    color: 'blue' },
          { label: 'Pending',       val: counts.pending,  color: 'amber' },
          { label: 'Under Review',  val: counts.review,   color: 'purple' },
          { label: 'Approved',      val: counts.approved, color: 'green' },
          { label: 'Rejected',      val: counts.rejected, color: 'rose' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`} style={{ padding: '16px 20px' }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 26, marginTop: 8 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-row">
        <input className="filter-input" placeholder="🔍  Search by holder name or claim ID..." value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} />
        <select className="filter-select" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
          {['All', 'pending', 'review', 'approved', 'rejected'].map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select className="filter-select" value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
          {['All', 'Health', 'Life', 'Auto', 'Home', 'Travel'].map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
        </select>
      </div>

      {/* Claims Table */}
      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">All Claims</div>
            <div className="table-card-subtitle">Showing {filtered.length} of {claims.length}</div>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Claim ID</th><th>Holder</th><th>Policy</th><th>Type</th>
              <th>Amount</th><th>Filed</th><th>Agent</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ color: '#60a5fa', fontWeight: 700 }}>{c.id}</td>
                <td className="name-cell">{c.holder}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.policy}</td>
                <td>{c.claimType}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 700 }}>₹{Number(c.amount || 0).toLocaleString('en-IN')}</td>
                <td style={{ fontSize: 12 }}>{c.date}</td>
                <td style={{ fontSize: 12 }}>{c.agent}</td>
                <td><span className={`badge badge-${c.status}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button className="btn btn-secondary btn-xs" onClick={() => setSelected(c)}><MdVisibility /></button>
                    {(c.status === 'pending' || c.status === 'review') && (
                      <>
                        <button className="btn btn-success btn-xs" onClick={() => approve(c.id)}><MdCheckCircle /></button>
                        <button className="btn btn-danger btn-xs" onClick={() => reject(c.id)}><MdCancel /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <h3>No claims found</h3>
            <p>Adjust your search or filters</p>
          </div>
        )}
      </div>

      {selected && <ClaimDetailModal claim={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />}
      <NewClaimModal isOpen={isNewClaimOpen} onClose={() => setIsNewClaimOpen(false)} data={newClaimData} setData={setNewClaimData} onSubmit={handleAddClaim} />
    </div>
  );
};

export default ClaimsManagement;
