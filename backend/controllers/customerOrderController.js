
// // const Order = require("../models/Order");
// // const OrderItem = require("../models/OrderItem");
// // const { success, error } = require("../utils/response");
// // // const { ORDER_TYPES } = require("../utils/constants");
// // const { validateAndCreateOrder } = require("./orderController");
// // const { ORDER_TYPES, ORDER_STATUS } = require("../utils/constants");
// // const INSTANT_TYPE = Object.values(ORDER_TYPES).find((v) => v !== ORDER_TYPES.PRE_ORDER);
// // const DEBUG = process.env.NODE_ENV !== "production";
// const mongoose = require("mongoose");
// const Order = require("../models/Order");
// const OrderItem = require("../models/OrderItem");
// const { success, error } = require("../utils/response");
// const { validateAndCreateOrder } = require("./orderController");
// const { ORDER_TYPES, ORDER_STATUS } = require("../utils/constants");
// const DEBUG = process.env.NODE_ENV !== "production";
// // Customer id always comes from the verified token, never from the request body.
// const customerIdOf = (req) =>
//   req.customer?._id ||
//   req.customer?.id ||
//   req.user?._id ||
//   req.user?.id ||
//   req.customerId ||
//   null;

// const shape = (o, items = []) => ({
//   order_id: o._id,
//   order_number: o.order_number,
//   order_type: o.order_type,
//   fulfillment_type: o.fulfillment_type,
//   requested_at: o.requested_at || null,
//   status: o.status,
//   payment_status: o.payment_status,
//   subtotal: o.subtotal,
//   packing_charge: o.packing_charge,
//   delivery_charge: o.delivery_charge,
//   total_amount: o.total_amount,
//   notes: o.notes || "",
//   delivery_address: o.fulfillment_type === "DELIVERY" ? o.delivery_address : null,
//   items: items.map((i) => ({
//     product_id: i.product_id,
//     variant_id: i.variant_id,
//     product_name: i.product_name_snapshot,
//     variant_name: i.variant_name_snapshot,
//     unit_price: i.unit_price_snapshot,
//     quantity: i.quantity,
//     subtotal: i.subtotal,
//   })),
//   created_at: o.createdAt,
// });

// // POST /api/customer/orders
// const createMyOrder = async (req, res) => {
//   try {
//     const customer_id = customerIdOf(req);
//     if (DEBUG) {
//       console.log("[CUSTOMER ORDER] customer:", String(customer_id), "body:", JSON.stringify(req.body));
//     }
//     if (!customer_id) return error(res, "Customer not authenticated.", 401, "UNAUTHORIZED");

//     const {
//       order_type,
//       items,
//       idempotency_key,
//       fulfillment_type = "PICKUP",
//       delivery_address_id,
//       notes,
//     } = req.body;

//     // Order Now (instant) never carries a pickup time
//     let requested_at = req.body.requested_at;
//     if (INSTANT_TYPE && order_type === INSTANT_TYPE) requested_at = undefined;

//     const result = await validateAndCreateOrder({
//       customer_id,
//       order_type,
//       requested_at,
//       items,
//       idempotency_key,
//       fulfillment_type,
//       // pickup never needs an address; delivery address is checked against THIS customer
//       delivery_address_id: fulfillment_type === "DELIVERY" ? delivery_address_id : undefined,
//       notes,
//     });

//     // an idempotency key must never return another customer's order
//     if (!result.created && String(result.order.customer_id) !== String(customer_id)) {
//       return error(res, "This idempotency key is already used.", 409, "IDEMPOTENCY_CONFLICT");
//     }

//     const savedItems = result.items || (await OrderItem.find({ order_id: result.order._id }));
//     return success(
//       res,
//       shape(result.order, savedItems),
//       result.created ? "Order placed." : "Order already placed.",
//       result.created ? 201 : 200
//     );
//   } catch (e) {
//     if (DEBUG) console.log("[CUSTOMER ORDER] failed:", e.statusCode || 500, e.code, "-", e.message);
//     return error(res, e.message || "Failed to place order.", e.statusCode || 500, e.code || "SERVER_ERROR", e.details);
//   }
// };

// // GET /api/customer/orders?page=1&limit=20
// const getMyOrders = async (req, res) => {
//   const customer_id = customerIdOf(req);
//   if (!customer_id) return error(res, "Customer not authenticated.", 401, "UNAUTHORIZED");

//   const page = Math.max(1, Number(req.query.page) || 1);
//   const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

