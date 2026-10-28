
// const Order = require("../models/Order");
// const OrderItem = require("../models/OrderItem");
// const Payment = require("../models/Payment");
// const Product = require("../models/Product");
// const ProductVariant = require("../models/ProductVariant");
// const Customer = require("../models/Customer");
// const CustomerAddress = require("../models/CustomerAddress");
// const PreorderSettings = require("../models/PreorderSettings");
// const { success, error } = require("../utils/response");
// const { createAudit } = require("../utils/auditHelper");
// const {
//   AUDIT_ACTIONS,
//   VALID_TRANSITIONS,
//   ORDER_TYPES,
//   ORDER_STATUS,
//   PAYMENT_STATUS,
// } = require("../utils/constants");
// const { validatePreorderTime, validateBusinessHours } = require("../utils/preorderHelper");
// const { add, multiply, toFixed2 } = require("../utils/money");
// const { emitToAdmins } = require("../sockets");
// const { assertSlotAvailable, describeWhen } = require("./preorderSchedule.controller");

// // Extra charges. Set PACKING_CHARGE=0 in .env to switch packing off.
// const PACKING_CHARGE = Number(process.env.PACKING_CHARGE ?? 30);
// const DELIVERY_CHARGE = Number(process.env.DELIVERY_CHARGE ?? 40);

// // A NEW order waiting longer than this (minutes) is highlighted on the Orders page.
// const WAIT_ALERT_MIN = 10;

// // Adjust this one line to match how a Hundi product is marked in your Product model.
// const isHundiProduct = (product) =>
//   product.is_hundi === true || String(product.product_type || "").toLowerCase() === "hundi";

// // Weight of one order line in KG. Only KG and G variants count;
// // L, ML, PCS and member variants are ignored by the weight rule.
// const getLineWeightKg = (variant, qty) => {
//   if (variant.variant_type !== "quantity") return 0;
//   const value = Number(variant.quantity_value) || 0;
//   const unit = String(variant.quantity_unit || "").toUpperCase();
//   if (unit === "KG") return value * qty;
//   if (unit === "G") return (value / 1000) * qty;
//   return 0;
// };

// const formatIst = (date) =>
//   date.toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "2-digit",
//     month: "short",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// /* ───────────────────────── Orders list (tabs, counts, actions) ───────────────────────── */

// const S = ORDER_STATUS;
// const PAID = PAYMENT_STATUS.PAID ?? PAYMENT_STATUS.SUCCESS ?? PAYMENT_STATUS.COMPLETED;
// const list = (...v) => v.filter(Boolean);
// const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// const capWords = (s = "") => {
//   const t = String(s).toLowerCase().replace(/_/g, " ");
//   return t.charAt(0).toUpperCase() + t.slice(1);
// };

// // A paid pre-order that has not been started yet = "Scheduled"
// const scheduledCond = () => ({
//   order_type: ORDER_TYPES.PRE_ORDER,
//   status: { $in: list(S.NEW, S.CONFIRMED) },
//   payment_status: PAID,
// });
// const isScheduled = (o) =>
//   o.order_type === ORDER_TYPES.PRE_ORDER &&
//   [S.NEW, S.CONFIRMED].includes(o.status) &&
//   o.payment_status === PAID;

// const GROUP_FILTERS = {
//   new: () => ({ status: { $in: list(S.NEW, S.PAYMENT_PENDING) }, $nor: [scheduledCond()] }),
//   kitchen: () => ({ status: { $in: list(S.CONFIRMED, S.PROCESSING) }, $nor: [scheduledCond()] }),
//   ready: () => ({ status: { $in: list(S.READY_FOR_PICKUP, S.OUT_FOR_DELIVERY) } }),
//   scheduled: () => scheduledCond(),
//   completed: () => ({ status: S.COMPLETED }),
//   cancelled: () => ({ status: { $in: list(S.CANCELLED, S.PAYMENT_FAILED, S.PAYMENT_EXPIRED) } }),
// };

// const leadLabel = (mins) =>
//   mins % 60 === 0 ? `${mins / 60} hour${mins === 60 ? "" : "s"}` : `${mins} min`;

// // Works out the tab, the status pill and the one action button for an order.
// function buildUi(o, s, whenInfo) {
//   const delivery = o.fulfillment_type === "DELIVERY";
//   let group = "new";
//   let label = "New";
//   let tone = "red";
//   let action = null;
//   let waitMinutes = 0;
//   let alert = false;

//   if (isScheduled(o)) {
//     group = "scheduled";
//     label = "Scheduled";
//     tone = "blue";
//     const opensAt = whenInfo ? whenInfo.startAt - s.leadTimeMinutes * 60000 : 0;
//     const open = Date.now() >= opensAt;
//     action = {
//       label: "Start preparing",
//       next: S.PROCESSING,
//       disabled: !open,
//       hint: open ? "" : `Available ${leadLabel(s.leadTimeMinutes)} before the slot`,
//     };
//   } else if (o.status === S.PAYMENT_PENDING) {
//     label = "Awaiting payment";
//     tone = "yellow";
//   } else if (o.status === S.NEW) {
//     action = { label: "Accept", next: S.CONFIRMED };
//     waitMinutes = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
//     alert = waitMinutes > WAIT_ALERT_MIN;
//   } else if (o.status === S.CONFIRMED) {
//     group = "kitchen";
//     label = "Accepted";
//     tone = "blue";
//     action = { label: "Start preparing", next: S.PROCESSING };
//   } else if (o.status === S.PROCESSING) {
//     group = "kitchen";
//     label = "Preparing";
//     tone = "yellow";
//     action = delivery
//       ? { label: "Send out for delivery", next: S.OUT_FOR_DELIVERY }
//       : { label: "Mark ready for pickup", next: S.READY_FOR_PICKUP };
//   } else if (o.status === S.READY_FOR_PICKUP) {
//     group = "ready";
//     label = "Ready for pickup";
//     tone = "green";
//     action = { label: "Mark picked up", next: S.COMPLETED };
//   } else if (o.status === S.OUT_FOR_DELIVERY) {
//     group = "ready";
//     label = "Out for delivery";
//     tone = "green";
//     action = { label: "Mark delivered", next: S.COMPLETED };
//   } else if (o.status === S.COMPLETED) {
//     group = "completed";
//     label = "Completed";
//     tone = "grey";
//   } else if (o.status === S.CANCELLED) {
//     group = "cancelled";
//     label = "Cancelled";
//     tone = "grey";
//   } else if (o.status === S.PAYMENT_FAILED) {
//     group = "cancelled";
//     label = "Payment failed";
//     tone = "red";
//   } else if (o.status === S.PAYMENT_EXPIRED) {
//     group = "cancelled";
//     label = "Payment expired";
//     tone = "grey";
//   }

