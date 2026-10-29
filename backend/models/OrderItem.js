// const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema(
//   {
//     order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
//     product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//     product_name_snapshot: { type: String, required: true },
//     variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" },
//     variant_name_snapshot: { type: String, required: true },
//     unit_price_snapshot: { type: Number, required: true, min: 0 },
//     quantity: { type: Number, required: true, min: 1 },
//     subtotal: { type: Number, required: true, min: 0 },
//   },
//   { timestamps: true }
// );

// orderItemSchema.index({ order_id: 1 });

// module.exports = mongoose.model("OrderItem", orderItemSchema);

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    item_type: {
      type: String,
      enum: ["PRODUCT", "HUNDI", "WEEKLY_HUNDI"],
      default: "PRODUCT",
      required: true,
    },

    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    hundi_package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HundiPackage",
      default: null,
    },

    product_name_snapshot: {
      type: String,
      required: true,
      trim: true,
    },

    variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },

    variant_name_snapshot: {
      type: String,
      required: true,
      trim: true,
    },

    unit_price_snapshot: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

orderItemSchema.index({ order_id: 1 });

module.exports = mongoose.model("OrderItem", orderItemSchema);
