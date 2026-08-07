// config/env.js
// Loads and validates environment variables in one place so the rest of the
// app never touches `process.env` directly. This makes it easy to see every
// config value the app depends on, and fails fast if something is missing.

require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

module.exports = env;