//   if (action && !(VALID_TRANSITIONS[o.status] || []).includes(action.next)) {
//     action = null; // the state machine does not allow this move
//   }

//   return {
//     group,
//     label,
//     tone,
//     action,
//     wait_minutes: waitMinutes,
//     alert,
//     can_cancel: (VALID_TRANSITIONS[o.status] || []).includes(S.CANCELLED),
//   };
// }

// const paymentUi = (status) => {
//   const t = String(status || "").toLowerCase();
//   const tone = /paid|success/.test(t) ? "green" : /fail/.test(t) ? "red" : /refund/.test(t) ? "blue" : "yellow";
//   return { status, label: capWords(status), tone };
// };

// // GET /api/admin/orders
// const getOrders = async (req, res) => {
//   const { group, fulfillment_type, status, payment_status, order_type, date_from, date_to, search } = req.query;
//   const pageNum = Math.max(1, Number(req.query.page) || 1);
//   const limitNum = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

//   const base = {};
//   if (status) base.status = status;
//   if (payment_status) base.payment_status = payment_status;
//   if (order_type) base.order_type = order_type;
//   if (["PICKUP", "DELIVERY"].includes(fulfillment_type)) base.fulfillment_type = fulfillment_type;
//   if (date_from || date_to) {
//     base.createdAt = {};
//     if (date_from) base.createdAt.$gte = new Date(date_from);
//     if (date_to) base.createdAt.$lte = new Date(date_to);
//   }

//   // search: order number, customer name / mobile, item name
//   if (search && String(search).trim()) {
//     const rx = new RegExp(esc(String(search).trim()), "i");
//     const [customers, itemOrderIds] = await Promise.all([
//       Customer.find({ $or: [{ name: rx }, { mobile: rx }] }).select("_id").lean(),
//       OrderItem.distinct("order_id", { product_name_snapshot: rx }),
//     ]);
//     base.$or = [
//       { order_number: rx },
//       { customer_id: { $in: customers.map((c) => c._id) } },
//       { _id: { $in: itemOrderIds } },
//     ];
//   }

//   const withGroup = (g) => ({ $and: [base, GROUP_FILTERS[g]()] });
//   const groupKeys = Object.keys(GROUP_FILTERS);
//   const listFilter = group && GROUP_FILTERS[group] ? withGroup(group) : base;
//   const sort = group === "scheduled" ? { requested_at: 1 } : { createdAt: -1 };

//   const [orders, total, allCount, ...groupCounts] = await Promise.all([
//     Order.find(listFilter)
//       .populate("customer_id", "name mobile")
//       .sort(sort)
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum)
//       .lean(),
//     Order.countDocuments(listFilter),
//     Order.countDocuments(base),
//     ...groupKeys.map((g) => Order.countDocuments(withGroup(g))),
//   ]);

//   const counts = { all: allCount };
//   groupKeys.forEach((g, i) => (counts[g] = groupCounts[i]));

//   const [itemRows, settings] = await Promise.all([
//     OrderItem.find({ order_id: { $in: orders.map((o) => o._id) } }).lean(),
//     PreorderSettings.get(),
//   ]);
//   const itemsByOrder = {};
//   for (const it of itemRows) (itemsByOrder[String(it.order_id)] ||= []).push(it);

//   const rows = orders.map((o) => {
//     const preorder = o.order_type === ORDER_TYPES.PRE_ORDER && o.requested_at;
//     const whenInfo = preorder ? describeWhen(o.requested_at, settings) : null;
//     return {
//       ...o,
//       customer: { name: o.customer_id?.name || "Guest", mobile: o.customer_id?.mobile || "" },
//       items_summary: (itemsByOrder[String(o._id)] || [])
//         .map((i) => `${i.product_name_snapshot} ${i.variant_name_snapshot} ×${i.quantity}`)
//         .join(", "),
//       when: {
//         type: o.fulfillment_type === "DELIVERY" ? "Delivery" : "Pickup",
//         label: whenInfo ? whenInfo.label : "ASAP",
//       },
//       payment: paymentUi(o.payment_status),
//       ui: buildUi(o, settings, whenInfo),
//     };
//   });

//   return success(res, { orders: rows, total, page: pageNum, limit: limitNum, counts });
// };

// // GET /api/admin/orders/:id
// const getOrder = async (req, res) => {
//   const order = await Order.findById(req.params.id).populate("customer_id", "name mobile email address");
//   if (!order) return error(res, "Order not found.", 404, "NOT_FOUND");
//   const items = await OrderItem.find({ order_id: order._id });
//   const payment = await Payment.findOne({ order_id: order._id });
//   return success(res, { order, items, payment });
// };

// // POST /api/admin/orders
// const createOrder = async (req, res) => {
//   try {
//     const {
//       customer_id,
//       order_type,
//       requested_at,
//       items,
//       idempotency_key,
//       fulfillment_type,
//       delivery_address_id,
//       notes,
//     } = req.body;

//     const customer = await Customer.findById(customer_id);
//     if (!customer) return error(res, "Customer not found.", 404, "CUSTOMER_NOT_FOUND");

