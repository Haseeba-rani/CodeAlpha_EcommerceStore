// middlewares/admin.middleware.js
// Must run AFTER verifyJWT (relies on req.user being set). Restricts a route
// to users with the 'admin' role.

const ApiError = require('../utils/ApiError');

function requireAdmin(req, res, next) {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required.');
  }

  if (req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin access only.');
  }

  next();
}

module.exports = requireAdmin;