//   const [orders, total] = await Promise.all([
//     Order.find({ customer_id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
//     Order.countDocuments({ customer_id }),
//   ]);
//   const itemRows = await OrderItem.find({ order_id: { $in: orders.map((o) => o._id) } }).lean();
//   const byOrder = {};
//   for (const i of itemRows) (byOrder[String(i.order_id)] ||= []).push(i);

//   return success(res, {
//     orders: orders.map((o) => shape(o, byOrder[String(o._id)] || [])),
//     total,
//     page,
//     limit,
//   });
// };

// // GET /api/customer/orders/:id  (only the customer's own order)
// const getMyOrder = async (req, res) => {
//   const customer_id = customerIdOf(req);
//   if (!customer_id) return error(res, "Customer not authenticated.", 401, "UNAUTHORIZED");

//   const order = await Order.findOne({ _id: req.params.id, customer_id }).lean();
//   if (!order) return error(res, "Order not found.", 404, "NOT_FOUND");
//   const items = await OrderItem.find({ order_id: order._id }).lean();
//   return success(res, shape(order, items));
// };



// const cancelCustomerOrder = async (req, res) => {
//   try {
//     const orderId = req.params.id;

//     // Change this line if your auth middleware uses req.user instead.
//     const customerId = req.customer?._id;

//     if (!customerId) {
//       return res.status(401).json({
//         success: false,
//         message: "Customer authentication required",
//         error_code: "UNAUTHORIZED",
//       });
//     }

//     if (!mongoose.isValidObjectId(orderId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid order ID",
//         error_code: "INVALID_ORDER_ID",
//       });
//     }

//     const reason = req.body?.reason;

//     if (
//       reason !== undefined &&
//       (typeof reason !== "string" ||
//         reason.trim().length === 0 ||
//         reason.trim().length > 500)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Cancellation reason must be between 1 and 500 characters",
//         error_code: "INVALID_CANCELLATION_REASON",
//       });
//     }

//     // Customer can only cancel their own order.
//     const order = await Order.findOne({
//       _id: orderId,
//       customer_id: customerId,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//         error_code: "ORDER_NOT_FOUND",
//       });
//     }

//     if (order.status === ORDER_STATUS.CANCELLED) {
//       return res.status(409).json({
//         success: false,
//         message: "Order is already cancelled",
//         error_code: "ORDER_ALREADY_CANCELLED",
//       });
//     }

//     // Only NEW and CONFIRMED orders are eligible.
//     const allowedStatuses = [
//       ORDER_STATUS.NEW,
//       ORDER_STATUS.CONFIRMED,
//     ];

//     if (!allowedStatuses.includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         message: "This order can no longer be cancelled",
//         error_code: "ORDER_CANNOT_BE_CANCELLED",
//       });
//     }

//     // Requires preparation_started_at to be maintained by
//     // the kitchen preparation-start endpoint.
//     if (order.preparation_started_at) {
//       return res.status(400).json({
//         success: false,
//         message: "Kitchen preparation has already started",
//         error_code: "PREPARATION_ALREADY_STARTED",
//       });
//     }

//     // Atomic update helps prevent cancellation after status changes.
//     const cancelledOrder = await Order.findOneAndUpdate(
//       {
//         _id: orderId,
//         customer_id: customerId,
//         status: { $in: allowedStatuses },
//         preparation_started_at: null,
//       },
//       {
//         $set: {
//           status: ORDER_STATUS.CANCELLED,
//           cancel_reason: reason?.trim() || "Cancelled by customer",
//           cancelled_at: new Date(),
//         },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!cancelledOrder) {
//       return res.status(409).json({
//         success: false,
//         message: "Order status changed. Please refresh and try again.",
//         error_code: "ORDER_STATUS_CHANGED",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       data: {
//         order_id: cancelledOrder._id,
//         order_number: cancelledOrder.order_number,
//         status: cancelledOrder.status,
//         reason: cancelledOrder.cancel_reason,
//         cancelled_at: cancelledOrder.cancelled_at,
//       },
//     });
//   } 
// //   catch (error) {
// //     console.error("Cancel customer order error:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to cancel order",
// //       error_code: "INTERNAL_SERVER_ERROR",
// //     });
// //   }
// catch (e) {
//   console.error("========== CANCEL ORDER ERROR ==========");
//   console.error("Message:", e.message);
//   console.error("Stack:", e.stack);
//   console.error("=========================================");

//   return res.status(500).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? "Failed to cancel order."
//         : e.message,
//     error_code: "INTERNAL_SERVER_ERROR",
//   });
// }
// };



// module.exports = { createMyOrder, getMyOrders, getMyOrder ,   cancelCustomerOrder,};

