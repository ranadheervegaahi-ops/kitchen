// // const { body } = require("express-validator");
// // const { ORDER_TYPES } = require("../utils/constants");

// // const orderStatusValidator = [
// //   body("status")
// //     .notEmpty().withMessage("Status is required.")
// //     .isIn(["NEW","PAYMENT_PENDING","CONFIRMED","PROCESSING","COMPLETED","CANCELLED","PAYMENT_FAILED","PAYMENT_EXPIRED"])
// //     .withMessage("Invalid status value."),
// // ];

// // const createOrderValidator = [
// //   body("customer_id").isMongoId().withMessage("Valid customer_id is required."),

// //   body("order_type")
// //     .isIn(Object.values(ORDER_TYPES))
// //     .withMessage("Invalid order_type."),

// //   body("requested_at")
// //     .optional({ nullable: true })
// //     .isISO8601()
// //     .withMessage("requested_at must be an ISO date."),

// //   body("fulfillment_type")
// //     .optional()
// //     .isIn(["PICKUP", "DELIVERY"])
// //     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

// //   body("delivery_address_id")
// //     .if(body("fulfillment_type").equals("DELIVERY"))
// //     .isMongoId()
// //     .withMessage("delivery_address_id is required for delivery."),

// //   body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
// //   body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
// //   body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
// //   body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

// //   body("idempotency_key").optional().isString().isLength({ max: 100 }),
// //   body("notes").optional().isString().isLength({ max: 500 }),
// // ];

// // module.exports = { orderStatusValidator, createOrderValidator };
// const { body } = require("express-validator");
// const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");
// const orderStatusValidator = [
//   body("status")
//     .notEmpty().withMessage("Status is required.")
//     .isIn(["NEW","PAYMENT_PENDING","CONFIRMED","PROCESSING","COMPLETED","CANCELLED","PAYMENT_FAILED","PAYMENT_EXPIRED"])
//     .withMessage("Invalid status value."),
// ];
// // const orderStatusValidator = [
// //   body("status")
// //     .notEmpty().withMessage("Status is required.")
// //     .isIn(Object.values(ORDER_STATUS))
// //     .withMessage("Invalid status value."),
// // ];

// const createOrderValidator = [
//   body("customer_id").isMongoId().withMessage("Valid customer_id is required."),

//   body("order_type")
//     .isIn(Object.values(ORDER_TYPES))
//     .withMessage("Invalid order_type."),

//   body("requested_at")
//     .optional({ nullable: true })
//     .isISO8601()
//     .withMessage("requested_at must be an ISO date."),

//   body("fulfillment_type")
//     .optional()
//     .isIn(["PICKUP", "DELIVERY"])
//     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

//   body("delivery_address_id")
//     .if(body("fulfillment_type").equals("DELIVERY"))
//     .isMongoId()
//     .withMessage("delivery_address_id is required for delivery."),

//   body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
//   body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
//   body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
//   body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

//   body("idempotency_key").optional().isString().isLength({ max: 100 }),
//   body("notes").optional().isString().isLength({ max: 500 }),
// ];

// module.exports = { orderStatusValidator, createOrderValidator };
// const { body } = require("express-validator");
// const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");

// const orderStatusValidator = [
//   body("status")
//     .notEmpty().withMessage("Status is required.")
//     .isIn(Object.values(ORDER_STATUS))
//     .withMessage("Invalid status value."),
// ];

// // Admin: POST /api/admin/orders (customer_id comes in the body)
// const createOrderValidator = [
//   body("customer_id").isMongoId().withMessage("Valid customer_id is required."),

//   body("order_type")
//     .isIn(Object.values(ORDER_TYPES))
//     .withMessage("Invalid order_type."),

//   body("requested_at")
//     .optional({ nullable: true })
//     .isISO8601()
//     .withMessage("requested_at must be an ISO date."),

//   body("fulfillment_type")
//     .optional()
//     .isIn(["PICKUP", "DELIVERY"])
//     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

//   body("delivery_address_id")
//     .if(body("fulfillment_type").equals("DELIVERY"))
//     .isMongoId()
//     .withMessage("delivery_address_id is required for delivery."),

