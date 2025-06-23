require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const logger = require('./middleware/logger');
app.use(logger);

const urlRoutes = require('./routes/urlRoutes');
app.use('/', urlRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
