const mongoose = require('mongoose');

// Singleton-style document: there is only ever one Settings row.
const settingsSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: 'Kishori Saree Center' },
    tagline: { type: String, default: 'Traditional \u2022 Modern \u2022 Elegant' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' }, // digits only, with country code
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
