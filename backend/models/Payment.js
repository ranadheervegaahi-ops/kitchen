const mongoose = require("mongoose");
const { PAYMENT_STATUS } = require("../utils/constants");

const paymentSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    gateway: { type: String, required: true },
    gateway_order_id: { type: String },
    gateway_payment_id: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    gateway_response_reference: { type: String },
    paid_at: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ order_id: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
