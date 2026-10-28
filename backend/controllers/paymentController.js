const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { success, error } = require("../utils/response");
const { PAYMENT_STATUS, ORDER_STATUS, AUDIT_ACTIONS } = require("../utils/constants");
const { createAudit } = require("../utils/auditHelper");
const { toFixed2 } = require("../utils/money");
const { checkOrderAvailability } = require("../utils/availabilityHelper");
const { revalidateOrderPrices } = require("./variantController");
const logger = require("../utils/logger");

// GET /api/admin/payments
const getPayments = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [payments, total] = await Promise.all([
    Payment.find(filter).populate("order_id", "order_number total_amount").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Payment.countDocuments(filter),
  ]);
  return success(res, { payments, total, page: Number(page), limit: Number(limit) });
};

// POST /api/payment/webhook  — server-side gateway verification
const handleWebhook = async (req, res) => {
  // Verify Razorpay signature (adapt for your gateway)
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (webhookSecret && signature) {
    const expectedSig = crypto.createHmac("sha256", webhookSecret).update(JSON.stringify(req.body)).digest("hex");
    if (expectedSig !== signature) {
      logger.warn("Webhook signature mismatch", { requestId: req.requestId });
      return error(res, "Invalid signature.", 400, "INVALID_SIGNATURE");
    }
  }

  const event = req.body;
  const gatewayPaymentId = event?.payload?.payment?.entity?.id;
  const gatewayOrderId = event?.payload?.payment?.entity?.order_id;
  const amountPaise = event?.payload?.payment?.entity?.amount;
  const eventType = event?.event;

  if (!gatewayPaymentId || !gatewayOrderId) return res.status(200).json({ received: true });

  // Idempotency: skip if already processed
  const existingPayment = await Payment.findOne({ gateway_payment_id: gatewayPaymentId });
  if (existingPayment && existingPayment.status === PAYMENT_STATUS.SUCCESS) {
    logger.info("Duplicate webhook ignored", { gatewayPaymentId });
    return res.status(200).json({ received: true });
  }

  const payment = await Payment.findOne({ gateway_order_id: gatewayOrderId });
  if (!payment) {
    logger.warn("Webhook for unknown order", { gatewayOrderId });
    return res.status(200).json({ received: true });
  }

  const order = await Order.findById(payment.order_id);
  if (!order) return res.status(200).json({ received: true });

  if (eventType === "payment.captured") {
    // Validate amount (gateway sends in paise)
    const expectedPaise = Math.round(payment.amount * 100);
    if (amountPaise && amountPaise !== expectedPaise) {
      logger.warn("Amount mismatch in webhook", { expected: expectedPaise, received: amountPaise, orderId: order._id });
      payment.status = PAYMENT_STATUS.FAILED;
      payment.gateway_response_reference = JSON.stringify(event);
      await payment.save();
      order.payment_status = PAYMENT_STATUS.FAILED;
      order.status = ORDER_STATUS.PAYMENT_FAILED;
      await order.save();
      return res.status(200).json({ received: true });
    }

    // Stage 4 — Final order confirmation: recheck availability
    const availCheck = await checkOrderAvailability(order._id);
    if (!availCheck.available) {
      logger.warn("Availability check failed at payment confirmation", { orderId: order._id, reason: availCheck.reason });
      payment.status = PAYMENT_STATUS.FAILED;
      payment.gateway_response_reference = JSON.stringify({ reason: availCheck.reason, code: availCheck.code });
      await payment.save();
      order.payment_status = PAYMENT_STATUS.FAILED;
      order.status = ORDER_STATUS.PAYMENT_FAILED;
      await order.save();
      return res.status(200).json({ received: true });
    }

    // Stage 4 — Final order confirmation: recheck prices
    const priceCheck = await revalidateOrderPrices(order._id);
    if (!priceCheck.valid) {
      logger.warn("Price revalidation failed at payment confirmation", { orderId: order._id, changes: priceCheck.changes });
      payment.status = PAYMENT_STATUS.FAILED;
      payment.gateway_response_reference = JSON.stringify({ reason: "Price changed during checkout.", changes: priceCheck.changes });
      await payment.save();
      order.payment_status = PAYMENT_STATUS.FAILED;
      order.status = ORDER_STATUS.PAYMENT_FAILED;
      await order.save();
      return res.status(200).json({ received: true });
    }

    payment.status = PAYMENT_STATUS.SUCCESS;
    payment.gateway_payment_id = gatewayPaymentId;
    payment.gateway_response_reference = JSON.stringify(event);
    payment.paid_at = new Date();
    await payment.save();

    order.payment_status = PAYMENT_STATUS.SUCCESS;
    order.status = ORDER_STATUS.CONFIRMED;
    await order.save();

    await createAudit({ action: AUDIT_ACTIONS.PAYMENT_ACTION, entity_type: "Payment", entity_id: payment._id, new_value: { status: PAYMENT_STATUS.SUCCESS, gatewayPaymentId }, ip_address: req.ip });
  } else if (eventType === "payment.failed") {
    payment.status = PAYMENT_STATUS.FAILED;
    payment.gateway_response_reference = JSON.stringify(event);
    await payment.save();
    order.payment_status = PAYMENT_STATUS.FAILED;
    order.status = ORDER_STATUS.PAYMENT_FAILED;
    await order.save();
  }

  return res.status(200).json({ received: true });
};

module.exports = { getPayments, handleWebhook };
