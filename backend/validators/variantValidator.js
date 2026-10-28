const { body } = require("express-validator");

const variantValidator = [
  body("variant_type").trim().notEmpty().withMessage("Variant type is required."),
  body("variant_name").trim().notEmpty().withMessage("Variant name is required."),
  body("quantity_value").isFloat({ min: 0 }).withMessage("Quantity must be >= 0."),
  body("quantity_unit").trim().notEmpty().withMessage("Quantity unit is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be >= 0."),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Invalid status."),
  body("member_count").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Member count must be >= 1."),
];

const variantPriceValidator = [
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0."),
];

const variantStatusValidator = [
  body("status").isIn(["active", "inactive"]).withMessage("Status must be active or inactive."),
];

const variantAvailabilityValidator = [
  body("availability").isBoolean().withMessage("Availability must be boolean."),
];

module.exports = { variantValidator, variantPriceValidator, variantStatusValidator, variantAvailabilityValidator };
