const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  email: String,
  phone: String,
  city: String,
  status: String,
  policies: Number,
  joined: String,
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
