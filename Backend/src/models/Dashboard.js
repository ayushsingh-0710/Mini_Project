const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  revenueData: [{
    month: String,
    revenue: Number,
    claims: Number,
    policies: Number
  }],
  policyTypeData: [{
    name: String,
    value: Number,
    color: String
  }],
  recentActivity: [{
    title: String,
    time: String,
    color: String
  }],
  recentClaims: [{
    id: String,
    holder: String,
    amount: String,
    status: String,
    date: String
  }],
  stats: {
    totalPolicies: { value: String, change: String, up: Boolean },
    totalRevenue: { value: String, change: String, up: Boolean },
    activeClaims: { value: String, change: String, up: Boolean },
    totalClients: { value: String, change: String, up: Boolean },
    renewalsDue: { value: String, change: String, up: Boolean },
    claimRatio: { value: String, change: String, up: Boolean }
  }
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