const mongoose = require("mongoose");

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const { success, error } = require("../utils/response");
const { validateAndCreateOrder } = require("./orderController");

const {
  ORDER_TYPES,
  ORDER_STATUS,
} = require("../utils/constants");

const DEBUG = process.env.NODE_ENV !== "production";

// Fix: Define the immediate order type explicitly.
const INSTANT_TYPE = ORDER_TYPES.IMMEDIATE;

// Customer ID must come from the authenticated request.
const customerIdOf = (req) =>
  req.customer?._id ||
  req.customer?.id ||
  req.user?._id ||
  req.user?.id ||
  req.customerId ||
  null;

// Common response structure for order details.
const shape = (o, items = []) => ({
  order_id: o._id,
  order_number: o.order_number,
  order_type: o.order_type,
  fulfillment_type: o.fulfillment_type,
  requested_at: o.requested_at || null,
  status: o.status,
  payment_status: o.payment_status,
  subtotal: o.subtotal,
  packing_charge: o.packing_charge,
  delivery_charge: o.delivery_charge,
  total_amount: o.total_amount,
  notes: o.notes || "",
  delivery_address:
    o.fulfillment_type === "DELIVERY"
      ? o.delivery_address
      : null,
  items: items.map((i) => ({
    product_id: i.product_id,
    variant_id: i.variant_id,
    product_name: i.product_name_snapshot,
    variant_name: i.variant_name_snapshot,
    unit_price: i.unit_price_snapshot,
    quantity: i.quantity,
    subtotal: i.subtotal,
  })),
  created_at: o.createdAt,
});

// POST /api/customer/orders
const createMyOrder = async (req, res) => {
  try {
    const customer_id = customerIdOf(req);

    if (DEBUG) {
      console.log(
        "[CUSTOMER ORDER] customer:",
        String(customer_id),
        "body:",
        JSON.stringify(req.body)
      );
    }

    if (!customer_id) {
      return error(
        res,
        "Customer not authenticated.",
        401,
        "UNAUTHORIZED"
      );
    }

    const {
      order_type,
      items,
      idempotency_key,
      fulfillment_type = "PICKUP",
      delivery_address_id,
      notes,
    } = req.body;

    // Validate supported order type.
    if (!Object.values(ORDER_TYPES).includes(order_type)) {
      return error(
        res,
        "Invalid order type.",
        400,
        "INVALID_ORDER_TYPE"
      );
    }

    // Immediate orders do not need a requested pickup time.
    let requested_at = req.body.requested_at;

    if (order_type === INSTANT_TYPE) {
      requested_at = undefined;
    }

    const result = await validateAndCreateOrder({
      customer_id,
      order_type,
      requested_at,
      items,
      idempotency_key,
      fulfillment_type,
      delivery_address_id:
        fulfillment_type === "DELIVERY"
          ? delivery_address_id
          : undefined,
      notes,
    });

    if (!result || !result.order) {
      return error(
        res,
        "Failed to create order.",
        500,
        "ORDER_CREATION_FAILED"
      );
    }

    // Prevent returning another customer's order for a reused key.
    if (
      !result.created &&
      String(result.order.customer_id) !== String(customer_id)
    ) {
      return error(
        res,
        "This idempotency key is already used.",
        409,
        "IDEMPOTENCY_CONFLICT"
      );
    }

    const savedItems =
      result.items ||
      (await OrderItem.find({
        order_id: result.order._id,
      }).lean());

    return success(
      res,
      shape(result.order, savedItems),
      result.created ? "Order placed." : "Order already placed.",
      result.created ? 201 : 200
    );
  } catch (e) {
    if (DEBUG) {
      console.error(
        "[CUSTOMER ORDER] failed:",
        e.statusCode || 500,
        e.code,
        "-",
        e.message
      );
    }

    return error(
      res,
      e.message || "Failed to place order.",
      e.statusCode || 500,
      e.code || "SERVER_ERROR",
      e.details
    );
  }
};

