const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimType: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  date: { type: Date, default: Date.now },
  policyName: { type: String },
  policyId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
