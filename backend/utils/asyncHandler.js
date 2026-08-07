// utils/asyncHandler.js
// Wraps an async Express route handler so any rejected promise (thrown error)
// is automatically forwarded to next(), landing in the centralized error
// middleware instead of crashing the process or requiring try/catch everywhere.

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
