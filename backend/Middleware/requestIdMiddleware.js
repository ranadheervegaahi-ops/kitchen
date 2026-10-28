const { v4: uuidv4 } = require("crypto");

module.exports = (req, res, next) => {
  req.requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  res.setHeader("X-Request-Id", req.requestId);
  next();
};
