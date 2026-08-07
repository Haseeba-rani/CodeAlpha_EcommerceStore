// middlewares/notFound.middleware.js
// Catches any request that didn't match a defined route and forwards a
// clean 404 ApiError to the central error handler.

const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
