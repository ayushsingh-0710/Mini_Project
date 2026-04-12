import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MdSearch, MdNotifications, MdRefresh, MdFullscreen, MdMenu, MdClose, MdPolicy, MdAssignment, MdPeople, MdSupportAgent } from 'react-icons/md';
import { usePortal } from '../context/PortalContext';
import { useNavigate } from 'react-router-dom';

const API = 'https://mini-project-g2lv.onrender.com/api/admin';

const pageMeta = {
  '/admin/dashboard':  { title: 'Dashboard', subtitle: 'Welcome back, Admin! Here\'s what\'s happening today.' },
  '/admin/policies':   { title: 'Policy Management', subtitle: 'Create, view, and manage all insurance policies.' },
  '/admin/claims':     { title: 'Claims Management', subtitle: 'Review and process customer claims.' },
  '/admin/users':      { title: 'User Management', subtitle: 'Manage policyholders and client accounts.' },
  '/admin/agents':     { title: 'Agents', subtitle: 'Manage your insurance agents and their performance.' },
  '/admin/reports':    { title: 'Reports & Analytics', subtitle: 'In-depth insights and business intelligence.' },
  '/admin/settings':   { title: 'Settings', subtitle: 'Configure system preferences and notifications.' },
  '/user/dashboard':   { title: 'My Dashboard', subtitle: 'Welcome back! Here\'s your policy overview.' },
  '/user/policies':    { title: 'My Policies', subtitle: 'View and manage your active insurance policies.' },
  '/user/claims':      { title: 'My Claims', subtitle: 'Track and submit your insurance claims.' },
  '/user/payments':    { title: 'Payments', subtitle: 'View your payment history and upcoming dues.' },
  '/user/profile':     { title: 'My Profile', subtitle: 'Manage your personal information and preferences.' },
  '/user/support':     { title: 'Support & Help', subtitle: 'Get help and answers to your questions.' },
};

