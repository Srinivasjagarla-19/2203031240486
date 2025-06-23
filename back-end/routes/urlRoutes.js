const express = require('express');
const router = express.Router();
const { createShortUrls, redirectShortUrl, getShortUrlStats, getAllUrls } = require('../controllers/urlController');

router.post('/shorturls', createShortUrls);
router.get('/shorturls', getAllUrls);
router.get('/shorturls/:shortcode', getShortUrlStats);
router.get('/:shortcode', redirectShortUrl);

module.exports = router; 