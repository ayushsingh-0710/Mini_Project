const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },

  name: String,

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin', 'agent'],
    default: 'user'
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  phone: String,
  city: String,

  status: {
    type: String,
    default: 'active'
  },

  policies: {
    type: Number,
    default: 0
  },

  joined: String,
  avatar: String
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);