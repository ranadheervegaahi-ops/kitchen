const { body } = require("express-validator");

const businessSettingsValidator = [
  body("business_name").trim().notEmpty().withMessage("Business name is required."),
  body("mobile").trim().notEmpty().withMessage("Mobile is required.").isMobilePhone().withMessage("Invalid mobile number."),
  body("email").isEmail().withMessage("Invalid email.").normalizeEmail(),
  body("address").trim().notEmpty().withMessage("Address is required."),
  body("whatsapp_number").optional().isMobilePhone().withMessage("Invalid WhatsApp number."),
];

const orderSettingsValidator = [
  body("min_preorder_hours").isInt({ min: 1 }).withMessage("Min preorder hours must be >= 1."),
  body("timezone").trim().notEmpty().withMessage("Timezone is required."),
  body("currency").trim().notEmpty().withMessage("Currency is required."),
  body("order_prefix").trim().notEmpty().withMessage("Order prefix is required."),
];

const businessHoursValidator = [
  body("hours").isArray({ min: 1 }).withMessage("Hours must be an array."),
  body("hours.*.day")
    .isIn(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"])
    .withMessage("Invalid day."),
  body("hours.*.is_open").isBoolean().withMessage("is_open must be boolean."),
  body("hours.*.open_time").optional().matches(/^\d{2}:\d{2}$/).withMessage("open_time must be HH:MM."),
  body("hours.*.close_time").optional().matches(/^\d{2}:\d{2}$/).withMessage("close_time must be HH:MM."),
];

module.exports = { businessSettingsValidator, orderSettingsValidator, businessHoursValidator };
