const { body } = require("express-validator");

const productValidator = [
  body("name").trim().notEmpty().withMessage("Product name is required.").isLength({ max: 150 }).withMessage("Name too long."),
  body("category_id").notEmpty().withMessage("Category is required.").isMongoId().withMessage("Invalid category ID."),
  body("display_order").optional().isInt({ min: 0 }).withMessage("Display order must be a non-negative integer."),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Invalid status."),
  body("availability").optional().isBoolean().withMessage("Availability must be boolean."),
  body("preorder_above_kg")
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage("Pre-order limit must be greater than 0 KG."),
  body("min_prep_hours")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Minimum preparation time cannot be negative."),
];

const productStatusValidator = [
  body("status").isIn(["active", "inactive"]).withMessage("Status must be active or inactive."),
];

const productAvailabilityValidator = [
  body("availability").isBoolean().withMessage("Availability must be boolean."),
];

module.exports = { productValidator, productStatusValidator, productAvailabilityValidator };
