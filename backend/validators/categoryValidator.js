const { body } = require("express-validator");

const categoryValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Category name is required.")
    .isLength({ max: 100 }).withMessage("Name too long."),
  body("display_order").optional().isInt({ min: 0 }).withMessage("Display order must be a non-negative integer."),
];

const categoryStatusValidator = [
  body("status").isIn(["active", "inactive"]).withMessage("Status must be active or inactive."),
];

module.exports = { categoryValidator, categoryStatusValidator };
