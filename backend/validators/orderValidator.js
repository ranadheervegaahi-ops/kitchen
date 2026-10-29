// // // const { body } = require("express-validator");
// // // const { ORDER_TYPES } = require("../utils/constants");

// // // const orderStatusValidator = [
// // //   body("status")
// // //     .notEmpty().withMessage("Status is required.")
// // //     .isIn(["NEW","PAYMENT_PENDING","CONFIRMED","PROCESSING","COMPLETED","CANCELLED","PAYMENT_FAILED","PAYMENT_EXPIRED"])
// // //     .withMessage("Invalid status value."),
// // // ];

// // // const createOrderValidator = [
// // //   body("customer_id").isMongoId().withMessage("Valid customer_id is required."),

// // //   body("order_type")
// // //     .isIn(Object.values(ORDER_TYPES))
// // //     .withMessage("Invalid order_type."),

// // //   body("requested_at")
// // //     .optional({ nullable: true })
// // //     .isISO8601()
// // //     .withMessage("requested_at must be an ISO date."),

// // //   body("fulfillment_type")
// // //     .optional()
// // //     .isIn(["PICKUP", "DELIVERY"])
// // //     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

// // //   body("delivery_address_id")
// // //     .if(body("fulfillment_type").equals("DELIVERY"))
// // //     .isMongoId()
// // //     .withMessage("delivery_address_id is required for delivery."),

// // //   body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
// // //   body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
// // //   body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
// // //   body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

// // //   body("idempotency_key").optional().isString().isLength({ max: 100 }),
// // //   body("notes").optional().isString().isLength({ max: 500 }),
// // // ];

// // // module.exports = { orderStatusValidator, createOrderValidator };
// // const { body } = require("express-validator");
// // const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");
// // const orderStatusValidator = [
// //   body("status")
// //     .notEmpty().withMessage("Status is required.")
// //     .isIn(["NEW","PAYMENT_PENDING","CONFIRMED","PROCESSING","COMPLETED","CANCELLED","PAYMENT_FAILED","PAYMENT_EXPIRED"])
// //     .withMessage("Invalid status value."),
// // ];
// // // const orderStatusValidator = [
// // //   body("status")
// // //     .notEmpty().withMessage("Status is required.")
// // //     .isIn(Object.values(ORDER_STATUS))
// // //     .withMessage("Invalid status value."),
// // // ];

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
// // const { body } = require("express-validator");
// // const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");

// // const orderStatusValidator = [
// //   body("status")
// //     .notEmpty().withMessage("Status is required.")
// //     .isIn(Object.values(ORDER_STATUS))
// //     .withMessage("Invalid status value."),
// // ];

// // // Admin: POST /api/admin/orders (customer_id comes in the body)
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

// // // Customer app: POST /api/customer/orders (customer id comes from the token)
// // const createCustomerOrderValidator = [
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

// // module.exports = { orderStatusValidator, createOrderValidator, createCustomerOrderValidator };
// // const { body } = require("express-validator");
// // const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");

// // const PREORDER_TYPE = ORDER_TYPES.PRE_ORDER;
// // const INSTANT_TYPE = Object.values(ORDER_TYPES).find((v) => v !== PREORDER_TYPE);

// // // Converts common spellings from the app into the real ORDER_TYPES values
// // const normalizeOrderType = (value) => {
// //   const key = String(value ?? "").trim().toLowerCase().replace(/[\s_-]/g, "");
// //   if (["preorder", "scheduled", "schedule", "later"].includes(key)) return PREORDER_TYPE;
// //   if (["instant", "ordernow", "now", "asap", "regular", "normal", "immediate"].includes(key)) return INSTANT_TYPE;
// //   return value;
// // };

// // const normalizeFulfillment = (value) => {
// //   const key = String(value ?? "").trim().toUpperCase().replace(/[\s-]/g, "_");
// //   if (["PICKUP", "PICK_UP"].includes(key)) return "PICKUP";
// //   if (["DELIVERY", "HOME_DELIVERY"].includes(key)) return "DELIVERY";
// //   return value;
// // };

// // const orderStatusValidator = [
// //   body("status")
// //     .notEmpty().withMessage("Status is required.")
// //     .isIn(Object.values(ORDER_STATUS))
// //     .withMessage("Invalid status value."),
// // ];

// // // Admin: POST /api/admin/orders (customer_id comes in the body)
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

