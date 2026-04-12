const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  id: { type: String, required: true },
  holder: String,
  policy: String,
  type: String,
  plan: String,
  amount: String,
  filed: String,
  agent: String,
  reason: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
