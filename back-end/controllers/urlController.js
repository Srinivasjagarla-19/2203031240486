const Url = require('../models/Url');
const Click = require('../models/Click');
const { v4: uuidv4 } = require('uuid');
const { validateUrl, validateShortcode, validateExpiry } = require('../utils/validateInput');

function generateShortcode() {
  return uuidv4().slice(0, 8);
}

async function createShortUrls(req, res, next) {
  try {
    let { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0 || urls.length > 5) {
      return res.status(400).json({ error: { message: 'Provide 1-5 URLs in an array.' } });
    }
    const results = [];
    for (const item of urls) {
      const { url, validity, shortcode } = item;
      if (!validateUrl(url)) {
        results.push({ error: 'Invalid URL', url });
        continue;
      }
      let code = shortcode;
      if (code) {
        if (!validateShortcode(code)) {
          results.push({ error: 'Invalid shortcode', url });
          continue;
        }
        const exists = await Url.findOne({ shortcode: code });
        if (exists) {
          results.push({ error: 'Shortcode already exists', url });
          continue;
        }
      } else {
        let unique = false;
        while (!unique) {
          code = generateShortcode();
          unique = !(await Url.findOne({ shortcode: code }));
        }
      }
      let expiry;
      if (validity) {
        if (!validateExpiry(validity)) {
          results.push({ error: 'Invalid expiry', url });
          continue;
        }
        expiry = new Date(validity);
      } else {
        expiry = new Date(Date.now() + 30 * 60000); // Default 30 minutes
      }
      const newUrl = new Url({ originalUrl: url, shortcode: code, expiry });
      await newUrl.save();
      results.push({ shortLink: `${req.protocol}://${req.get('host')}/${code}`, expiry });
    }
    res.status(201).json({ results });
  } catch (err) {
    next(err);
  }
}

async function redirectShortUrl(req, res, next) {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortcode });
    if (!urlDoc) {
      return res.status(404).json({ error: { message: 'Shortcode not found' } });
    }
    if (urlDoc.expiry && urlDoc.expiry < new Date()) {
      return res.status(410).json({ error: { message: 'Short URL expired' } });
    }
    await Click.create({
      shortcode,
      ip: req.ip,
      referrer: req.get('referer') || '',
    });
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    next(err);
  }
}

async function getShortUrlStats(req, res, next) {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortcode });
    if (!urlDoc) {
      return res.status(404).json({ error: { message: 'Shortcode not found' } });
    }
    const clicks = await Click.find({ shortcode }).sort({ timestamp: -1 });
    res.json({
      originalUrl: urlDoc.originalUrl,
      expiry: urlDoc.expiry,
      totalClicks: clicks.length,
      clickHistory: clicks.map(c => ({
        timestamp: c.timestamp,
        ip: c.ip,
        referrer: c.referrer,
      })),
    });
  } catch (err) {
    next(err);
  }
}

async function getAllUrls(req, res, next) {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    next(err);
  }
}

module.exports = { createShortUrls, redirectShortUrl, getShortUrlStats, getAllUrls }; 