//     const result = await validateAndCreateOrder({
//       customer_id,
//       order_type,
//       requested_at,
//       items,
//       idempotency_key,
//       fulfillment_type,
//       delivery_address_id,
//       notes,
//     });

//     if (result.created && req.admin && AUDIT_ACTIONS.ORDER_CREATED) {
//       await createAudit({
//         admin_id: req.admin._id,
//         action: AUDIT_ACTIONS.ORDER_CREATED,
//         entity_type: "Order",
//         entity_id: result.order._id,
//         old_value: null,
//         new_value: {
//           order_number: result.order.order_number,
//           order_type: result.order.order_type,
//           total_amount: result.order.total_amount,
//         },
//         ip_address: req.ip,
//       });
//     }

//     const savedItems = result.items || (await OrderItem.find({ order_id: result.order._id }));
//     return success(
//       res,
//       { order: result.order, items: savedItems },
//       result.created ? "Order created." : "Order already exists.",
//       result.created ? 201 : 200
//     );
//   } catch (e) {
//     return error(res, e.message || "Failed to create order.", e.statusCode || 500, e.code || "SERVER_ERROR", e.details);
//   }
// };

// // PATCH /api/admin/orders/:id/status
// const updateOrderStatus = async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (!order) return error(res, "Order not found.", 404, "NOT_FOUND");

//   const { status } = req.body;
//   const allowed = VALID_TRANSITIONS[order.status] || [];
//   if (!allowed.includes(status))
//     return error(res, `Cannot transition from ${order.status} to ${status}.`, 422, "INVALID_TRANSITION");

//   const old_status = order.status;
//   order.status = status;
//   await order.save();

//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.ORDER_STATUS_CHANGED, entity_type: "Order", entity_id: order._id, old_value: { status: old_status }, new_value: { status }, ip_address: req.ip });
//   emitToAdmins("order_status_changed", { order_id: order._id, order_number: order.order_number, status });
//   return success(res, order, "Order status updated.");
// };

// // GET /api/admin/orders/:id/payment
// const getOrderPayment = async (req, res) => {
//   const payment = await Payment.findOne({ order_id: req.params.id });
//   if (!payment) return error(res, "Payment not found.", 404, "NOT_FOUND");
//   return success(res, payment);
// };

// // Internal: validate and create order (used by admin POST and public/WhatsApp channel)
// const validateAndCreateOrder = async ({
//   customer_id,
//   order_type,
//   requested_at,
//   items,
//   idempotency_key,
//   fulfillment_type = "PICKUP",
//   delivery_address_id,
//   notes,
// }) => {
//   // Idempotency check
//   if (idempotency_key) {
//     const existing = await Order.findOne({ idempotency_key });
//     if (existing) return { order: existing, created: false };
//   }

//   if (!["PICKUP", "DELIVERY"].includes(fulfillment_type)) {
//     throw Object.assign(new Error("Fulfillment type must be PICKUP or DELIVERY."), { statusCode: 422, code: "VALIDATION_ERROR" });
//   }

//   let delivery_address;
//   if (fulfillment_type === "DELIVERY") {
//     if (!delivery_address_id) {
//       throw Object.assign(new Error("A saved delivery address is required for delivery."), { statusCode: 422, code: "DELIVERY_ADDRESS_REQUIRED" });
//     }

//     const savedAddress = await CustomerAddress.findOne({
//       _id: delivery_address_id,
//       customer_id,
//     });
//     if (!savedAddress) {
//       throw Object.assign(new Error("The selected delivery address was not found for this customer."), { statusCode: 422, code: "INVALID_DELIVERY_ADDRESS" });
//     }

//     delivery_address = {
//       label: savedAddress.label,
//       house_flat_no: savedAddress.house_flat_no,
//       street_area: savedAddress.street_area,
//       landmark: savedAddress.landmark,
//       pincode: savedAddress.pincode,
//     };
//   }

//   // Validate items, calculate subtotal and collect each product's order rules.
//   // Products are read from the database on every order, so admin changes
//   // to the rules apply to the very next order.
//   let subtotal_amount = 0;
//   const orderItems = [];
//   const weightByProduct = new Map();
//   const weightRuleHits = new Map(); // product name -> limit in KG
//   const prepRuleHits = new Map(); // product name -> hours
//   let maxPrepHours = 0;
//   let hasHundi = false;

//   for (const item of items) {
//     const product = await Product.findById(item.product_id);
//     if (!product || product.status !== "active") throw Object.assign(new Error(`Product ${item.product_id} is unavailable.`), { statusCode: 422, code: "PRODUCT_UNAVAILABLE" });
//     if (!product.availability) throw Object.assign(new Error(`Product "${product.name}" is currently unavailable.`), { statusCode: 422, code: "PRODUCT_UNAVAILABLE" });

//     const variant = await ProductVariant.findById(item.variant_id);
//     if (!variant || variant.status !== "active") throw Object.assign(new Error(`Variant ${item.variant_id} is unavailable.`), { statusCode: 422, code: "VARIANT_UNAVAILABLE" });
//     if (!variant.availability) throw Object.assign(new Error(`Variant "${variant.variant_name}" is currently unavailable.`), { statusCode: 422, code: "VARIANT_UNAVAILABLE" });
//     if (variant.product_id.toString() !== product._id.toString()) throw Object.assign(new Error("Variant does not belong to product."), { statusCode: 422, code: "VALIDATION_ERROR" });

//     const qty = Number(item.quantity);
//     if (!qty || qty < 1) throw Object.assign(new Error("Quantity must be >= 1."), { statusCode: 422, code: "VALIDATION_ERROR" });

//     if (isHundiProduct(product)) hasHundi = true;

//     // Rule 1: total weight of this product above its limit -> pre-order only
//     const productKey = product._id.toString();
//     const totalKg = (weightByProduct.get(productKey) || 0) + getLineWeightKg(variant, qty);
//     weightByProduct.set(productKey, totalKg);

