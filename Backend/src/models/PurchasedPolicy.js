const mongoose = require('mongoose');

const purchasedPolicySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policyIdFromAPI: {
    type: String,
    required: true
  },
  policyName: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  policyType: {
    type: String,
    required: true
  },
  premium: {
    type: Number,
    required: true
  },
  coverageAmount: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.models.PurchasedPolicy || mongoose.model('PurchasedPolicy', purchasedPolicySchema);