// // // Customer app: POST /api/customer/orders (customer id comes from the token)
// // const createCustomerOrderValidator = [
// //   body("order_type")
// //     .customSanitizer(normalizeOrderType)
// //     .isIn(Object.values(ORDER_TYPES))
// //     .withMessage(`Invalid order_type. Allowed: ${Object.values(ORDER_TYPES).join(", ")}`),

// //   body("requested_at")
// //     .optional({ nullable: true })
// //     .isISO8601()
// //     .withMessage("requested_at must be an ISO date."),

// //   body("fulfillment_type")
// //     .optional()
// //     .customSanitizer(normalizeFulfillment)
// //     .isIn(["PICKUP", "DELIVERY"])
// //     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

// //   body("delivery_address_id")
// //     .if(body("fulfillment_type").equals("DELIVERY"))
// //     .isMongoId()
// //     .withMessage("delivery_address_id is required for delivery and must be a saved address _id."),

// //   body("items").isArray({ min: 1 }).withMessage("At least one item is required."),
// //   body("items.*.product_id").isMongoId().withMessage("Valid product_id is required."),
// //   body("items.*.variant_id").isMongoId().withMessage("Valid variant_id is required."),
// //   body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),

// //   body("idempotency_key").optional().isString().isLength({ max: 100 }),
// //   body("notes").optional().isString().isLength({ max: 500 }),
// // ];

// // module.exports = { orderStatusValidator, createOrderValidator, createCustomerOrderValidator };

// const { body } = require("express-validator");
// const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");

// const PREORDER_TYPE = ORDER_TYPES.PRE_ORDER;
// const IMMEDIATE_TYPE = ORDER_TYPES.IMMEDIATE;

// // Convert app order-type values to backend values.
// const normalizeOrderType = (value) => {
//   const key = String(value ?? "")
//     .trim()
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");

//   if (["preorder", "scheduled", "schedule", "later"].includes(key)) {
//     return PREORDER_TYPE;
//   }

//   if (
//     [
//       "immediate",
//       "instant",
//       "ordernow",
//       "now",
//       "asap",
//       "regular",
//       "normal",
//     ].includes(key)
//   ) {
//     return IMMEDIATE_TYPE;
//   }

//   return value;
// };

// const normalizeFulfillment = (value) => {
//   const key = String(value ?? "")
//     .trim()
//     .toUpperCase()
//     .replace(/[\s-]/g, "_");

//   if (["PICKUP", "PICK_UP"].includes(key)) {
//     return "PICKUP";
//   }

//   if (["DELIVERY", "HOME_DELIVERY"].includes(key)) {
//     return "DELIVERY";
//   }

//   return value;
// };

// // Admin: update order status
// const orderStatusValidator = [
//   body("status")
//     .notEmpty()
//     .withMessage("Status is required.")
//     .isIn(Object.values(ORDER_STATUS))
//     .withMessage("Invalid status value."),
// ];

// // Admin: POST /api/admin/orders
// const createOrderValidator = [
//   body("customer_id")
//     .isMongoId()
//     .withMessage("Valid customer_id is required."),

//   body("order_type")
//     .customSanitizer(normalizeOrderType)
//     .isIn(Object.values(ORDER_TYPES))
//     .withMessage(
//       `Invalid order_type. Allowed: ${Object.values(ORDER_TYPES).join(", ")}`
//     ),

//   body("requested_at")
//     .optional({ nullable: true })
//     .isISO8601()
//     .withMessage("requested_at must be an ISO date."),

//   body("fulfillment_type")
//     .optional()
//     .customSanitizer(normalizeFulfillment)
//     .isIn(["PICKUP", "DELIVERY"])
//     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

//   body("delivery_address_id")
//     .if(body("fulfillment_type").equals("DELIVERY"))
//     .isMongoId()
//     .withMessage("delivery_address_id is required for delivery."),

//   body("items")
//     .isArray({ min: 1 })
//     .withMessage("At least one item is required."),

//   body("items.*.product_id")
//     .isMongoId()
//     .withMessage("Valid product_id is required."),

//   body("items.*.variant_id")
//     .isMongoId()
//     .withMessage("Valid variant_id is required."),

//   body("items.*.quantity")
//     .isInt({ min: 1 })
//     .withMessage("Quantity must be at least 1."),

//   body("idempotency_key")
//     .optional()
//     .isString()
//     .isLength({ max: 100 }),

//   body("notes")
//     .optional()
//     .isString()
//     .isLength({ max: 500 }),
// ];

