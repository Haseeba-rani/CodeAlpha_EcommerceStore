// utils/ApiResponse.js
// Standard shape for every successful API response so the frontend can rely
// on a consistent { success, message, data } contract across all endpoints.

class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
