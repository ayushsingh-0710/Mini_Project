const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  period: { type: String, required: true },
  monthlyData: [{
    month: String,
    revenue: Number,
    settled: Number
  }],
  typeRevenueData: [{
    insuranceType: { type: String },
    revenue: Number
  }],
  agentPerf: [{
    name: String,
    revenue: Number,
    policies: Number
  }],
  settlementData: [{
    name: String,
    value: Number,
    color: String
  }],
  kpis: {
    totalRevenue: { value: String, sub: String },
    totalPolicies: { value: String, sub: String },
    claimsSettled: { value: String, sub: String },
    newClients: { value: String, sub: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
