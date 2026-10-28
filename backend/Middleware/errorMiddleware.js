const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error("Unhandled error", {
    requestId: req.requestId,
    endpoint: req.originalUrl,
    error: err.message,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "An unexpected error occurred. Please try again." : err.message,
    error_code: err.code || "SERVER_ERROR",
  });
};
