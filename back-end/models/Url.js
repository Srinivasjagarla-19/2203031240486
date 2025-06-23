const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  expiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Url', urlSchema); 