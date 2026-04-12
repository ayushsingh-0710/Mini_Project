import React, { useState, useEffect } from 'react';
import { MdDownload, MdDateRange, MdTrendingUp } from 'react-icons/md';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { usePortal } from '../../context/PortalContext';

const monthlyData = [];

const typeRevenueData = [];

const agentPerf = [];

const settlementData = [];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ color: '#475569', fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
          {p.name}: {p.name === 'revenue' || p.name === 'settled' ? `₹${(p.value / 1000).toFixed(0)}K` : p.value}
        </p>
      ))}
    </div>
  );
};

const Reports = () => {
  const [period, setPeriod] = useState('2025-26');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshKey } = usePortal();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://mini-project-g2lv.onrender.com/api/admin/reports?period=${period}`);
        const data = await response.json();
        if (response.ok) {
          setReportData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [period, refreshKey]);

  if (loading) return <div className="page-container">Loading reports...</div>;
  if (!reportData) return <div className="page-container">No report data found.</div>;

  const { monthlyData, typeRevenueData, agentPerf, settlementData, kpis } = reportData;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive business intelligence for FY {period}</p>
        </div>
        <div className="page-header-actions">
          <select className="filter-select" value={period} onChange={e => setPeriod(e.target.value)}>
            <option>2025-26</option><option>2024-25</option><option>2023-24</option>
          </select>
          <button className="btn btn-primary"><MdDownload /> Export Report</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Revenue',      val: kpis.totalRevenue.value, sub: kpis.totalRevenue.sub, color: 'green' },
          { label: 'Total Policies',     val: kpis.totalPolicies.value, sub: kpis.totalPolicies.sub,  color: 'blue' },
          { label: 'Claims Settled',     val: kpis.claimsSettled.value, sub: kpis.claimsSettled.sub, color: 'purple' },
          { label: 'New Clients',        val: kpis.newClients.value, sub: kpis.newClients.sub, color: 'cyan' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`} style={{ padding: '18px 20px' }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 24, marginTop: 8 }}>{s.val}</div>
            <div className="stat-change up"><MdTrendingUp style={{ fontSize: 14 }} /><span>{s.sub}</span></div>
          </div>
        ))}
      </div>

      {/* Revenue vs Claims */}
      <div className="chart-card" style={{ marginBottom: 20 }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Revenue vs Claims Settled — FY {period}</div>
            <div className="chart-subtitle">Monthly financial performance overview</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="r2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#475569' }} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#r1)" name="revenue" dot={false} />
            <Area type="monotone" dataKey="settled" stroke="#10b981" strokeWidth={2} fill="url(#r2)" name="settled" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="charts-grid">
        {/* Revenue by Type */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Revenue by Insurance Type</div>
              <div className="chart-subtitle">Annual breakdown</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={typeRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="insuranceType" tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5a72', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8 }} formatter={v => `₹${(v/100000).toFixed(1)}L`} />
              <Bar dataKey="revenue" radius={[4,4,0,0]} fill="#3b82f6" name="Revenue">
                {typeRevenueData.map((_, i) => (
                  <Cell key={i} fill={['#10b981','#3b82f6','#f59e0b','#8b5cf6','#06b6d4'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Claim Settlement */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Claim Settlement Status</div>
              <div className="chart-subtitle">Distribution breakdown</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={settlementData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" paddingAngle={3} stroke="none">
                {settlementData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {settlementData.map(d => (
              <div key={d.name} className="pie-legend-item">
                <div className="pie-legend-dot" style={{ background: d.color }} />
                <span className="pie-legend-label">{d.name}</span>
                <span className="pie-legend-val">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="chart-card" style={{ marginTop: 20 }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Agent Performance Leaderboard</div>
            <div className="chart-subtitle">Policies issued and revenue generated</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
          {(() => {
            const maxPolicies = Math.max(...agentPerf.map(a => a.policies), 1);
            return agentPerf.map((a, i) => (
              <div key={a.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: ['#f59e0b','#475569','#cd7f32','#3b82f6','#8b5cf6'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{i+1}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--emerald-light)' }}>
                      ₹{(a.revenue/100000).toFixed(1)}L
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{a.policies} policies</span>
                  </div>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar blue" style={{ width: `${(a.policies / maxPolicies) * 100}%` }} />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

export default Reports;
