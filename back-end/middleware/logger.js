const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/access.log');

function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms\n`;
    fs.appendFile(logFile, log, (err) => {
    });
  });
  next();
}

module.exports = logger; 