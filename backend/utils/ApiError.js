// utils/ApiError.js
// Custom error class used across the app so every thrown error carries an
// HTTP status code and an optional list of field-level validation errors.
// The central error middleware knows how to serialize this into clean JSON.

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 404, 500)
   * @param {string} message - Human readable error message
   * @param {Array} errors - Optional array of field-level errors (e.g. from express-validator)
   */
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
