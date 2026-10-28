const { error } = require("../utils/response");

module.exports = (req, res, next) => {
  if (!req.admin) return error(res, "Forbidden", 403, "FORBIDDEN");
  next();
};
