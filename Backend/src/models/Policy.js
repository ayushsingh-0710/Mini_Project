const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  id: { type: String, required: true },
  holder: String,
  type: String,
  plan: String,
  premium: String,
  coverage: String,
  start: String,
  end: String,
  agent: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
