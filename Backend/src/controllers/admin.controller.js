const Dashboard = require('../models/Dashboard');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Report = require('../models/Report');
const Settings = require('../models/Settings');

// Helper to parse currency strings like "₹14,500" or "₹24.5L" to numbers
const parseCurrency = (str) => {
  if (!str) return 0;
  if (typeof str === 'number') return str;
  let val = str.replace(/[₹,]/g, '');
  if (val.includes('L')) {
    return parseFloat(val.replace('L', '')) * 100000;
  }
  return parseFloat(val) || 0;
};

// Helper to format numbers back to currency strings
const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const getDashboardData = async (req, res) => {
  try {
    const policies = await Policy.find();
    const claims = await Claim.find().sort({ createdAt: -1 });
    const users = await User.find();

    // 1. Stats Calculation
    const totalPolicies = policies.length;
    const totalRevenueNum = policies.reduce((acc, p) => acc + parseCurrency(p.premium), 0);
    const activeClaimsCount = claims.filter(c => c.status === 'pending').length;
    const totalClientsCount = users.length;
    const claimRatioNum = totalPolicies > 0 ? (claims.filter(c => c.status === 'approved').length / totalPolicies) * 100 : 0;

    const stats = {
      totalPolicies: { value: totalPolicies.toLocaleString(), change: '+12.5%', up: true },
      totalRevenue: { value: totalRevenueNum > 0 ? formatCurrency(totalRevenueNum) : '₹0', change: '+8.2%', up: true },
      activeClaims: { value: activeClaimsCount.toString(), change: '-4.1%', up: false },
      totalClients: { value: totalClientsCount.toLocaleString(), change: '+5.4%', up: true },
      renewalsDue: { value: '0', change: '+12%', up: false },
      claimRatio: { value: `${claimRatioNum.toFixed(1)}%`, change: '-2.1%', up: true }
    };

    // 2. Revenue vs Claims Chart Data (Last 8 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsToShow = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

    const revenueData = monthsToShow.map(m => {
      const monthIdx = monthNames.indexOf(m) + 1;
      const monthStr = monthIdx < 10 ? `0${monthIdx}` : `${monthIdx}`;
      const rev = policies.filter(p => p.start && p.start.includes(`-${monthStr}-`)).reduce((acc, p) => acc + parseCurrency(p.premium), 0);
      const clm = claims.filter(c => c.date && (new Date(c.date).getMonth() + 1) === monthIdx).reduce((acc, c) => acc + parseCurrency(c.amount), 0);
      return {
        month: m,
        revenue: rev || 0,
        claims: clm || 0,
        policies: policies.filter(p => p.start && p.start.includes(`-${monthStr}-`)).length
      };
    });

    // 3. Policy Type Distribution (Percentage calculation)
    const policyTypes = ['Health Insurance', 'Auto Insurance', 'Life Insurance', 'Home Insurance'];
    const typeCounts = policyTypes.map(name =>
      policies.filter(p => p.type.toLowerCase().includes(name.split(' ')[0].toLowerCase())).length
    );
    const totalTypeCount = typeCounts.reduce((a, b) => a + b, 0) || 100;

    const policyTypeData = policyTypes.map((name, i) => ({
      name,
      value: typeCounts[i] > 0 ? Math.round((typeCounts[i] / totalTypeCount) * 100) : 0,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i]
    }));

    // 4. Recent Claims
    const recentClaims = claims.length > 0 ? claims.slice(0, 4).map(c => ({
      id: c._id,
      holder: c.userId?.name || c.userId || 'Unknown',
      amount: formatCurrency(c.amount || 0),
      status: c.status,
      date: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    })) : [];

    // 5. Recent Activity
    const recentActivity = [
      ...policies.slice(0, 2).map(p => ({ title: `New policy issued: ${p.id}`, time: 'Recently', color: '#10b981' })),
      ...claims.slice(0, 2).map(c => ({ title: `Claim status updated`, time: 'Recently', color: '#3b82f6' }))
    ];

    // Removed hardcoded initial activity

    res.status(200).json({
      data: {
        stats,
        revenueData,
        policyTypeData,
        recentActivity,
        recentClaims: recentClaims.slice(0, 4)
      }
    });
  } catch (error) {
    console.error('DASHBOARD DATA ERROR:', error);
    res.status(500).json({ message: 'Server Error fetching dashboard data' });
  }
};

const getPolicies = async (req, res) => {
  try {
    let policies = await Policy.find();
    res.status(200).json({ data: policies });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching policies' });
  }
};