// Category config for result display
const categoryConfig = {
  policy:  { icon: <MdPolicy />,       label: 'Policy',  color: '#3b82f6', path: '/admin/policies' },
  claim:   { icon: <MdAssignment />,   label: 'Claim',   color: '#f59e0b', path: '/admin/claims' },
  user:    { icon: <MdPeople />,       label: 'User',    color: '#10b981', path: '/admin/users' },
  agent:   { icon: <MdSupportAgent />, label: 'Agent',   color: '#8b5cf6', path: '/admin/agents' },
};

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Header = ({ currentPath, onMenuClick }) => {
  const { portal, triggerRefresh } = usePortal();
  const navigate = useNavigate();
  const meta = pageMeta[currentPath] || { title: 'InsureIQ', subtitle: '' };

  // Search state
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [allData, setAllData] = useState({ policies: [], claims: [], users: [], agents: [] });
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(search, 250);

  // Refresh / notification state
  const [spinning, setSpinning] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const notifRef = useRef(null);

  // Preload all data once for instant search
  useEffect(() => {
    const preload = async () => {
      try {
        const [pRes, cRes, uRes, aRes] = await Promise.all([
          fetch(`${API}/policies`),
          fetch(`${API}/claims`),
          fetch(`${API}/users`),
          fetch(`${API}/agents`),
        ]);
        const [pData, cData, uData, aData] = await Promise.all([
          pRes.json(), cRes.json(), uRes.json(), aRes.json()
        ]);
        setAllData({
          policies: pData.data || [],
          claims: cData.data || [],
          users: uData.data || [],
          agents: aData.data || [],
        });
      } catch (e) {
        console.error('Preload failed', e);
      }
    };
    preload();
  }, []);

  // Run search against preloaded data
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      setShowSearchDrop(false);
      return;
    }
    setSearchLoading(true);
    const q = debouncedSearch.toLowerCase();

    const policyMatches = allData.policies
      .filter(p => p.id?.toLowerCase().includes(q) || p.holder?.toLowerCase().includes(q) || p.type?.toLowerCase().includes(q) || p.plan?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(p => ({ kind: 'policy', id: p.id, title: p.id, subtitle: `${p.holder} · ${p.type} · ${p.status}`, status: p.status }));

    const claimMatches = allData.claims
      .filter(c => c.id?.toLowerCase().includes(q) || c.holder?.toLowerCase().includes(q) || c.type?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ kind: 'claim', id: c.id, title: c.id, subtitle: `${c.holder} · ${c.type} · ${c.status}`, status: c.status }));

    const userMatches = allData.users
      .filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.city?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(u => ({ kind: 'user', id: u.id, title: u.name, subtitle: `${u.email} · ${u.city}`, status: u.status }));

    const agentMatches = allData.agents
      .filter(a => a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.specialization?.toLowerCase().includes(q))
      .slice(0, 2)
      .map(a => ({ kind: 'agent', id: a.id, title: a.name, subtitle: `${a.specialization} · ${a.city}`, status: a.status }));

    const results = [...policyMatches, ...claimMatches, ...userMatches, ...agentMatches];
    setSearchResults(results);
    setShowSearchDrop(true);
    setSearchLoading(false);
  }, [debouncedSearch, allData]);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDrop(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleResultClick = (result) => {
    navigate(categoryConfig[result.kind].path);
    setSearch('');
    setShowSearchDrop(false);
  };

  // Notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/dashboard`);
      const data = await res.json();
      if (res.ok && data.data?.recentActivity) {
        const notifs = data.data.recentActivity.map((a, i) => ({
          id: i, title: a.title, time: a.time, color: a.color, read: false,
        }));
        setNotifications(notifs);
        setUnreadCount(notifs.length);
      }
    } catch (e) {
      setNotifications([
        { id: 0, title: 'New policy issued: AUTO-892', time: '5 mins ago', color: '#10b981', read: false },
        { id: 1, title: 'Claim CLM-419 approved', time: '12 mins ago', color: '#3b82f6', read: false },
        { id: 2, title: 'New user registration', time: '1 hour ago', color: '#8b5cf6', read: false },
        { id: 3, title: 'Payment failed for HLT-223', time: '2 hours ago', color: '#ef4444', read: false },
      ]);
      setUnreadCount(4);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  // Close notif on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRefresh = () => {
    setSpinning(true);
    triggerRefresh();
    fetchNotifications();
    setTimeout(() => setSpinning(false), 800);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const dismissNotif = (id) => {
    setNotifications(prev => {
      const n = prev.find(n => n.id === id);
      if (n && !n.read) setUnreadCount(c => Math.max(0, c - 1));
      return prev.filter(n => n.id !== id);
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const statusColor = { active: '#10b981', approved: '#10b981', pending: '#f59e0b', review: '#3b82f6', expired: '#6b7280', blocked: '#ef4444', rejected: '#ef4444' };

  return (
    <>
      <div className={`portal-indicator ${portal === 'user' ? 'user-portal' : ''}`} />
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="hamburger-toggle" onClick={onMenuClick} title="Toggle Sidebar">
            <MdMenu />
          </button>
          <div className="header-title">
            <h2 className="page-title">{meta.title}</h2>
            <p className="page-subtitle">{meta.subtitle}</p>
          </div>
        </div>

        <div className="header-actions">

          {/* Search Bar */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <div className="header-search" style={{ width: showSearchDrop ? 340 : 220, transition: 'width 0.3s ease' }}>
              <MdSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search policies, claims, users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchDrop(true)}
              />
              {search && (
                <button onClick={() => { setSearch(''); setShowSearchDrop(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px', display: 'flex', alignItems: 'center' }}>
                  <MdClose style={{ fontSize: 16 }} />
                </button>
              )}
            </div>

            {showSearchDrop && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 380, background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: 14,
                boxShadow: '0 12px 40px rgba(0,0,0,0.18)', zIndex: 999, overflow: 'hidden'
              }}>
                {searchLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No results for "<strong>{search}</strong>"</div>
                  </div>
                ) : (
                  <>
                    {/* Group results by kind */}
                    {['policy', 'claim', 'user', 'agent'].map(kind => {
                      const group = searchResults.filter(r => r.kind === kind);
                      if (!group.length) return null;
                      const cfg = categoryConfig[kind];
                      return (
                        <div key={kind}>
                          <div style={{ padding: '8px 16px 4px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', background: 'rgba(0,0,0,0.02)' }}>
                            {cfg.label}s
                          </div>
                          {group.map(result => (
                            <div
                              key={result.id}
                              onClick={() => handleResultClick(result)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 16px', cursor: 'pointer',
                                borderBottom: '1px solid var(--border)',
                                transition: 'background 0.15s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.06)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: `${cfg.color}18`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: cfg.color, fontSize: 16, flexShrink: 0
                              }}>
                                {cfg.icon}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{result.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.subtitle}</div>
                              </div>
                              {result.status && (
                                <div style={{
                                  width: 7, height: 7, borderRadius: '50%',
                                  background: statusColor[result.status] || '#6b7280',
                                  flexShrink: 0
                                }} />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: 'var(--blue-light)', fontWeight: 600 }}>
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Refresh */}
          <button className="icon-btn" title="Refresh Page Data" onClick={handleRefresh}>
            <MdRefresh style={{ transition: 'transform 0.8s ease', transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)' }} />
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="icon-btn" title="Notifications" onClick={() => { setShowNotifs(v => !v); if (!showNotifs && unreadCount > 0) markAllRead(); }}>
              <MdNotifications />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-base)' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 340, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.18)', zIndex: 999, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Notifications</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{unreadCount === 0 ? 'All caught up!' : `${unreadCount} unread`}</div>
                  </div>
                  <button style={{ fontSize: 11, color: 'var(--blue-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }} onClick={markAllRead}>Mark all read</button>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>🎉 No notifications</div>
                  ) : notifications.map(n => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(59,130,246,0.04)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, marginTop: 5, flexShrink: 0, boxShadow: `0 0 6px ${n.color}` }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
                      </div>
                      <button onClick={() => dismissNotif(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, opacity: 0.6, flexShrink: 0 }} title="Dismiss">
                        <MdClose style={{ fontSize: 14 }} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                  <button style={{ fontSize: 12, color: 'var(--blue-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }} onClick={fetchNotifications}>Refresh notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button className="icon-btn" title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} onClick={toggleFullscreen}>
            <MdFullscreen />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
