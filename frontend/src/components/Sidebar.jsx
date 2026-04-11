import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import {
  MdDashboard, MdPolicy, MdAssignment, MdPeople, MdSupervisorAccount,
  MdBarChart, MdSettings, MdShield, MdCreditCard, MdAccountCircle,
  MdHeadsetMic, MdLogout, MdKeyboardArrowRight, MdLocalHospital,
  MdAutorenew, MdVideocam, MdChat, MdCall, MdChatBubbleOutline, MdOutlineShield, MdClose,
  MdStore, MdFactCheck, MdShoppingCart, MdInfoOutline
} from 'react-icons/md';

const adminNav = [
  { section: 'MAIN', items: [
    { icon: <MdDashboard />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <MdPolicy />, label: 'Policies', path: '/admin/policies', badge: null },
    { icon: <MdAssignment />, label: 'Claims', path: '/admin/claims', badge: null },
    { icon: <MdPeople />, label: 'Users', path: '/admin/users' },
    { icon: <MdSupervisorAccount />, label: 'Agents', path: '/admin/agents' },
  ]},
  { section: 'INSIGHTS', items: [
    { icon: <MdBarChart />, label: 'Reports', path: '/admin/reports' },
    { icon: <MdSettings />, label: 'Settings', path: '/admin/settings' },
  ]},
];

const normalUserNav = [
  { section: 'MY ACCOUNT', items: [
    { icon: <MdPolicy />, label: 'My Policies', path: '/user/policies' },
    { icon: <MdShoppingCart />, label: 'Buy Policy', path: '/user/buy-policy' },
  ]},
  { section: 'CLAIMS & SUPPORT', items: [
    { icon: <MdAssignment />, label: 'File a Claim', path: '/user/claims', badge: null },
    { icon: <MdInfoOutline />, label: 'Claim Status', path: '/user/claim-status' },
    { icon: <MdAccountCircle />, label: 'Profile', path: '/user/profile' },
  ]},
];

const userAdminNav = [
  { section: 'BRANCH MANAGEMENT', items: [
    { icon: <MdPeople />, label: 'Manage Customers', path: '/user/manage-customers' },
    { icon: <MdPolicy />, label: 'Assigned Policies', path: '/user/assigned-policies' },
    { icon: <MdFactCheck />, label: 'Claim Verification', path: '/user/claim-verification' },
    { icon: <MdBarChart />, label: 'Branch Analytics', path: '/user/branch-analytics' },
  ]},
];

const Sidebar = ({ isOpen, onClose }) => {
  const { portal, switchPortal, userRole, switchUserRole } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  let navItems = adminNav;
  if (portal === 'user') {
    navItems = userRole === 'admin' ? userAdminNav : normalUserNav;
  }

  const handleSwitch = (p) => {
    switchPortal(p);
    navigate(p === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  };

  const handleNav = (path) => navigate(path);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div className="logo-icon">
            <MdOutlineShield style={{ color: '#fff', fontSize: 20 }} />
          </div>
          <div className="logo-text">
            <span className="logo-name">SOLIDARITY</span>
            <span className="logo-tagline">Insurance Services</span>
          </div>
        </div>
        {/* Animated Close Button */}
        <button className="sidebar-close-btn" onClick={onClose} title="Close Sidebar">
          <MdClose />
        </button>
      </div>

      {/* Portal Toggle */}
      <div className="sidebar-portal-toggle">
        <div className="portal-toggle-btns">
          <button
            className={`portal-btn ${portal === 'admin' ? 'active' : ''}`}
            onClick={() => handleSwitch('admin')}
          >
            Admin
          </button>
          <button
            className={`portal-btn ${portal === 'user' ? 'active' : ''}`}
            onClick={() => handleSwitch('user')}
          >
            User
          </button>
        </div>
      </div>

      {/* Sub-role Toggle for User Mode */}
      {portal === 'user' && (
        <div className="sidebar-portal-toggle" style={{ marginTop: '0', paddingTop: '0' }}>
          <div className="portal-toggle-btns" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '4px' }}>
            <button
              className={`portal-btn ${userRole === 'normal' ? 'active' : ''}`}
              onClick={() => switchUserRole('normal')}
              style={{ fontSize: '0.8rem', padding: '6px' }}
            >
              Normal User
            </button>
            <button
              className={`portal-btn ${userRole === 'admin' ? 'active' : ''}`}
              onClick={() => switchUserRole('admin')}
              style={{ fontSize: '0.8rem', padding: '6px' }}
            >
              User Admin
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => (
              <div
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer User Card */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className={`user-avatar ${portal === 'admin' ? 'admin' : 'user-av'}`}>
            {portal === 'admin' ? 'A' : 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">
              {portal === 'admin' ? 'Admin User' : (userRole === 'admin' ? 'Agent Manager' : 'John Doe')}
            </div>
            <div className="user-role">
              {portal === 'admin' ? 'Super Administrator' : (userRole === 'admin' ? 'User Admin' : 'Customer')}
            </div>
          </div>
          <MdKeyboardArrowRight style={{ color: 'var(--text-muted)', fontSize: 18 }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
