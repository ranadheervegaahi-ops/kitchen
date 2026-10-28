const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const OrderItem = require("../models/OrderItem");

/**
 * Check availability of all items in an order.
 * Used at: menu retrieval, order creation, payment initiation, final confirmation.
 * Returns { available: true } or { available: false, reason, code, item }
 */
const checkOrderAvailability = async (orderId) => {
  const items = await OrderItem.find({ order_id: orderId }).lean();

  for (const item of items) {
    // Check product availability
    if (item.product_id) {
      const product = await Product.findById(item.product_id).lean();
      if (!product || product.status !== "active") {
        return { available: false, reason: `Product "${item.product_name_snapshot}" is no longer available.`, code: "PRODUCT_UNAVAILABLE", item };
      }
      if (!product.availability) {
        return { available: false, reason: `Product "${product.name}" has been marked unavailable.`, code: "PRODUCT_UNAVAILABLE", item };
      }
    }

    // Check variant availability
    if (item.variant_id) {
      const variant = await ProductVariant.findById(item.variant_id).lean();
      if (!variant || variant.status !== "active") {
        return { available: false, reason: `Variant "${item.variant_name_snapshot}" is no longer available.`, code: "VARIANT_UNAVAILABLE", item };
      }
      if (!variant.availability) {
        return { available: false, reason: `Variant "${variant.variant_name}" has been marked unavailable.`, code: "VARIANT_UNAVAILABLE", item };
      }
    }
  }

  return { available: true };
};

/**
 * Check if all variants of a product are unavailable.
 * Returns true if every active variant has availability = false.
 */
const allVariantsUnavailable = async (productId) => {
  const activeVariants = await ProductVariant.find({ product_id: productId, status: "active" }).lean();
  if (activeVariants.length === 0) return true;
  return activeVariants.every((v) => !v.availability);
};

module.exports = { checkOrderAvailability, allVariantsUnavailable };
