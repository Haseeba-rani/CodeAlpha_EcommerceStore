// middlewares/error.middleware.js
// The single place where every error in the app (thrown ApiError, validation
// error, unexpected exception) gets serialized into a consistent JSON shape.
// Must be registered LAST, after all routes, in app.js.

const ApiError = require('../utils/ApiError');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  // Normalize unexpected (non-ApiError) errors into an ApiError so the
  // response shape is always consistent.
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || []);
  }

  // Log full error server-side (stack trace) for debugging, but never leak
  // stack traces to the client.
  if (env.nodeEnv !== 'test') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