//     const limitKg = Number(product.preorder_above_kg);
//     if (product.preorder_above_kg != null && limitKg > 0 && totalKg > limitKg) {
//       weightRuleHits.set(product.name, limitKg);
//     }

//     // Rule 2: minimum preparation time
//     const prepHours = Number(product.min_prep_hours) || 0;
//     if (prepHours > 0) {
//       prepRuleHits.set(product.name, prepHours);
//       maxPrepHours = Math.max(maxPrepHours, prepHours);
//     }

//     const subtotal = multiply(variant.price, qty);
//     subtotal_amount = add(subtotal_amount, subtotal);
//     orderItems.push({
//       product_id: product._id,
//       product_name_snapshot: product.name,
//       variant_id: variant._id,
//       variant_name_snapshot: variant.variant_name,
//       unit_price_snapshot: variant.price,
//       quantity: qty,
//       subtotal,
//     });
//   }

//   const needsPreorder = weightRuleHits.size > 0 || prepRuleHits.size > 0;

//   // These items can only be ordered as a pre-order
//   if (needsPreorder && order_type !== ORDER_TYPES.PRE_ORDER) {
//     const reasons = [
//       ...[...weightRuleHits].map(([name, kg]) => `${name} above ${kg} KG`),
//       ...[...prepRuleHits].map(([name, hrs]) => `${name} needs ${hrs} hour(s) preparation`),
//     ];
//     throw Object.assign(
//       new Error(`Pre-order required: ${reasons.join(", ")}. Please choose a pickup/delivery time.`),
//       {
//         statusCode: 422,
//         code: "PREORDER_REQUIRED",
//         details: { min_prep_hours: maxPrepHours, reasons },
//       }
//     );
//   }

//   // Validate pre-order time
//   if (order_type === ORDER_TYPES.PRE_ORDER) {
//     if (!requested_at) throw Object.assign(new Error("Requested time is required for pre-orders."), { statusCode: 422, code: "VALIDATION_ERROR" });

//     const requestedDate = new Date(requested_at);
//     if (Number.isNaN(requestedDate.getTime())) {
//       throw Object.assign(new Error("Requested time is invalid."), { statusCode: 422, code: "VALIDATION_ERROR" });
//     }

//     const timeCheck = await validatePreorderTime(requested_at);
//     if (!timeCheck.valid) throw Object.assign(new Error(timeCheck.message), { statusCode: 422, code: "PREORDER_TIME_INVALID" });
//     const hoursCheck = await validateBusinessHours(requested_at);
//     if (!hoursCheck.valid) throw Object.assign(new Error(hoursCheck.message), { statusCode: 422, code: "BUSINESS_HOURS_INVALID" });

//     // Minimum preparation time, calculated from the current time
//     if (maxPrepHours > 0) {
//       const earliest = new Date(Date.now() + maxPrepHours * 60 * 60 * 1000);
//       if (requestedDate < earliest) {
//         throw Object.assign(
//           new Error(
//             `Some items need at least ${maxPrepHours} hour(s) preparation. Earliest available time is ${formatIst(earliest)}.`
//           ),
//           {
//             statusCode: 422,
//             code: "PREP_TIME_TOO_SHORT",
//             details: { min_prep_hours: maxPrepHours, earliest_at: earliest.toISOString() },
//           }
//         );
//       }
//     }

//     // Pre-order schedule: closed day, blocked slot, full slot, Hundi limit
//     try {
//       await assertSlotAvailable(requestedDate, { hasHundi });
//     } catch (e) {
//       if (e.status) {
//         throw Object.assign(new Error(e.message), { statusCode: 422, code: "SLOT_UNAVAILABLE" });
//       }
//       throw e;
//     }
//   }

//   // Totals: subtotal + packing + delivery
//   const packing_charge = PACKING_CHARGE;
//   const delivery_charge = fulfillment_type === "DELIVERY" ? DELIVERY_CHARGE : 0;
//   const total_amount = add(add(subtotal_amount, packing_charge), delivery_charge);

//   const order = await Order.create({
//     customer_id,
//     order_type,
//     requested_at,
//     fulfillment_type,
//     ...(delivery_address ? { delivery_address } : {}),
//     subtotal: toFixed2(subtotal_amount),
//     packing_charge,
//     delivery_charge,
//     total_amount: toFixed2(total_amount),
//     has_hundi: hasHundi,
//     notes,
//     idempotency_key,
//   });
//   const savedItems = await OrderItem.insertMany(orderItems.map((i) => ({ ...i, order_id: order._id })));
//   emitToAdmins("new_order", { order_id: order._id, order_number: order.order_number, total_amount: order.total_amount });
//   return { order, items: savedItems, created: true };
// };

// const buildOrderAction = (order, isScheduled = false, canStartScheduled = true) => {
//   const S = ORDER_STATUS;
//   const status = order.status;

//   // Scheduled preorder: wait until its allowed preparation time.
//   if (isScheduled) {
//     if (status === S.NEW) {
//       return {
//         label: "Accept",
//         next: S.CONFIRMED,
//         disabled: false,
//       };
//     }

//     if (status === S.CONFIRMED) {
//       return {
//         label: canStartScheduled ? "Start Preparing" : "Waiting for Slot",
//         next: S.PROCESSING,
//         disabled: !canStartScheduled,
//       };
//     }
//   }

//   switch (status) {
//     case S.NEW:
//       return {
//         label: "Accept",
//         next: S.CONFIRMED,
//         disabled: false,
//       };

//     case S.PAYMENT_PENDING:
//       return null;

//     case S.CONFIRMED:
//       return {
//         label: "Start Preparing",
//         next: S.PROCESSING,
//         disabled: false,
//       };

//     case S.PROCESSING:
//       if (order.fulfillment_type === "DELIVERY") {
//         return {
//           label: "Out for Delivery",
//           next: S.OUT_FOR_DELIVERY,
//           disabled: false,
//         };
//       }

