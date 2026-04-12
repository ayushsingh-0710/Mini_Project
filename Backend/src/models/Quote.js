const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  sumInsured: {
    type: Number
  },
  buildingAge: {
    type: Number
  },
  status: {
    type: String,
    default: 'pending'
  },
  quoteId: {
    type: String,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