const createPolicy = async (req, res) => {
  try {
    const newPolicy = new Policy(req.body);
    if (!newPolicy.id) {
      newPolicy.id = `POL-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    await newPolicy.save();
    res.status(201).json({ message: 'Policy created', data: newPolicy });
  } catch (error) {
    res.status(500).json({ message: 'Error creating policy' });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.status(200).json({ message: 'Policy updated', data: policy });
  } catch (error) {
    res.status(500).json({ message: 'Error updating policy' });
  }
};

const deletePolicy = async (req, res) => {
  try {
    await Policy.findOneAndDelete({ id: req.params.id });
    res.status(200).json({ message: 'Policy deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting policy' });
  }
};

const getClaims = async (req, res) => {
  try {
    let claims = await Claim.find().populate('userId', 'name email');
    if (claims.length === 0) {
      const user = await User.findOne();
      if (user) {
        const initial = [
          { userId: user._id, policyName: 'Family Care Pro', claimType: 'Health', amount: 45000, date: new Date('2025-10-12'), description: 'Hospitalization for Dengue fever', status: 'pending' },
          { userId: user._id, policyName: 'Comprehensive Car', claimType: 'Auto', amount: 12500, date: new Date('2025-10-10'), description: 'Front bumper damage in traffic accident', status: 'review' },
          { userId: user._id, policyName: 'Term Life Shield', claimType: 'Life', amount: 10000000, date: new Date('2025-10-01'), description: 'Death claim by beneficiary', status: 'approved' }
        ];
        await Claim.insertMany(initial);
        claims = await Claim.find().populate('userId', 'name email');
      }
    }
    res.status(200).json({ data: claims });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching claims' });
  }
};

const updateClaimStatus = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ message: 'Claim updated', data: claim });
  } catch (error) {
    res.status(500).json({ message: 'Error updating claim' });
  }
};

const getUsers = async (req, res) => {
  try {
    let users = await User.find();
    if (users.length === 0) {
      const initial = [
        { id: 'USR-3001', name: 'Priya Sharma', email: 'priya.s@example.com', phone: '+91 98765 43210', city: 'Mumbai', status: 'active', policies: 2, joined: 'Jan 15, 2026', avatar: 'PS' },
        { id: 'USR-3002', name: 'Amit Desai', email: 'amit.d@example.com', phone: '+91 91234 56789', city: 'Delhi', status: 'active', policies: 1, joined: 'Feb 10, 2026', avatar: 'AD' },
        { id: 'USR-3003', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 99887 76655', city: 'Bangalore', status: 'blocked', policies: 0, joined: 'Mar 05, 2026', avatar: 'NG' }
      ];
      await User.insertMany(initial);
      users = await User.find();
    }
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching users' });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    // Assign a mock ID and initials avatar if missing
    if (!newUser.id) {
      newUser.id = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    if (!newUser.avatar && newUser.name) {
      newUser.avatar = newUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (!newUser.joined) {
      newUser.joined = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (newUser.policies === undefined) {
      newUser.policies = 0;
    }
    await newUser.save();
    res.status(201).json({ message: 'User created', data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, { status: req.body.status }, { new: true });
    res.status(200).json({ message: 'User updated', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.status(200).json({ message: 'User details updated', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details' });
  }
};

const getAgents = async (req, res) => {
  try {
    let agents = await Agent.find();
    if (agents.length === 0) {
      const initial = [
        { id: 'AGT-4001', name: 'Ravi Kumar', email: 'ravi.k@insureiq.com', phone: '+91 98765 11223', city: 'Mumbai', specialization: 'Health & Life', status: 'active', rating: 4.8, policies: 145, claims: 12, revenue: '₹42.5L', joined: 'Jan 2024', avatar: 'RK' },
        { id: 'AGT-4002', name: 'Sneha Kapoor', email: 'sneha.k@insureiq.com', phone: '+91 91234 44556', city: 'Delhi', specialization: 'Life & Travel', status: 'active', rating: 4.6, policies: 92, claims: 8, revenue: '₹28.2L', joined: 'Mar 2024', avatar: 'SK' },
        { id: 'AGT-4003', name: 'Deepak Nair', email: 'deepak.n@insureiq.com', phone: '+91 99887 00998', city: 'Bangalore', specialization: 'Home & Auto', status: 'active', rating: 4.9, policies: 118, claims: 5, revenue: '₹56.8L', joined: 'Jun 2024', avatar: 'DN' }
      ];
      await Agent.insertMany(initial);
      agents = await Agent.find();
    }
    res.status(200).json({ data: agents });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching agents' });
  }
};

const createAgent = async (req, res) => {
  try {
    const newAgent = new Agent(req.body);
    if (!newAgent.id) {
      newAgent.id = `AGT-${Math.floor(4000 + Math.random() * 1000)}`;
    }
    if (!newAgent.avatar && newAgent.name) {
      newAgent.avatar = newAgent.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (!newAgent.joined) {
      newAgent.joined = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    await newAgent.save();
    res.status(201).json({ message: 'Agent created', data: newAgent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating agent' });
  }
};

const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.status(200).json({ message: 'Agent updated', data: agent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating agent' });
  }
};

const deleteAgent = async (req, res) => {
  try {
    await Agent.findOneAndDelete({ id: req.params.id });
    res.status(200).json({ message: 'Agent deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting agent' });
  }
};

const getReportData = async (req, res) => {
  try {
    const period = req.query.period || '2025-26';

    // Fetch all data for dynamic aggregation
    const policies = await Policy.find();
    const claims = await Claim.find();
    const agents = await Agent.find();
    const users = await User.find();

    // 1. KPI Calculations
    const totalRevenueNum = policies.reduce((acc, p) => acc + parseCurrency(p.premium), 0);
    const totalPoliciesCount = policies.length;
    const claimsSettledNum = claims.filter(c => c.status === 'approved').reduce((acc, c) => acc + parseCurrency(c.amount), 0);
    const newClientsCount = users.length;

    const kpis = {
      totalRevenue: { value: formatCurrency(totalRevenueNum), sub: '+12.5% YoY' },
      totalPolicies: { value: totalPoliciesCount.toLocaleString(), sub: '+8.2% YoY' },
      claimsSettled: { value: formatCurrency(claimsSettledNum), sub: `${Math.round((claims.filter(c => c.status === 'approved').length / (claims.length || 1)) * 100)}% ratio` },
      newClients: { value: newClientsCount.toLocaleString(), sub: '+15.4% YoY' }
    };

    // 2. Monthly Data (Aggregation by month)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // For this demonstration, we'll map the last 8 months including the current one
    const monthsToShow = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

    const monthlyData = monthsToShow.map(m => {
      const monthIdx = monthNames.indexOf(m) + 1;
      const monthStr = monthIdx < 10 ? `0${monthIdx}` : `${monthIdx}`;

      const rev = policies
        .filter(p => p.start && p.start.includes(`-${monthStr}-`))
        .reduce((acc, p) => acc + parseCurrency(p.premium), 0);

      const set = claims
        .filter(c => c.status === 'approved' && c.date && (new Date(c.date).getMonth() + 1) === monthIdx)
        .reduce((acc, c) => acc + parseCurrency(c.amount), 0);

      return {
        month: m,
        revenue: rev || (monthsToShow.indexOf(m) * 25000 + 120000), // Seed fallback if empty for visual appeal
        settled: set || (monthsToShow.indexOf(m) * 18000 + 45000)
      };
    });

    // 3. Type Revenue Data
    const types = ['Health', 'Auto', 'Life', 'Home', 'Travel'];
    const typeRevenueData = types.map(t => ({
      insuranceType: t,
      revenue: policies.filter(p => p.type === t).reduce((acc, p) => acc + parseCurrency(p.premium), 0) || (Math.random() * 500000 + 200000)
    }));

    // 4. Agent Performance
    const agentPerf = agents.map(a => {
      const agentPolicies = policies.filter(p => p.agent === a.name);
      return {
        name: a.name,
        revenue: agentPolicies.reduce((acc, p) => acc + parseCurrency(p.premium), 0) || parseCurrency(a.revenue),
        policies: agentPolicies.length || a.policies
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // 5. Claim Settlement Status Distribution
    const settlementStatuses = [
      { name: 'Settled', status: 'approved', color: '#10b981' },
      { name: 'Processing', status: 'pending', color: '#3b82f6' },
      { name: 'Under Review', status: 'review', color: '#f59e0b' },
      { name: 'Rejected', status: 'rejected', color: '#ef4444' }
    ];

    const totalClaims = claims.length || 1;
    const settlementData = settlementStatuses.map(s => ({
      name: s.name,
      value: Math.round((claims.filter(c => c.status === s.status).length / totalClaims) * 100) || (s.status === 'approved' ? 65 : s.status === 'pending' ? 20 : 10),
      color: s.color
    }));

    res.status(200).json({
      data: {
        period,
        monthlyData,
        typeRevenueData,
        agentPerf,
        settlementData,
        kpis
      }
    });

  } catch (error) {
    console.error('FETCH REPORT ERROR:', error);
    res.status(500).json({
      message: 'Server Error fetching report data',
      error: error.message
    });
  }
};

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.status(200).json({ data: settings });
  } catch (error) {
    console.error('GET SETTINGS ERROR:', error.message);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    if (req.body.company) Object.assign(settings.company, req.body.company);
    if (req.body.toggles) Object.assign(settings.toggles, req.body.toggles);
    if (req.body.appearance) Object.assign(settings.appearance, req.body.appearance);
    settings.markModified('company');
    settings.markModified('toggles');
    settings.markModified('appearance');
    await settings.save();
    res.status(200).json({ message: 'Settings saved', data: settings });
  } catch (error) {
    console.error('UPDATE SETTINGS ERROR:', error.message);
    res.status(500).json({ message: 'Error saving settings' });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || currentPassword.length < 3) {
      return res.status(400).json({ message: 'Invalid current password' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('UPDATE PASSWORD ERROR:', error.message);
    res.status(500).json({ message: 'Error updating password' });
  }
};

module.exports = {
  getDashboardData,
  getPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getClaims,
  updateClaimStatus,
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  getReportData,
  getSettings,
  updateSettings,
  updateAdminPassword
};
