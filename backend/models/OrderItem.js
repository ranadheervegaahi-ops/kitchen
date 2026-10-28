const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    product_name_snapshot: { type: String, required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" },
    variant_name_snapshot: { type: String, required: true },
    unit_price_snapshot: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

orderItemSchema.index({ order_id: 1 });

module.exports = mongoose.model("OrderItem", orderItemSchema);