// // Customer app: POST /api/customer/orders
// const createCustomerOrderValidator = [
//   body("order_type")
//     .customSanitizer(normalizeOrderType)
//     .isIn(Object.values(ORDER_TYPES))
//     .withMessage(
//       `Invalid order_type. Allowed: ${Object.values(ORDER_TYPES).join(", ")}`
//     ),

//   body("requested_at")
//     .optional({ nullable: true })
//     .isISO8601()
//     .withMessage("requested_at must be an ISO date."),

//   body("fulfillment_type")
//     .optional()
//     .customSanitizer(normalizeFulfillment)
//     .isIn(["PICKUP", "DELIVERY"])
//     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

//   body("delivery_address_id")
//     .if(body("fulfillment_type").equals("DELIVERY"))
//     .isMongoId()
//     .withMessage(
//       "delivery_address_id is required for delivery and must be a saved address _id."
//     ),

//   body("items")
//     .isArray({ min: 1 })
//     .withMessage("At least one item is required."),

//   body("items.*.product_id")
//     .isMongoId()
//     .withMessage("Valid product_id is required."),

//   body("items.*.variant_id")
//     .isMongoId()
//     .withMessage("Valid variant_id is required."),

//   body("items.*.quantity")
//     .isInt({ min: 1 })
//     .withMessage("Quantity must be at least 1."),

//   body("idempotency_key")
//     .optional()
//     .isString()
//     .isLength({ max: 100 }),

//   body("notes")
//     .optional()
//     .isString()
//     .isLength({ max: 500 }),
// ];

// module.exports = {
//   orderStatusValidator,
//   createOrderValidator,
//   createCustomerOrderValidator,
// };

const mongoose = require("mongoose");
const { body } = require("express-validator");
const { ORDER_STATUS, ORDER_TYPES } = require("../utils/constants");

const PREORDER_TYPE = ORDER_TYPES.PRE_ORDER;
const IMMEDIATE_TYPE = ORDER_TYPES.IMMEDIATE;

// Convert app order-type values to backend values.
const normalizeOrderType = (value) => {
  const key = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (["preorder", "scheduled", "schedule", "later"].includes(key)) {
    return PREORDER_TYPE;
  }

  if (
    [
      "immediate",
      "instant",
      "ordernow",
      "now",
      "asap",
      "regular",
      "normal",
    ].includes(key)
  ) {
    return IMMEDIATE_TYPE;
  }

  return value;
};

const normalizeFulfillment = (value) => {
  const key = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, "_");

  if (["PICKUP", "PICK_UP"].includes(key)) {
    return "PICKUP";
  }

  if (["DELIVERY", "HOME_DELIVERY"].includes(key)) {
    return "DELIVERY";
  }

  return value;
};

// Validate both PRODUCT and HUNDI items.
// Old regular product requests without item_type remain supported.
// const validateOrderItems = (items) => {
//   if (!Array.isArray(items) || items.length === 0) {
//     throw new Error("At least one item is required.");
//   }

//   for (let index = 0; index < items.length; index += 1) {
//     const item = items[index];

//     if (!item || typeof item !== "object" || Array.isArray(item)) {
//       throw new Error(`Invalid item at position ${index + 1}.`);
//     }

//     const itemType = String(item.item_type || "PRODUCT")
//       .trim()
//       .toUpperCase();

//     if (!["PRODUCT", "HUNDI"].includes(itemType)) {
//       throw new Error(
//         `Invalid item_type at position ${index + 1}. Use PRODUCT or HUNDI.`
//       );
//     }

//     if (
//       !Number.isInteger(Number(item.quantity)) ||
//       Number(item.quantity) < 1
//     ) {
//       throw new Error(
//         `Quantity must be at least 1 for item ${index + 1}.`
//       );
//     }

//     if (itemType === "HUNDI") {
//       if (!mongoose.isValidObjectId(item.hundi_package_id)) {
//         throw new Error(
//           `Valid hundi_package_id is required for Hundi item ${index + 1}.`
//         );
//       }

//       // Hundi items must not depend on product/variant IDs.
//       continue;
//     }

//     if (!mongoose.isValidObjectId(item.product_id)) {
//       throw new Error(
//         `Valid product_id is required for product item ${index + 1}.`
//       );
//     }

//     if (!mongoose.isValidObjectId(item.variant_id)) {
//       throw new Error(
//         `Valid variant_id is required for product item ${index + 1}.`
//       );
//     }
//   }

