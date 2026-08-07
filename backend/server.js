// server.js
// Entry point. Boots the Express app defined in app.js and binds it to a port.

const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`Hapyshop API running in ${env.nodeEnv} mode on port ${env.port}`);
});

// Graceful shutdown on unexpected errors.
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => process.exit(1));
});
