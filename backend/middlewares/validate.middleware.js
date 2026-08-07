// middlewares/validate.middleware.js
// Runs after an array of express-validator checks in a route. If any check
// failed, collects them into a clean array and throws a 400 ApiError.

const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(ApiError.badRequest('Validation failed', formatted));
  }

  next();
}

module.exports = validate;
