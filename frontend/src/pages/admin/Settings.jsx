import React, { useState, useEffect } from 'react';
import { MdSave, MdNotifications, MdSecurity, MdPalette, MdBusiness, MdEmail } from 'react-icons/md';

const API = 'https://mini-project-g2lv.onrender.com/api/admin';
const sections = ['General', 'Notifications', 'Security', 'Appearance', 'Email Templates', 'Billing'];

const Settings = () => {
  const [activeSection, setActiveSection] = useState('General');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [toggles, setToggles] = useState({
    emailNotif: true, smsNotif: false, pushNotif: true,
    claimAlerts: true, renewalReminders: true, paymentAlerts: true,
    twoFactor: false, sessionTimeout: true, ipWhitelist: false,
    darkMode: true, compactView: false, animations: true,
  });
  const [company, setCompany] = useState({ name: 'InsureIQ Pvt. Ltd.', email: 'admin@insureiq.com', phone: '+91 98100 00000', address: '12, Insurance Tower, BKC, Mumbai – 400051', website: 'www.insureiq.com', gstin: '27AABCI1234A1Z5' });
  const [appearance, setAppearance] = useState({ accentColor: '#3b82f6', sidebarWidth: 'Default (260px)' });
  const [password, setPassword] = useState({ newPassword: '', confirmPassword: '' });
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API}/settings`);
        const data = await res.json();
        if (res.ok && data.data) {
          setCompany(prev => ({ ...prev, ...data.data.company }));
          setToggles(prev => ({ ...prev, ...data.data.toggles }));
          setAppearance(prev => ({ ...prev, ...data.data.appearance }));
        }
      } catch (e) {
        console.error('Failed to fetch settings', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`${API}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, toggles, appearance })
      });
      const data = await res.json();
      setSaveMsg(res.ok ? '✓ Settings saved successfully' : data.message || 'Error saving');
    } catch (e) {
      setSaveMsg('Failed to connect to server');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handlePasswordUpdate = async () => {
    setPwdMsg('');
    try {
      const res = await fetch(`${API}/settings/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(password)
      });
      const data = await res.json();
      setPwdMsg(res.ok ? '✓ ' + data.message : '✗ ' + (data.message || 'Error'));
      if (res.ok) setPassword({ newPassword: '', confirmPassword: '' });
    } catch (e) {
      setPwdMsg('Failed to connect to server');
    } finally {
      setTimeout(() => setPwdMsg(''), 4000);
    }
  };

  const Toggle = ({ k }) => (
    <label className="toggle-switch">
      <input type="checkbox" checked={toggles[k]} onChange={() => setToggles(p => ({ ...p, [k]: !p[k] }))} />
      <span className="toggle-slider" />
    </label>
  );

  if (loading) return <div className="page-container">Loading settings...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Configure your InsureIQ platform preferences</p>
        </div>
        <div className="page-header-actions">
          {saveMsg && <span style={{ fontSize: 13, color: saveMsg.startsWith('✓') ? '#10b981' : '#ef4444', fontWeight: 600 }}>{saveMsg}</span>}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <MdSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px' }}>
            {sections.map(s => (
              <div key={s} className={`settings-nav-item ${activeSection === s ? 'active' : ''}`} onClick={() => setActiveSection(s)}>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div>
          {activeSection === 'General' && (
            <>
              <div className="settings-section">
                <div className="settings-section-title">Company Information</div>
                <div className="settings-section-desc">Update your organization's basic details</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input className="form-input" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admin Email</label>
                    <input className="form-input" type="email" value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input className="form-input" value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Registered Address</label>
                  <textarea className="form-textarea" value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} rows={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">GSTIN</label>
                  <input className="form-input" value={company.gstin} onChange={e => setCompany({ ...company, gstin: e.target.value })} style={{ maxWidth: 260 }} />
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-section-title">System Preferences</div>
                <div className="settings-section-desc">Configure system-wide defaults</div>
                <div className="setting-row">
                  <div><div className="setting-row-label">Compact View</div><div className="setting-row-desc">Reduce padding and spacing in tables</div></div>
                  <Toggle k="compactView" />
                </div>
                <div className="setting-row">
                  <div><div className="setting-row-label">Enable Animations</div><div className="setting-row-desc">Smooth transitions across the UI</div></div>
                  <Toggle k="animations" />
                </div>
              </div>
            </>
          )}

          {activeSection === 'Notifications' && (
            <>
              <div className="settings-section">
                <div className="settings-section-title">Notification Channels</div>
                <div className="settings-section-desc">Choose how you receive alerts</div>
                <div className="setting-row">
                  <div><div className="setting-row-label">Email Notifications</div><div className="setting-row-desc">Receive updates via email</div></div>
                  <Toggle k="emailNotif" />
                </div>
                <div className="setting-row">
                  <div><div className="setting-row-label">SMS Notifications</div><div className="setting-row-desc">Receive alerts via SMS</div></div>
                  <Toggle k="smsNotif" />
                </div>
                <div className="setting-row">
                  <div><div className="setting-row-label">Push Notifications</div><div className="setting-row-desc">Browser push notifications</div></div>
                  <Toggle k="pushNotif" />
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-section-title">Alert Types</div>
                <div className="settings-section-desc">Select which events trigger notifications</div>
                <div className="setting-row">
                  <div><div className="setting-row-label">Claim Alerts</div><div className="setting-row-desc">New submissions and status changes</div></div>
                  <Toggle k="claimAlerts" />
                </div>
                <div className="setting-row">
                  <div><div className="setting-row-label">Renewal Reminders</div><div className="setting-row-desc">Policy renewal due notifications</div></div>
                  <Toggle k="renewalReminders" />
                </div>
                <div className="setting-row">
                  <div><div className="setting-row-label">Payment Alerts</div><div className="setting-row-desc">Premium payment confirmations</div></div>
                  <Toggle k="paymentAlerts" />
                </div>
              </div>
            </>
          )}

          {activeSection === 'Security' && (
            <div className="settings-section">
              <div className="settings-section-title">Security Settings</div>
              <div className="settings-section-desc">Protect your admin account and data</div>
              <div className="setting-row">
                <div><div className="setting-row-label">Two-Factor Authentication</div><div className="setting-row-desc">Require OTP on every login</div></div>
                <Toggle k="twoFactor" />
              </div>
              <div className="setting-row">
                <div><div className="setting-row-label">Session Timeout</div><div className="setting-row-desc">Auto logout after 30 minutes of inactivity</div></div>
                <Toggle k="sessionTimeout" />
              </div>
              <div className="setting-row">
                <div><div className="setting-row-label">IP Whitelist</div><div className="setting-row-desc">Restrict access to specific IP addresses</div></div>
                <Toggle k="ipWhitelist" />
              </div>
              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Change Admin Password</label>
                <input className="form-input" type="password" placeholder="New password" style={{ marginBottom: 10 }} value={password.newPassword} onChange={e => setPassword({ ...password, newPassword: e.target.value })} />
                <input className="form-input" type="password" placeholder="Confirm new password" value={password.confirmPassword} onChange={e => setPassword({ ...password, confirmPassword: e.target.value })} />
              </div>
              {pwdMsg && <div style={{ fontSize: 13, fontWeight: 600, color: pwdMsg.startsWith('✓') ? '#10b981' : '#ef4444', marginBottom: 10 }}>{pwdMsg}</div>}
              <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={handlePasswordUpdate}><MdSecurity /> Update Password</button>
            </div>
          )}

          {activeSection === 'Appearance' && (
            <div className="settings-section">
              <div className="settings-section-title">Appearance</div>
              <div className="settings-section-desc">Customize the look and feel of the dashboard</div>
              <div className="setting-row">
                <div><div className="setting-row-label">Dark Mode</div><div className="setting-row-desc">Use dark theme across the application</div></div>
                <Toggle k="darkMode" />
              </div>
              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Primary Accent Color</label>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  {['#3b82f6','#10b981','#8b5cf6','#f59e0b','#f43f5e','#06b6d4'].map(c => (
                    <div key={c} onClick={() => setAppearance({ ...appearance, accentColor: c })} style={{ width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer', border: c === appearance.accentColor ? '3px solid white' : '3px solid transparent', transition: 'all 0.2s', boxShadow: c === appearance.accentColor ? `0 0 0 2px ${c}` : 'none' }} />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Sidebar Width</label>
                <select className="form-select" style={{ maxWidth: 200 }} value={appearance.sidebarWidth} onChange={e => setAppearance({ ...appearance, sidebarWidth: e.target.value })}>
                  <option>Compact (220px)</option>
                  <option>Default (260px)</option>
                  <option>Wide (300px)</option>
                </select>
              </div>
            </div>
          )}

          {(activeSection === 'Email Templates' || activeSection === 'Billing') && (
            <div className="settings-section">
              <div className="settings-section-title">{activeSection}</div>
              <div className="settings-section-desc">Configure {activeSection.toLowerCase()} settings</div>
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-state-icon">{activeSection === 'Email Templates' ? '📧' : '💳'}</div>
                <h3>Coming Soon</h3>
                <p>This section is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