//   body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
//   body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
//   body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
//   body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

//   body("idempotency_key").optional().isString().isLength({ max: 100 }),
//   body("notes").optional().isString().isLength({ max: 500 }),
// ];

// // Customer app: POST /api/customer/orders (customer id comes from the token)
// const createCustomerOrderValidator = [
//   body("order_type")
//     .isIn(Object.values(ORDER_TYPES))
//     .withMessage("Invalid order_type."),

//   body("requested_at")
//     .optional({ nullable: true })
//     .isISO8601()
//     .withMessage("requested_at must be an ISO date."),

//   body("fulfillment_type")
//     .optional()
//     .isIn(["PICKUP", "DELIVERY"])
//     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

//   body("delivery_address_id")
//     .if(body("fulfillment_type").equals("DELIVERY"))
//     .isMongoId()
//     .withMessage("delivery_address_id is required for delivery."),

//   body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
//   body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
//   body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
//   body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

//   body("idempotency_key").optional().isString().isLength({ max: 100 }),
//   body("notes").optional().isString().isLength({ max: 500 }),
// ];

// module.exports = { orderStatusValidator, createOrderValidator, createCustomerOrderValidator };
const { body } = require("express-validator");
const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");

const PREORDER_TYPE = ORDER_TYPES.PRE_ORDER;
const INSTANT_TYPE = Object.values(ORDER_TYPES).find((v) => v !== PREORDER_TYPE);

// Converts common spellings from the app into the real ORDER_TYPES values
const normalizeOrderType = (value) => {
  const key = String(value ?? "").trim().toLowerCase().replace(/[\s_-]/g, "");
  if (["preorder", "scheduled", "schedule", "later"].includes(key)) return PREORDER_TYPE;
  if (["instant", "ordernow", "now", "asap", "regular", "normal", "immediate"].includes(key)) return INSTANT_TYPE;
  return value;
};

const normalizeFulfillment = (value) => {
  const key = String(value ?? "").trim().toUpperCase().replace(/[\s-]/g, "_");
  if (["PICKUP", "PICK_UP"].includes(key)) return "PICKUP";
  if (["DELIVERY", "HOME_DELIVERY"].includes(key)) return "DELIVERY";
  return value;
};

const orderStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required.")
    .isIn(Object.values(ORDER_STATUS))
    .withMessage("Invalid status value."),
];

// Admin: POST /api/admin/orders (customer_id comes in the body)
const createOrderValidator = [
  body("customer_id").isMongoId().withMessage("Valid customer_id is required."),

  body("order_type")
    .isIn(Object.values(ORDER_TYPES))
    .withMessage("Invalid order_type."),

  body("requested_at")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("requested_at must be an ISO date."),

  body("fulfillment_type")
    .optional()
    .isIn(["PICKUP", "DELIVERY"])
    .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

  body("delivery_address_id")
    .if(body("fulfillment_type").equals("DELIVERY"))
    .isMongoId()
    .withMessage("delivery_address_id is required for delivery."),

  body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
  body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
  body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

  body("idempotency_key").optional().isString().isLength({ max: 100 }),
  body("notes").optional().isString().isLength({ max: 500 }),
];

// Customer app: POST /api/customer/orders (customer id comes from the token)
const createCustomerOrderValidator = [
  body("order_type")
    .customSanitizer(normalizeOrderType)
    .isIn(Object.values(ORDER_TYPES))
    .withMessage(`Invalid order_type. Allowed: ${Object.values(ORDER_TYPES).join(", ")}`),

  body("requested_at")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("requested_at must be an ISO date."),

  body("fulfillment_type")
    .optional()
    .customSanitizer(normalizeFulfillment)
    .isIn(["PICKUP", "DELIVERY"])
    .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

  body("delivery_address_id")
    .if(body("fulfillment_type").equals("DELIVERY"))
    .isMongoId()
    .withMessage("delivery_address_id is required for delivery and must be a saved address _id."),

  body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
  body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
  body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

  body("idempotency_key").optional().isString().isLength({ max: 100 }),
  body("notes").optional().isString().isLength({ max: 500 }),
];

module.exports = { orderStatusValidator, createOrderValidator, createCustomerOrderValidator };