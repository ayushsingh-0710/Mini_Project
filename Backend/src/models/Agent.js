const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  specialization: { type: String, required: true },
  status: { type: String, default: 'active' },
  rating: { type: Number, default: 4.5 },
  policies: { type: Number, default: 0 },
  claims: { type: Number, default: 0 },
  revenue: { type: String, default: '₹0' },
  avatar: { type: String },
  joined: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
