const { validationResult } = require("express-validator");
const { error } = require("../utils/response");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422, "VALIDATION_ERROR");
  }
  next();
};