//       return {
//         label: "Ready for Pickup",
//         next: S.READY_FOR_PICKUP,
//         disabled: false,
//       };

//     case S.READY_FOR_PICKUP:
//     case S.OUT_FOR_DELIVERY:
//       return {
//         label: "Complete",
//         next: S.COMPLETED,
//         disabled: false,
//       };

//     default:
//       return null;
//   }
// };


// module.exports = { getOrders, getOrder, createOrder, updateOrderStatus, getOrderPayment, validateAndCreateOrder };

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Customer = require("../models/Customer");
const CustomerAddress = require("../models/CustomerAddress");
const PreorderSettings = require("../models/PreorderSettings");

const { success, error } = require("../utils/response");
const { createAudit } = require("../utils/auditHelper");



const {
  AUDIT_ACTIONS,
  VALID_TRANSITIONS,
  ORDER_TYPES,
  ORDER_STATUS,
  PAYMENT_STATUS,
} = require("../utils/constants");

const {
  validatePreorderTime,
  validateBusinessHours,
} = require("../utils/preorderHelper");

const { add, multiply, toFixed2 } = require("../utils/money");
const { emitToAdmins } = require("../sockets");

const {
  assertSlotAvailable,
  describeWhen,
} = require("./preorderSchedule.controller");

// Existing environment-based charges.
const PACKING_CHARGE = Number(process.env.PACKING_CHARGE ?? 30);
const DELIVERY_CHARGE = Number(process.env.DELIVERY_CHARGE ?? 40);

const WAIT_ALERT_MIN = 10;

const isHundiProduct = (product) =>
  product.is_hundi === true ||
  String(product.product_type || "").toLowerCase() === "hundi";

const getLineWeightKg = (variant, qty) => {
  if (variant.variant_type !== "quantity") return 0;

  const value = Number(variant.quantity_value) || 0;
  const unit = String(variant.quantity_unit || "").toUpperCase();

  if (unit === "KG") return value * qty;
  if (unit === "G") return (value / 1000) * qty;

  return 0;
};

const formatIst = (date) =>
  date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ---------------------------- ORDER LIST ---------------------------- */

const S = ORDER_STATUS;

const PAID =
  PAYMENT_STATUS.PAID ??
  PAYMENT_STATUS.SUCCESS ??
  PAYMENT_STATUS.COMPLETED;

const list = (...values) => values.filter(Boolean);

const esc = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const capWords = (value = "") => {
  const text = String(value).toLowerCase().replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const scheduledCond = () => ({
  order_type: ORDER_TYPES.PRE_ORDER,
  status: {
    $in: list(S.NEW, S.CONFIRMED),
  },
  payment_status: PAID,
});

const isScheduled = (order) =>
  order.order_type === ORDER_TYPES.PRE_ORDER &&
  [S.NEW, S.CONFIRMED].includes(order.status) &&
  order.payment_status === PAID;

const GROUP_FILTERS = {
  new: () => ({
    status: {
      $in: list(S.NEW, S.PAYMENT_PENDING),
    },
    $nor: [scheduledCond()],
  }),

  kitchen: () => ({
    status: {
      $in: list(S.CONFIRMED, S.PROCESSING),
    },
    $nor: [scheduledCond()],
  }),

  ready: () => ({
    status: {
      $in: list(S.READY_FOR_PICKUP, S.OUT_FOR_DELIVERY),
    },
  }),

  scheduled: () => scheduledCond(),

  completed: () => ({
    status: S.COMPLETED,
  }),

  cancelled: () => ({
    status: {
      $in: list(S.CANCELLED, S.PAYMENT_FAILED, S.PAYMENT_EXPIRED),
    },
  }),
};

const leadLabel = (minutes) =>
  minutes % 60 === 0
    ? `${minutes / 60} hour${minutes === 60 ? "" : "s"}`
    : `${minutes} min`;

function buildUi(order, settings, whenInfo) {
  const delivery = order.fulfillment_type === "DELIVERY";

  let group = "new";
  let label = "New";
  let tone = "red";
  let action = null;
  let waitMinutes = 0;
  let alert = false;

  if (isScheduled(order)) {
    group = "scheduled";
    label = "Scheduled";
    tone = "blue";

    const opensAt = whenInfo
      ? whenInfo.startAt - settings.leadTimeMinutes * 60000
      : 0;

    const open = Date.now() >= opensAt;

    action = {
      label: "Start preparing",
      next: S.PROCESSING,
      disabled: !open,
      hint: open
        ? ""
        : `Available ${leadLabel(settings.leadTimeMinutes)} before the slot`,
    };
  } else if (order.status === S.PAYMENT_PENDING) {
    label = "Awaiting payment";
    tone = "yellow";
  } else if (order.status === S.NEW) {
    action = {
      label: "Accept",
      next: S.CONFIRMED,
    };

    waitMinutes = Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / 60000
    );

    alert = waitMinutes > WAIT_ALERT_MIN;
  } else if (order.status === S.CONFIRMED) {
    group = "kitchen";
    label = "Accepted";
    tone = "blue";

    action = {
      label: "Start preparing",
      next: S.PROCESSING,
    };
  } else if (order.status === S.PROCESSING) {
    group = "kitchen";
    label = "Preparing";
    tone = "yellow";

    action = delivery
      ? {
          label: "Send out for delivery",
          next: S.OUT_FOR_DELIVERY,
        }
      : {
          label: "Mark ready for pickup",
          next: S.READY_FOR_PICKUP,
        };
  } else if (order.status === S.READY_FOR_PICKUP) {
    group = "ready";
    label = "Ready for pickup";
    tone = "green";

    action = {
      label: "Mark picked up",
      next: S.COMPLETED,
    };
  } else if (order.status === S.OUT_FOR_DELIVERY) {
    group = "ready";
    label = "Out for delivery";
    tone = "green";

    action = {
      label: "Mark delivered",
      next: S.COMPLETED,
    };
  } else if (order.status === S.COMPLETED) {
    group = "completed";
    label = "Completed";
    tone = "grey";
  } else if (order.status === S.CANCELLED) {
    group = "cancelled";
    label = "Cancelled";
    tone = "grey";
  } else if (order.status === S.PAYMENT_FAILED) {
    group = "cancelled";
    label = "Payment failed";
    tone = "red";
  } else if (order.status === S.PAYMENT_EXPIRED) {
    group = "cancelled";
    label = "Payment expired";
    tone = "grey";
  }

  if (
    action &&
    !(VALID_TRANSITIONS[order.status] || []).includes(action.next)
  ) {
    action = null;
  }

  return {
    group,
    label,
    tone,
    action,
    wait_minutes: waitMinutes,
    alert,
    can_cancel: (VALID_TRANSITIONS[order.status] || []).includes(S.CANCELLED),
  };
}

