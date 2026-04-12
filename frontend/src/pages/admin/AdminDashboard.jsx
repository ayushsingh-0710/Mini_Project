import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import {
  MdPeople, MdPolicy, MdAssignment, MdAttachMoney,
  MdTrendingUp, MdTrendingDown, MdArrowUpward, MdArrowDownward,
  MdCheckCircle, MdSchedule, MdWarning, MdFiberManualRecord
} from 'react-icons/md';
import Partners from '../../components/Partners';
import { usePortal } from '../../context/PortalContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#475569', fontSize: 12, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'revenue' ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    revenueData: [],
    policyTypeData: [],
    recentActivity: [],
    recentClaims: [],
    stats: {
      totalPolicies: { value: '0', change: '0%', up: true },
      totalRevenue: { value: '₹0', change: '0%', up: true },
      activeClaims: { value: '0', change: '0%', up: false },
      totalClients: { value: '0', change: '0%', up: true },
      renewalsDue: { value: '0', change: '0%', up: false },
      claimRatio: { value: '0%', change: '0%', up: true }
    }
  });
  const [loading, setLoading] = useState(true);
  const { refreshKey } = usePortal();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('https://mini-project-g2lv.onrender.com/api/admin/dashboard');
        const data = await response.json();
        if(response.ok) {
          setDashboardData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [refreshKey]);

  const { revenueData, policyTypeData, recentActivity, recentClaims, stats } = dashboardData;

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard...</div>;

  return (
    <div className="page-container">
      {/* Stats Grid */}
      <div className="stats-grid">
        {[
          { label: 'Total Policies',    value: stats.totalPolicies?.value || '0',       change: stats.totalPolicies?.change || '0%',    up: stats.totalPolicies?.up ?? true,  icon: <MdPolicy />,       color: 'blue',   sub: 'vs last month' },
          { label: 'Total Revenue',     value: stats.totalRevenue?.value || '₹0',      change: stats.totalRevenue?.change || '0%',    up: stats.totalRevenue?.up ?? true,  icon: <MdAttachMoney />,  color: 'green',  sub: 'vs last month' },
          { label: 'Active Claims',     value: stats.activeClaims?.value || '0',       change: stats.activeClaims?.change || '0%',    up: stats.activeClaims?.up ?? false, icon: <MdAssignment />,   color: 'amber',  sub: 'needs attention' },
          { label: 'Total Clients',     value: stats.totalClients?.value || '0',       change: stats.totalClients?.change || '0%',    up: stats.totalClients?.up ?? true,  icon: <MdPeople />,       color: 'purple', sub: 'registered users' },
          { label: 'Renewals Due',      value: stats.renewalsDue?.value || '0',       change: stats.renewalsDue?.change || '0%',    up: stats.renewalsDue?.up ?? false, icon: <MdSchedule />,     color: 'rose',   sub: 'this month' },
          { label: 'Claim Ratio',       value: stats.claimRatio?.value || '0%',      change: stats.claimRatio?.change || '0%',    up: stats.claimRatio?.up ?? true,  icon: <MdTrendingUp />,   color: 'cyan',   sub: 'settlement rate' },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-card-top">
              <div className="stat-label">{s.label}</div>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
              {s.up ? <MdArrowUpward style={{ fontSize: 14 }} /> : <MdArrowDownward style={{ fontSize: 14 }} />}
              {s.change} <span>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Revenue Area Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Revenue & Claims Overview</div>
              <div className="chart-subtitle">Monthly performance – FY 2025-26</div>
            </div>
            <span className="chart-badge">↑ 0% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="clmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)" name="revenue" dot={false} />
              <Area type="monotone" dataKey="claims"  stroke="#f59e0b" strokeWidth={2} fill="url(#clmGrad)" name="claims" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Policy Distribution Pie */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Policy Distribution</div>
              <div className="chart-subtitle">By insurance type</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={policyTypeData} cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                dataKey="value" paddingAngle={3} stroke="none">
                {policyTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {policyTypeData.map((d) => (
              <div key={d.name} className="pie-legend-item">
                <div className="pie-legend-dot" style={{ background: d.color }} />
                <span className="pie-legend-label">{d.name}</span>
                <span className="pie-legend-val">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Claims Table + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* Recent Claims */}
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-card-title">Recent Claims</div>
              <div className="table-card-subtitle">Latest submission activity</div>
            </div>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Holder</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: '#60a5fa', fontWeight: 600 }}>{c.id}</td>
                  <td className="name-cell">{c.holder}</td>
                  <td style={{ color: '#0f172a', fontWeight: 700 }}>{c.amount}</td>
                  <td><span className={`badge badge-${c.status}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
                  <td>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Live Activity</div>
              <div className="chart-subtitle">Real-time system events</div>
            </div>
            <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', animation: 'pulse-dot 2s infinite' }} />
          </div>
          <div className="activity-list">
            {recentActivity.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                <div className="activity-content">
                  <div className="activity-title">{a.title}</div>
                  <div className="activity-meta">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Growth Bar Chart */}
      <div className="chart-card" style={{ marginTop: 20 }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Monthly Policy Issuance</div>
            <div className="chart-subtitle">New policies issued per month</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8 }} />
            <Bar dataKey="policies" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Policies Issued">
              {revenueData.map((entry, index) => (
                <Cell key={index} fill={`hsl(${220 + index * 4}, 80%, ${50 + index * 1.5}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Partners Grid */}
      <Partners />
    </div>
  );
};

export default AdminDashboard;
