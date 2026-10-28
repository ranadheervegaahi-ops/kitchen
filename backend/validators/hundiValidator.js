const { body } = require("express-validator");

const hundiValidator = [
  body("name").trim().notEmpty().withMessage("Package name is required."),
  body("member_count").isInt({ min: 1 }).withMessage("Member count must be >= 1."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be >= 0."),
  body("display_order").optional().isInt({ min: 0 }).withMessage("Display order must be >= 0."),
];

const hundiStatusValidator = [
  body("status").isIn(["active", "inactive"]).withMessage("Status must be active or inactive."),
];

module.exports = { hundiValidator, hundiStatusValidator };