const paymentUi = (status) => {
  const value = String(status || "").toLowerCase();

  const tone = /paid|success/.test(value)
    ? "green"
    : /fail/.test(value)
      ? "red"
      : /refund/.test(value)
        ? "blue"
        : "yellow";

  return {
    status,
    label: capWords(status),
    tone,
  };
};

/* ---------------------------- GET ORDERS ---------------------------- */

const getOrders = async (req, res) => {
  const {
    group,
    fulfillment_type,
    status,
    payment_status,
    order_type,
    date_from,
    date_to,
    search,
  } = req.query;

  const pageNum = Math.max(1, Number(req.query.page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const base = {};

  if (status) base.status = status;
  if (payment_status) base.payment_status = payment_status;
  if (order_type) base.order_type = order_type;

  if (["PICKUP", "DELIVERY"].includes(fulfillment_type)) {
    base.fulfillment_type = fulfillment_type;
  }

  if (date_from || date_to) {
    base.createdAt = {};

    if (date_from) base.createdAt.$gte = new Date(date_from);
    if (date_to) base.createdAt.$lte = new Date(date_to);
  }

  if (search && String(search).trim()) {
    const rx = new RegExp(esc(String(search).trim()), "i");

    const [customers, itemOrderIds] = await Promise.all([
      Customer.find({
        $or: [{ name: rx }, { mobile: rx }],
      })
        .select("_id")
        .lean(),

      OrderItem.distinct("order_id", {
        product_name_snapshot: rx,
      }),
    ]);

    base.$or = [
      { order_number: rx },
      { customer_id: { $in: customers.map((customer) => customer._id) } },
      { _id: { $in: itemOrderIds } },
    ];
  }

  const withGroup = (key) => ({
    $and: [base, GROUP_FILTERS[key]()],
  });

  const groupKeys = Object.keys(GROUP_FILTERS);

  const listFilter =
    group && GROUP_FILTERS[group] ? withGroup(group) : base;

  const sort =
    group === "scheduled" ? { requested_at: 1 } : { createdAt: -1 };

  const [orders, total, allCount, ...groupCounts] = await Promise.all([
    Order.find(listFilter)
      .populate("customer_id", "name mobile")
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),

    Order.countDocuments(listFilter),
    Order.countDocuments(base),

    ...groupKeys.map((key) =>
      Order.countDocuments(withGroup(key))
    ),
  ]);

  const counts = { all: allCount };

  groupKeys.forEach((key, index) => {
    counts[key] = groupCounts[index];
  });

  const [itemRows, settings] = await Promise.all([
    OrderItem.find({
      order_id: { $in: orders.map((order) => order._id) },
    }).lean(),

    PreorderSettings.get(),
  ]);

  const itemsByOrder = {};

  for (const item of itemRows) {
    (itemsByOrder[String(item.order_id)] ||= []).push(item);
  }

  const rows = orders.map((order) => {
    const preorder =
      order.order_type === ORDER_TYPES.PRE_ORDER && order.requested_at;

    const whenInfo = preorder
      ? describeWhen(order.requested_at, settings)
      : null;

    return {
      ...order,

      customer: {
        name: order.customer_id?.name || "Guest",
        mobile: order.customer_id?.mobile || "",
      },

      items_summary: (itemsByOrder[String(order._id)] || [])
        .map(
          (item) =>
            `${item.product_name_snapshot} ${item.variant_name_snapshot} ×${item.quantity}`
        )
        .join(", "),

      when: {
        type:
          order.fulfillment_type === "DELIVERY" ? "Delivery" : "Pickup",
        label: whenInfo ? whenInfo.label : "ASAP",
      },

      payment: paymentUi(order.payment_status),
      ui: buildUi(order, settings, whenInfo),
    };
  });

  return success(res, {
    orders: rows,
    total,
    page: pageNum,
    limit: limitNum,
    counts,
  });
};

/* ---------------------------- GET ORDER ---------------------------- */

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "customer_id",
    "name mobile email address"
  );

  if (!order) {
    return error(res, "Order not found.", 404, "NOT_FOUND");
  }

  const items = await OrderItem.find({ order_id: order._id });
  const payment = await Payment.findOne({ order_id: order._id });

  return success(res, { order, items, payment });
};

/* ---------------------------- CREATE ORDER ---------------------------- */

