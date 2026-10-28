const { body } = require("express-validator");

const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 100 }).withMessage("Name too long."),
  body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
  body("mobile")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("Invalid mobile number."),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number."),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive."),
];

module.exports = { loginValidator, registerValidator };