// GET /api/customer/orders?page=1&limit=20
const getMyOrders = async (req, res) => {
  try {
    const customer_id = customerIdOf(req);

    if (!customer_id) {
      return error(
        res,
        "Customer not authenticated.",
        401,
        "UNAUTHORIZED"
      );
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(req.query.limit) || 20)
    );

    const [orders, total] = await Promise.all([
      Order.find({ customer_id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Order.countDocuments({ customer_id }),
    ]);

    const itemRows = await OrderItem.find({
      order_id: {
        $in: orders.map((o) => o._id),
      },
    }).lean();

    const byOrder = {};

    for (const item of itemRows) {
      const key = String(item.order_id);

      if (!byOrder[key]) {
        byOrder[key] = [];
      }

      byOrder[key].push(item);
    }

    return success(res, {
      orders: orders.map((order) =>
        shape(order, byOrder[String(order._id)] || [])
      ),
      total,
      page,
      limit,
    });
  } catch (e) {
    console.error("[CUSTOMER ORDERS LIST ERROR]", e);

    return error(
      res,
      "Failed to fetch orders.",
      500,
      "SERVER_ERROR"
    );
  }
};

// GET /api/customer/orders/:id
const getMyOrder = async (req, res) => {
  try {
    const customer_id = customerIdOf(req);

    if (!customer_id) {
      return error(
        res,
        "Customer not authenticated.",
        401,
        "UNAUTHORIZED"
      );
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return error(
        res,
        "Invalid order ID.",
        400,
        "INVALID_ORDER_ID"
      );
    }

    const order = await Order.findOne({
      _id: req.params.id,
      customer_id,
    }).lean();

    if (!order) {
      return error(
        res,
        "Order not found.",
        404,
        "ORDER_NOT_FOUND"
      );
    }

    const items = await OrderItem.find({
      order_id: order._id,
    }).lean();

    return success(res, shape(order, items));
  } catch (e) {
    console.error("[CUSTOMER ORDER DETAILS ERROR]", e);

    return error(
      res,
      "Failed to fetch order details.",
      500,
      "SERVER_ERROR"
    );
  }
};

// POST /api/customer/orders/:id/cancel
const cancelCustomerOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const customerId = customerIdOf(req);

    if (!customerId) {
      return error(
        res,
        "Customer authentication required.",
        401,
        "UNAUTHORIZED"
      );
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return error(
        res,
        "Invalid order ID.",
        400,
        "INVALID_ORDER_ID"
      );
    }

    const reason = req.body?.reason;

    if (
      reason !== undefined &&
      (
        typeof reason !== "string" ||
        reason.trim().length === 0 ||
        reason.trim().length > 500
      )
    ) {
      return error(
        res,
        "Cancellation reason must be between 1 and 500 characters.",
        400,
        "INVALID_CANCELLATION_REASON"
      );
    }

    // A customer can only access their own order.
    const order = await Order.findOne({
      _id: orderId,
      customer_id: customerId,
    });

    if (!order) {
      return error(
        res,
        "Order not found.",
        404,
        "ORDER_NOT_FOUND"
      );
    }

    if (order.status === ORDER_STATUS.CANCELLED) {
      return error(
        res,
        "Order is already cancelled.",
        409,
        "ORDER_ALREADY_CANCELLED"
      );
    }

    // Customer cancellation is limited to NEW and CONFIRMED.
    const allowedStatuses = [
      ORDER_STATUS.NEW,
      ORDER_STATUS.CONFIRMED,
    ];

    if (!allowedStatuses.includes(order.status)) {
      return error(
        res,
        "This order can no longer be cancelled.",
        409,
        "ORDER_CANNOT_BE_CANCELLED"
      );
    }

    // Do not allow cancellation after kitchen preparation starts.
    if (order.preparation_started_at) {
      return error(
        res,
        "Kitchen preparation has already started.",
        409,
        "PREPARATION_ALREADY_STARTED"
      );
    }

    // Atomic update prevents cancelling an order whose status
    // has changed between the initial read and the update.
    const cancelledOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        customer_id: customerId,
        status: { $in: allowedStatuses },
        preparation_started_at: null,
      },
      {
        $set: {
          status: ORDER_STATUS.CANCELLED,
          cancel_reason:
            reason?.trim() || "Cancelled by customer",
          cancelled_at: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!cancelledOrder) {
      return error(
        res,
        "Order status changed. Please refresh and try again.",
        409,
        "ORDER_STATUS_CHANGED"
      );
    }

    return success(
      res,
      {
        order_id: cancelledOrder._id,
        order_number: cancelledOrder.order_number,
        status: cancelledOrder.status,
        reason: cancelledOrder.cancel_reason,
        cancelled_at: cancelledOrder.cancelled_at,
      },
      "Order cancelled successfully.",
      200
    );
  } catch (e) {
    console.error("[CUSTOMER CANCEL ORDER ERROR]", e);

    return error(
      res,
      DEBUG
        ? e.message
        : "Failed to cancel order.",
      500,
      "INTERNAL_SERVER_ERROR"
    );
  }
};

module.exports = {
  createMyOrder,
  getMyOrders,
  getMyOrder,
  cancelCustomerOrder,
};