const createOrder = async (req, res) => {
  try {
    const {
      customer_id,
      order_type,
      requested_at,
      items,
      idempotency_key,
      fulfillment_type,
      delivery_address_id,
      notes,
    } = req.body;

    const customer = await Customer.findById(customer_id);

    if (!customer) {
      return error(res, "Customer not found.", 404, "CUSTOMER_NOT_FOUND");
    }

    const result = await validateAndCreateOrder({
      customer_id,
      order_type,
      requested_at,
      items,
      idempotency_key,
      fulfillment_type,
      delivery_address_id,
      notes,
    });

    if (
      result.created &&
      req.admin &&
      AUDIT_ACTIONS.ORDER_CREATED
    ) {
      await createAudit({
        admin_id: req.admin._id,
        action: AUDIT_ACTIONS.ORDER_CREATED,
        entity_type: "Order",
        entity_id: result.order._id,
        old_value: null,
        new_value: {
          order_number: result.order.order_number,
          order_type: result.order.order_type,
          total_amount: result.order.total_amount,
        },
        ip_address: req.ip,
      });
    }

    const savedItems =
      result.items ||
      (await OrderItem.find({ order_id: result.order._id }));

    return success(
      res,
      { order: result.order, items: savedItems },
      result.created ? "Order created." : "Order already exists.",
      result.created ? 201 : 200
    );
  } catch (e) {
    return error(
      res,
      e.message || "Failed to create order.",
      e.statusCode || 500,
      e.code || "SERVER_ERROR",
      e.details
    );
  }
};

/* ---------------------------- UPDATE STATUS ---------------------------- */

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return error(res, "Order not found.", 404, "NOT_FOUND");
  }

  const { status } = req.body;
  const allowed = VALID_TRANSITIONS[order.status] || [];

  if (!allowed.includes(status)) {
    return error(
      res,
      `Cannot transition from ${order.status} to ${status}.`,
      422,
      "INVALID_TRANSITION"
    );
  }

  const old_status = order.status;

  order.status = status;
  await order.save();

  await createAudit({
    admin_id: req.admin._id,
    action: AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
    entity_type: "Order",
    entity_id: order._id,
    old_value: { status: old_status },
    new_value: { status },
    ip_address: req.ip,
  });

  emitToAdmins("order_status_changed", {
    order_id: order._id,
    order_number: order.order_number,
    status,
  });

  return success(res, order, "Order status updated.");
};

/* ---------------------------- PAYMENT DETAILS ---------------------------- */

const getOrderPayment = async (req, res) => {
  const payment = await Payment.findOne({ order_id: req.params.id });

  if (!payment) {
    return error(res, "Payment not found.", 404, "NOT_FOUND");
  }

  return success(res, payment);
};

/* ---------------------------- VALIDATE AND CREATE ---------------------------- */

