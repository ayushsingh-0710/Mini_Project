const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  company: {
    name: { type: String, default: 'InsureIQ Pvt. Ltd.' },
    email: { type: String, default: 'admin@insureiq.com' },
    phone: { type: String, default: '+91 98100 00000' },
    address: { type: String, default: '12, Insurance Tower, BKC, Mumbai – 400051' },
    website: { type: String, default: 'www.insureiq.com' },
    gstin: { type: String, default: '27AABCI1234A1Z5' }
  },
  toggles: {
    emailNotif: { type: Boolean, default: true },
    smsNotif: { type: Boolean, default: false },
    pushNotif: { type: Boolean, default: true },
    claimAlerts: { type: Boolean, default: true },
    renewalReminders: { type: Boolean, default: true },
    paymentAlerts: { type: Boolean, default: true },
    twoFactor: { type: Boolean, default: false },
    sessionTimeout: { type: Boolean, default: true },
    ipWhitelist: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: true },
    compactView: { type: Boolean, default: false },
    animations: { type: Boolean, default: true }
  },
  appearance: {
    accentColor: { type: String, default: '#3b82f6' },
    sidebarWidth: { type: String, default: 'Default (260px)' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