//   return true;
// };



const validateOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one item is required.");
  }

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const position = i + 1;

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`Invalid item at position ${position}.`);
    }

    const itemType = String(item.item_type || "PRODUCT")
      .trim()
      .toUpperCase();

    if (!["PRODUCT", "HUNDI", "WEEKLY_HUNDI"].includes(itemType)) {
      throw new Error(
        `Invalid item_type for item ${position}.`
      );
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(
        `Quantity must be a positive integer for item ${position}.`
      );
    }

    if (itemType === "HUNDI" || itemType === "WEEKLY_HUNDI") {
      if (!mongoose.isValidObjectId(item.hundi_package_id)) {
        throw new Error(
          `Valid hundi_package_id is required for ${itemType} item ${position}.`
        );
      }

      continue;
    }

    if (!mongoose.isValidObjectId(item.product_id)) {
      throw new Error(
        `Valid product_id is required for product item ${position}.`
      );
    }

    if (!mongoose.isValidObjectId(item.variant_id)) {
      throw new Error(
        `Valid variant_id is required for product item ${position}.`
      );
    }
  }

  return true;
};



// Admin: update order status
const orderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(Object.values(ORDER_STATUS))
    .withMessage("Invalid status value."),
];

// Shared order fields
// const commonOrderValidators = [
//   body("order_type")
//     .customSanitizer(normalizeOrderType)
//     .isIn(Object.values(ORDER_TYPES))
//     .withMessage(
//       `Invalid order_type. Allowed: ${Object.values(ORDER_TYPES).join(", ")}`
//     ),

//   body("requested_at")
//     .optional({ nullable: true })
//     .isISO8601()
//     .withMessage("requested_at must be an ISO date."),

//   body("fulfillment_type")
//     .optional()
//     .customSanitizer(normalizeFulfillment)
//     .isIn(["PICKUP", "DELIVERY"])
//     .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

//   body("delivery_address_id")
//     .if(body("fulfillment_type").equals("DELIVERY"))
//     .isMongoId()
//     .withMessage(
//       "delivery_address_id is required for delivery and must be a saved address _id."
//     ),

//   body("items")
//     .custom(validateOrderItems),

//   body("idempotency_key")
//     .optional()
//     .isString()
//     .isLength({ max: 100 })
//     .withMessage("idempotency_key must be a string of at most 100 characters."),

//   body("notes")
//     .optional()
//     .isString()
//     .isLength({ max: 500 })
//     .withMessage("Notes cannot exceed 500 characters."),
// ];
const commonOrderValidators = [
  body("order_type")
    .customSanitizer(normalizeOrderType)
    .isIn(Object.values(ORDER_TYPES))
    .withMessage(
      `Invalid order_type. Allowed: ${Object.values(ORDER_TYPES).join(", ")}`
    ),

  body("requested_at")
    .if((value, { req }) => req.body.order_type === PREORDER_TYPE)
    .notEmpty()
    .withMessage("requested_at is required for pre-orders.")
    .bail()
    .isISO8601()
    .withMessage("requested_at must be a valid ISO date."),

  body("fulfillment_type")
    .notEmpty()
    .withMessage("fulfillment_type is required.")
    .bail()
    .customSanitizer(normalizeFulfillment)
    .isIn(["PICKUP", "DELIVERY"])
    .withMessage("fulfillment_type must be PICKUP or DELIVERY."),

  body("delivery_address_id")
    .if((value, { req }) => req.body.fulfillment_type === "DELIVERY")
    .notEmpty()
    .withMessage("delivery_address_id is required for delivery.")
    .bail()
    .isMongoId()
    .withMessage(
      "delivery_address_id must be a valid saved address ID."
    ),

  body("items").custom(validateOrderItems),

  body("idempotency_key")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("idempotency_key must be a string.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("idempotency_key cannot exceed 100 characters."),

  body("notes")
    .optional({ nullable: true })
    .isString()
    .withMessage("Notes must be a string.")
    .bail()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters."),
];

// Admin: POST /api/admin/orders
const createOrderValidator = [
  body("customer_id")
    .isMongoId()
    .withMessage("Valid customer_id is required."),

  ...commonOrderValidators,
];

// Customer app: POST /api/customer/orders
const createCustomerOrderValidator = [
  ...commonOrderValidators,
];

module.exports = {
  validateOrderItems,
  orderStatusValidator,
  createOrderValidator,
  createCustomerOrderValidator,
};
