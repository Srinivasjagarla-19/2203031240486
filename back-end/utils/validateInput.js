const validator = require('validator');

function validateUrl(url) {
  return validator.isURL(url, { require_protocol: true });
}

function validateShortcode(shortcode) {
  // Allow alphanumeric, 4-12 chars
  return /^[a-zA-Z0-9_-]{4,12}$/.test(shortcode);
}

function validateExpiry(expiry) {
  if (!expiry) return true;
  const date = new Date(expiry);
  return !isNaN(date.getTime()) && date > new Date();
}

module.exports = { validateUrl, validateShortcode, validateExpiry }; 