const validateAndCreateOrder = async ({
  customer_id,
  order_type,
  requested_at,
  items,
  idempotency_key,
  fulfillment_type = "PICKUP",
  delivery_address_id,
  notes,
}) => {
  // Idempotency check.
  if (idempotency_key) {
    const existing = await Order.findOne({ idempotency_key });

    if (existing) {
      return {
        order: existing,
        created: false,
      };
    }
  }

  if (!["PICKUP", "DELIVERY"].includes(fulfillment_type)) {
    throw Object.assign(
      new Error("Fulfillment type must be PICKUP or DELIVERY."),
      {
        statusCode: 422,
        code: "VALIDATION_ERROR",
      }
    );
  }

  let delivery_address;

  if (fulfillment_type === "DELIVERY") {
    if (!delivery_address_id) {
      throw Object.assign(
        new Error("A saved delivery address is required for delivery."),
        {
          statusCode: 422,
          code: "DELIVERY_ADDRESS_REQUIRED",
        }
      );
    }

    const savedAddress = await CustomerAddress.findOne({
      _id: delivery_address_id,
      customer_id,
    });

    if (!savedAddress) {
      throw Object.assign(
        new Error(
          "The selected delivery address was not found for this customer."
        ),
        {
          statusCode: 422,
          code: "INVALID_DELIVERY_ADDRESS",
        }
      );
    }

    delivery_address = {
      label: savedAddress.label,
      house_flat_no: savedAddress.house_flat_no,
      street_area: savedAddress.street_area,
      landmark: savedAddress.landmark,
      pincode: savedAddress.pincode,
    };
  }

  let subtotal_amount = 0;

  const orderItems = [];
  const weightByProduct = new Map();
  const weightRuleHits = new Map();
  const prepRuleHits = new Map();

  let maxPrepHours = 0;
  let hasHundi = false;

  if (!Array.isArray(items) || items.length === 0) {
    throw Object.assign(
      new Error("At least one order item is required."),
      {
        statusCode: 422,
        code: "VALIDATION_ERROR",
      }
    );
  }

  for (const item of items) {
    const product = await Product.findById(item.product_id);

    if (!product || product.status !== "active") {
      throw Object.assign(
        new Error(`Product ${item.product_id} is unavailable.`),
        {
          statusCode: 422,
          code: "PRODUCT_UNAVAILABLE",
        }
      );
    }

    if (!product.availability) {
      throw Object.assign(
        new Error(`Product "${product.name}" is currently unavailable.`),
        {
          statusCode: 422,
          code: "PRODUCT_UNAVAILABLE",
        }
      );
    }

    const variant = await ProductVariant.findById(item.variant_id);

    if (!variant || variant.status !== "active") {
      throw Object.assign(
        new Error(`Variant ${item.variant_id} is unavailable.`),
        {
          statusCode: 422,
          code: "VARIANT_UNAVAILABLE",
        }
      );
    }

    if (!variant.availability) {
      throw Object.assign(
        new Error(
          `Variant "${variant.variant_name}" is currently unavailable.`
        ),
        {
          statusCode: 422,
          code: "VARIANT_UNAVAILABLE",
        }
      );
    }

    if (variant.product_id.toString() !== product._id.toString()) {
      throw Object.assign(
        new Error("Variant does not belong to product."),
        {
          statusCode: 422,
          code: "VALIDATION_ERROR",
        }
      );
    }

    const qty = Number(item.quantity);

    if (!Number.isFinite(qty) || qty < 1) {
      throw Object.assign(
        new Error("Quantity must be >= 1."),
        {
          statusCode: 422,
          code: "VALIDATION_ERROR",
        }
      );
    }

    if (isHundiProduct(product)) {
      hasHundi = true;
    }

    // Rule 1: total product weight above the configured limit.
    const productKey = product._id.toString();

    const totalKg =
      (weightByProduct.get(productKey) || 0) +
      getLineWeightKg(variant, qty);

    weightByProduct.set(productKey, totalKg);

    const limitKg = Number(product.preorder_above_kg);

    if (
      product.preorder_above_kg != null &&
      limitKg > 0 &&
      totalKg > limitKg
    ) {
      weightRuleHits.set(product.name, limitKg);
    }

    // Rule 2: minimum preparation time.
    const prepHours = Number(product.min_prep_hours) || 0;

    if (prepHours > 0) {
      prepRuleHits.set(product.name, prepHours);
      maxPrepHours = Math.max(maxPrepHours, prepHours);
    }

    const subtotal = multiply(variant.price, qty);

    subtotal_amount = add(subtotal_amount, subtotal);

    orderItems.push({
      product_id: product._id,
      product_name_snapshot: product.name,
      variant_id: variant._id,
      variant_name_snapshot: variant.variant_name,
      unit_price_snapshot: variant.price,
      quantity: qty,
      subtotal,
    });
  }

  const needsPreorder =
    weightRuleHits.size > 0 || prepRuleHits.size > 0;

  if (
    needsPreorder &&
    order_type !== ORDER_TYPES.PRE_ORDER
  ) {
    const reasons = [
      ...[...weightRuleHits].map(
        ([name, kg]) => `${name} above ${kg} KG`
      ),
      ...[...prepRuleHits].map(
        ([name, hours]) => `${name} needs ${hours} hour(s) preparation`
      ),
    ];

    throw Object.assign(
      new Error(
        `Pre-order required: ${reasons.join(", ")}. Please choose a pickup/delivery time.`
      ),
      {
        statusCode: 422,
        code: "PREORDER_REQUIRED",
        details: {
          min_prep_hours: maxPrepHours,
          reasons,
        },
      }
    );
  }

  /* ---------------- PRE-ORDER VALIDATION ---------------- */

  if (order_type === ORDER_TYPES.PRE_ORDER) {
    if (!requested_at) {
      throw Object.assign(
        new Error("Requested time is required for pre-orders."),
        {
          statusCode: 422,
          code: "VALIDATION_ERROR",
        }
      );
    }

    const requestedDate = new Date(requested_at);

    if (Number.isNaN(requestedDate.getTime())) {
      throw Object.assign(
        new Error("Requested time is invalid."),
        {
          statusCode: 422,
          code: "VALIDATION_ERROR",
        }
      );
    }

    const timeCheck = await validatePreorderTime(requested_at);

    if (!timeCheck.valid) {
      throw Object.assign(
        new Error(timeCheck.message),
        {
          statusCode: 422,
          code: "PREORDER_TIME_INVALID",
        }
      );
    }

    const hoursCheck = await validateBusinessHours(requested_at);

    if (!hoursCheck.valid) {
      throw Object.assign(
        new Error(hoursCheck.message),
        {
          statusCode: 422,
          code: "BUSINESS_HOURS_INVALID",
        }
      );
    }

    // Respect the longest preparation requirement among the items.
    if (maxPrepHours > 0) {
      const earliest = new Date(
        Date.now() + maxPrepHours * 60 * 60 * 1000
      );

      if (requestedDate < earliest) {
        throw Object.assign(
          new Error(
            `Some items need at least ${maxPrepHours} hour(s) preparation. Earliest available time is ${formatIst(earliest)}.`
          ),
          {
            statusCode: 422,
            code: "PREP_TIME_TOO_SHORT",
            details: {
              min_prep_hours: maxPrepHours,
              earliest_at: earliest.toISOString(),
            },
          }
        );
      }
    }

    // Check closed day, exact slot, lead time, blocked slot,
    // slot capacity, and daily Hundi capacity.
    try {
      await assertSlotAvailable(requestedDate, { hasHundi });
    } catch (e) {
      if (e.status) {
        throw Object.assign(new Error(e.message), {
          statusCode: e.status,
          code:
            e.status === 409
              ? "SLOT_UNAVAILABLE"
              : "PREORDER_TIME_INVALID",
        });
      }

      throw e;
    }
  // } else if (order_type !== ORDER_TYPES.INSTANT) {
  //   throw Object.assign(
  //     new Error("Invalid order type."),
  //     {
  //       statusCode: 422,
  //       code: "VALIDATION_ERROR",
  //     }
  //   );
  // }
} else if (order_type !== ORDER_TYPES.IMMEDIATE) {
  throw Object.assign(
    new Error("Invalid order type."),
    {
      statusCode: 422,
      code: "VALIDATION_ERROR",
    }
  );
}

  /* ---------------- TOTALS AND SAVE ---------------- */

  const packing_charge = PACKING_CHARGE;

  const delivery_charge =
    fulfillment_type === "DELIVERY" ? DELIVERY_CHARGE : 0;

  const total_amount = add(
    add(subtotal_amount, packing_charge),
    delivery_charge
  );

  const order = await Order.create({
    customer_id,
    order_type,
    requested_at:
      order_type === ORDER_TYPES.PRE_ORDER
        ? new Date(requested_at)
        : undefined,
    fulfillment_type,
    ...(delivery_address ? { delivery_address } : {}),
    subtotal: toFixed2(subtotal_amount),
    packing_charge,
    delivery_charge,
    total_amount: toFixed2(total_amount),
    has_hundi: hasHundi,
    notes,
    idempotency_key,
  });

  const savedItems = await OrderItem.insertMany(
    orderItems.map((item) => ({
      ...item,
      order_id: order._id,
    }))
  );

  emitToAdmins("new_order", {
    order_id: order._id,
    order_number: order.order_number,
    total_amount: order.total_amount,
  });

  return {
    order,
    items: savedItems,
    created: true,
  };
};

/* ---------------------------- EXPORTS ---------------------------- */

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getOrderPayment,
  validateAndCreateOrder,
};
