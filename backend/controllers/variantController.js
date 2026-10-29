// const ProductVariant = require("../models/ProductVariant");
// const Product = require("../models/Product");
// const OrderItem = require("../models/OrderItem");
// const { success, error } = require("../utils/response");
// const { createAudit } = require("../utils/auditHelper");
// const { AUDIT_ACTIONS } = require("../utils/constants");
// const { toFixed2 } = require("../utils/money");
// const { allVariantsUnavailable } = require("../utils/availabilityHelper");

// // GET /api/admin/products/:id/variants
// const getVariants = async (req, res) => {
//   const variants = await ProductVariant.find({ product_id: req.params.id }).sort({ createdAt: 1 });
//   return success(res, variants);
// };

// // POST /api/admin/products/:id/variants
// // const createVariant = async (req, res) => {
// //   const product = await Product.findById(req.params.id);
// //   if (!product) return error(res, "Product not found.", 404, "NOT_FOUND");

// //   const { variant_type, variant_name, quantity_value, quantity_unit, member_count, price, status } = req.body;

// //   const duplicate = await ProductVariant.findOne({
// //     product_id: req.params.id,
// //     variant_name: { $regex: `^${variant_name.trim()}$`, $options: "i" },
// //     status: "active",
// //   });
// //   if (duplicate) return error(res, "An active variant with this name already exists.", 409, "DUPLICATE");

// //   const variant = await ProductVariant.create({
// //     product_id: req.params.id,
// //     variant_type,
// //     variant_name: variant_name.trim(),
// //     quantity_value,
// //     quantity_unit,
// //     member_count,
// //     price: toFixed2(price),
// //     status,
// //   });
// //   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.VARIANT_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, new_value: variant, ip_address: req.ip });
// //   return success(res, variant, "Variant created.", 201);
// // };

// const createVariant = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return error(res, "Product not found.", 404, "NOT_FOUND");
//   }

//   const {
//     variant_type,
//     variant_name,
//     quantity_value,
//     quantity_unit,
//     member_count,
//     price,
//     status,
//   } = req.body;

//   if (!variant_name || !variant_name.trim()) {
//     return error(res, "Variant name is required.", 422, "VALIDATION_ERROR");
//   }

//   // Price is optional when adding a weight.
//   // If the admin does not provide a price, save 0.
//   const initialPrice =
//     price === undefined || price === null || price === ""
//       ? 0
//       : Number(price);

//   if (!Number.isFinite(initialPrice) || initialPrice < 0) {
//     return error(
//       res,
//       "Price must be a valid number greater than or equal to 0.",
//       422,
//       "INVALID_PRICE"
//     );
//   }

//   // Check all variants, not only active variants.
//   const duplicate = await ProductVariant.findOne({
//     product_id: req.params.id,
//     variant_name: {
//       $regex: `^${variant_name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
//       $options: "i",
//     },
//   });

//   if (duplicate) {
//     // If the variant already exists but is inactive, reactivate it.
//     // Do not overwrite its saved price.
//     if (duplicate.status === "inactive") {
//       duplicate.status = "active";
//       await duplicate.save();

//       return success(
//         res,
//         duplicate,
//         "Existing variant activated.",
//         200
//       );
//     }
//     return success(
//       res,
//       duplicate,
//       "Variant already exists for this product.",
//       200
//     );
//   }

//   const variant = await ProductVariant.create({
//     product_id: req.params.id,
//     variant_type,
//     variant_name: variant_name.trim(),
//     quantity_value,
//     quantity_unit,
//     member_count,
//     price: toFixed2(initialPrice),
//     status: status || "active",
//   });

//   await createAudit({
//     admin_id: req.admin._id,
//     action: AUDIT_ACTIONS.VARIANT_CHANGED,
//     entity_type: "ProductVariant",
//     entity_id: variant._id,
//     new_value: variant,
//     ip_address: req.ip,
//   });

//   return success(res, variant, "Variant created.", 201);
// };

// // PUT /api/admin/variants/:id
// const updateVariant = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");

//   const old_value = variant.toObject();
//   const fields = ["variant_type", "variant_name", "quantity_value", "quantity_unit", "member_count", "status", "availability"];
//   fields.forEach((f) => { if (req.body[f] !== undefined) variant[f] = req.body[f]; });
//   if (req.body.price !== undefined) variant.price = toFixed2(req.body.price);
//   await variant.save();

//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.VARIANT_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, old_value, new_value: variant, ip_address: req.ip });
//   return success(res, variant, "Variant updated.");
// };

// // PUT /api/admin/variants/:id/price
// const updateVariantPrice = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");
//   const newPrice = toFixed2(req.body.price);
//   if (newPrice <= 0) return error(res, "Price must be greater than 0.", 422, "INVALID_PRICE");
//   const old_value = { price: variant.price };
//   const pctChange = variant.price > 0 ? Math.abs((newPrice - variant.price) / variant.price) * 100 : 0;
//   variant.price = newPrice;
//   await variant.save();
//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.PRICE_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, old_value, new_value: { price: variant.price }, ip_address: req.ip });
//   return success(res, { variant, price_change_pct: toFixed2(pctChange), old_price: old_value.price }, "Price updated.");
// };

// // PATCH /api/admin/variants/:id/status
// const updateVariantStatus = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");
//   variant.status = req.body.status;
//   await variant.save();
//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.VARIANT_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, new_value: { status: variant.status }, ip_address: req.ip });
//   return success(res, variant, "Variant status updated.");
// };

// // PATCH /api/admin/variants/:id/availability
// const updateVariantAvailability = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");
//   const old_value = { availability: variant.availability };
//   variant.availability = req.body.availability;
//   await variant.save();
//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.VARIANT_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, old_value, new_value: { availability: variant.availability }, ip_address: req.ip });
//   const allDown = variant.availability === false ? await allVariantsUnavailable(variant.product_id) : false;
//   return success(res, { variant, all_variants_unavailable: allDown }, "Variant availability updated.");
// };

// // Revalidate order item prices against current variant prices (called before payment confirmation)
// // Returns { valid: true } or { valid: false, changes: [{ variant_id, variant_name, snapshot_price, current_price }] }
// const revalidateOrderPrices = async (orderId) => {
//   const items = await OrderItem.find({ order_id: orderId }).lean();
//   const changes = [];
//   for (const item of items) {
//     if (!item.variant_id) continue;
//     const variant = await ProductVariant.findById(item.variant_id).lean();
//     if (!variant) continue;
//     if (toFixed2(variant.price) !== toFixed2(item.unit_price_snapshot)) {
//       changes.push({
//         variant_id: variant._id,
//         variant_name: variant.variant_name,
//         snapshot_price: item.unit_price_snapshot,
//         current_price: variant.price,
//       });
//     }
//   }
//   return changes.length === 0 ? { valid: true } : { valid: false, changes };
// };

//  // DELETE /api/admin/variants/:id
// const deleteVariant = async (req, res) => {
//   try {
//     const variant = await ProductVariant.findById(req.params.id);

//     if (!variant) {
//       return error(
//         res,
//         "Variant not found.",
//         404,
//         "NOT_FOUND"
//       );
//     }

//     const old_value = variant.toObject();

//     // Existing orders use chestunna variant ni delete cheyyakudadhu.
//     const orderItemExists = await OrderItem.exists({
//       variant_id: variant._id,
//     });

//     if (orderItemExists) {
//       return error(
//         res,
//         "This variant is linked to existing orders. Deactivate it instead of deleting.",
//         409,
//         "VARIANT_IN_USE"
//       );
//     }

//     await variant.deleteOne();

//     await createAudit({
//       admin_id: req.admin._id,
//       action: AUDIT_ACTIONS.VARIANT_CHANGED,
//       entity_type: "ProductVariant",
//       entity_id: variant._id,
//       old_value,
//       new_value: null,
//       ip_address: req.ip,
//     });

//     return success(
//       res,
//       { id: variant._id },
//       "Variant deleted successfully."
//     );
//   } catch (err) {
//     console.error("Delete variant error:", err);

//     return error(
//       res,
//       "Failed to delete variant.",
//       500,
//       "SERVER_ERROR"
//     );
//   }
// };

// module.exports = {
//   getVariants,
//   createVariant,
//   updateVariant,
//   updateVariantPrice,
//   updateVariantStatus,
//   updateVariantAvailability,
//   deleteVariant,
//   revalidateOrderPrices,
// };
// const ProductVariant = require("../models/ProductVariant");
// const Product = require("../models/Product");
// const OrderItem = require("../models/OrderItem");
// const { success, error } = require("../utils/response");
// const { createAudit } = require("../utils/auditHelper");
// const { AUDIT_ACTIONS } = require("../utils/constants");
// const { toFixed2 } = require("../utils/money");
// const { allVariantsUnavailable } = require("../utils/availabilityHelper");

// // Returns "instock" | "preorder", or undefined if the value is missing/invalid
// const normalizeOrderType = (value) =>
//   value === "preorder" || value === "instock" ? value : undefined;

// // GET /api/admin/products/:id/variants
// const getVariants = async (req, res) => {
//   const variants = await ProductVariant.find({ product_id: req.params.id }).sort({ createdAt: 1 });
//   return success(res, variants);
// };

// // POST /api/admin/products/:id/variants
// const createVariant = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return error(res, "Product not found.", 404, "NOT_FOUND");
//   }

//   const {
//     variant_type,
//     variant_name,
//     quantity_value,
//     quantity_unit,
//     member_count,
//     price,
//     status,
//     order_type,
//   } = req.body;

//   if (!variant_name || !variant_name.trim()) {
//     return error(res, "Variant name is required.", 422, "VALIDATION_ERROR");
//   }

//   const orderType = normalizeOrderType(order_type);

//   // Price is optional when adding a weight.
//   // If the admin does not provide a price, save 0.
//   const initialPrice =
//     price === undefined || price === null || price === ""
//       ? 0
//       : Number(price);

//   if (!Number.isFinite(initialPrice) || initialPrice < 0) {
//     return error(
//       res,
//       "Price must be a valid number greater than or equal to 0.",
//       422,
//       "INVALID_PRICE"
//     );
//   }

//   // Check all variants, not only active variants.
//   const duplicate = await ProductVariant.findOne({
//     product_id: req.params.id,
//     variant_name: {
//       $regex: `^${variant_name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
//       $options: "i",
//     },
//   });

//   if (duplicate) {
//     // Reactivate an inactive variant (its saved price is kept)
//     // and apply the requested order type if one was sent.
//     let changed = false;

//     if (duplicate.status === "inactive") {
//       duplicate.status = "active";
//       changed = true;
//     }

//     if (orderType && duplicate.order_type !== orderType) {
//       duplicate.order_type = orderType;
//       changed = true;
//     }

//     if (changed) await duplicate.save();

//     return success(
//       res,
//       duplicate,
//       changed
//         ? "Existing variant updated."
//         : "Variant already exists for this product.",
//       200
//     );
//   }

//   const variant = await ProductVariant.create({
//     product_id: req.params.id,
//     variant_type,
//     variant_name: variant_name.trim(),
//     quantity_value,
//     quantity_unit,
//     member_count,
//     price: toFixed2(initialPrice),
//     status: status || "active",
//     order_type: orderType || "instock",
//   });

//   await createAudit({
//     admin_id: req.admin._id,
//     action: AUDIT_ACTIONS.VARIANT_CHANGED,
//     entity_type: "ProductVariant",
//     entity_id: variant._id,
//     new_value: variant,
//     ip_address: req.ip,
//   });

//   return success(res, variant, "Variant created.", 201);
// };

// // PUT /api/admin/variants/:id
// const updateVariant = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");

//   const old_value = variant.toObject();

//   const fields = [
//     "variant_type",
//     "variant_name",
//     "quantity_value",
//     "quantity_unit",
//     "member_count",
//     "status",
//     "availability",
//   ];
//   fields.forEach((f) => {
//     if (req.body[f] !== undefined) variant[f] = req.body[f];
//   });

//   const orderType = normalizeOrderType(req.body.order_type);
//   if (orderType) variant.order_type = orderType;

//   if (req.body.price !== undefined) variant.price = toFixed2(req.body.price);
//   await variant.save();

//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.VARIANT_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, old_value, new_value: variant, ip_address: req.ip });
//   return success(res, variant, "Variant updated.");
// };

// // PUT /api/admin/variants/:id/price
// const updateVariantPrice = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");
//   const newPrice = toFixed2(req.body.price);
//   if (newPrice <= 0) return error(res, "Price must be greater than 0.", 422, "INVALID_PRICE");
//   const old_value = { price: variant.price };
//   const pctChange = variant.price > 0 ? Math.abs((newPrice - variant.price) / variant.price) * 100 : 0;
//   variant.price = newPrice;
//   await variant.save();
//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.PRICE_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, old_value, new_value: { price: variant.price }, ip_address: req.ip });
//   return success(res, { variant, price_change_pct: toFixed2(pctChange), old_price: old_value.price }, "Price updated.");
// };

// // PATCH /api/admin/variants/:id/status
// const updateVariantStatus = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");
//   variant.status = req.body.status;
//   await variant.save();
//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.VARIANT_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, new_value: { status: variant.status }, ip_address: req.ip });
//   return success(res, variant, "Variant status updated.");
// };

// // PATCH /api/admin/variants/:id/availability
// const updateVariantAvailability = async (req, res) => {
//   const variant = await ProductVariant.findById(req.params.id);
//   if (!variant) return error(res, "Variant not found.", 404, "NOT_FOUND");
//   const old_value = { availability: variant.availability };
//   variant.availability = req.body.availability;
//   await variant.save();
//   await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.VARIANT_CHANGED, entity_type: "ProductVariant", entity_id: variant._id, old_value, new_value: { availability: variant.availability }, ip_address: req.ip });
//   const allDown = variant.availability === false ? await allVariantsUnavailable(variant.product_id) : false;
//   return success(res, { variant, all_variants_unavailable: allDown }, "Variant availability updated.");
// };

// // Revalidate order item prices against current variant prices (called before payment confirmation)
// // Returns { valid: true } or { valid: false, changes: [{ variant_id, variant_name, snapshot_price, current_price }] }
// const revalidateOrderPrices = async (orderId) => {
//   const items = await OrderItem.find({ order_id: orderId }).lean();
//   const changes = [];
//   for (const item of items) {
//     if (!item.variant_id) continue;
//     const variant = await ProductVariant.findById(item.variant_id).lean();
//     if (!variant) continue;
//     if (toFixed2(variant.price) !== toFixed2(item.unit_price_snapshot)) {
//       changes.push({
//         variant_id: variant._id,
//         variant_name: variant.variant_name,
//         snapshot_price: item.unit_price_snapshot,
//         current_price: variant.price,
//       });
//     }
//   }
//   return changes.length === 0 ? { valid: true } : { valid: false, changes };
// };

// // DELETE /api/admin/variants/:id
// const deleteVariant = async (req, res) => {
//   try {
//     const variant = await ProductVariant.findById(req.params.id);

//     if (!variant) {
//       return error(res, "Variant not found.", 404, "NOT_FOUND");
//     }

//     const old_value = variant.toObject();

//     // A variant used in existing orders must not be deleted.
//     const orderItemExists = await OrderItem.exists({
//       variant_id: variant._id,
//     });

//     if (orderItemExists) {
//       return error(
//         res,
//         "This variant is linked to existing orders. Deactivate it instead of deleting.",
//         409,
//         "VARIANT_IN_USE"
//       );
//     }

//     await variant.deleteOne();

//     await createAudit({
//       admin_id: req.admin._id,
//       action: AUDIT_ACTIONS.VARIANT_CHANGED,
//       entity_type: "ProductVariant",
//       entity_id: variant._id,
//       old_value,
//       new_value: null,
//       ip_address: req.ip,
//     });

//     return success(res, { id: variant._id }, "Variant deleted successfully.");
//   } catch (err) {
//     console.error("Delete variant error:", err);

//     return error(res, "Failed to delete variant.", 500, "SERVER_ERROR");
//   }
// };

// module.exports = {
//   getVariants,
//   createVariant,
//   updateVariant,
//   updateVariantPrice,
//   updateVariantStatus,
//   updateVariantAvailability,
//   deleteVariant,
//   revalidateOrderPrices,
// };
const mongoose = require("mongoose");
const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");
const OrderItem = require("../models/OrderItem");
const { success, error } = require("../utils/response");
const { createAudit } = require("../utils/auditHelper");
const { AUDIT_ACTIONS } = require("../utils/constants");
const { toFixed2 } = require("../utils/money");
const { allVariantsUnavailable } = require("../utils/availabilityHelper");

// Returns "instock" | "preorder", or undefined if missing/invalid.
const normalizeOrderType = (value) => {
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase();

  return normalized === "preorder" || normalized === "instock"
    ? normalized
    : undefined;
};

// Validate MongoDB ObjectId before using it in a query.
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// Escape user-provided text before using it in a regular expression.
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/admin/products/:id/variants
const getVariants = async (req, res, next) => {
  try {
    const productId = req.params.id;

    // Hundi slugs are not Product IDs.
    if (!isValidObjectId(productId)) {
      return error(
        res,
        "Invalid product ID. Hundi packages do not use product variants. Please use the Hundi packages API.",
        400,
        "INVALID_PRODUCT_ID"
      );
    }

    const product = await Product.findById(productId).select("_id");

    if (!product) {
      return error(res, "Product not found.", 404, "NOT_FOUND");
    }

    const variants = await ProductVariant.find({
      product_id: product._id,
    }).sort({ createdAt: 1 });

    return success(res, variants);
  } catch (err) {
    return next(err);
  }
};

// POST /api/admin/products/:id/variants
const createVariant = async (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!isValidObjectId(productId)) {
      return error(res, "Invalid product ID.", 400, "INVALID_PRODUCT_ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
      return error(res, "Product not found.", 404, "NOT_FOUND");
    }

    const {
      variant_type,
      variant_name,
      quantity_value,
      quantity_unit,
      member_count,
      price,
      status,
      order_type,
    } = req.body;

    if (
      typeof variant_name !== "string" ||
      !variant_name.trim()
    ) {
      return error(
        res,
        "Variant name is required.",
        422,
        "VALIDATION_ERROR"
      );
    }

    const trimmedVariantName = variant_name.trim();
    const orderType = normalizeOrderType(order_type);

    // Price is optional when adding a weight.
    const initialPrice =
      price === undefined || price === null || price === ""
        ? 0
        : Number(price);

    if (!Number.isFinite(initialPrice) || initialPrice < 0) {
      return error(
        res,
        "Price must be a valid number greater than or equal to 0.",
        422,
        "INVALID_PRICE"
      );
    }

    // Check all variants, not only active variants.
    const duplicate = await ProductVariant.findOne({
      product_id: product._id,
      variant_name: {
        $regex: `^${escapeRegex(trimmedVariantName)}$`,
        $options: "i",
      },
    });

    if (duplicate) {
      let changed = false;

      // Reactivate an inactive variant while preserving its saved price.
      if (duplicate.status === "inactive") {
        duplicate.status = "active";
        changed = true;
      }

      if (orderType && duplicate.order_type !== orderType) {
        duplicate.order_type = orderType;
        changed = true;
      }

      if (changed) {
        await duplicate.save();
      }

      return success(
        res,
        duplicate,
        changed
          ? "Existing variant updated."
          : "Variant already exists for this product.",
        200
      );
    }

    const variant = await ProductVariant.create({
      product_id: product._id,
      variant_type,
      variant_name: trimmedVariantName,
      quantity_value,
      quantity_unit,
      member_count,
      price: toFixed2(initialPrice),
      status: status || "active",
      order_type: orderType || "instock",
    });

    await createAudit({
      admin_id: req.admin._id,
      action: AUDIT_ACTIONS.VARIANT_CHANGED,
      entity_type: "ProductVariant",
      entity_id: variant._id,
      new_value: variant,
      ip_address: req.ip,
    });

    return success(res, variant, "Variant created.", 201);
  } catch (err) {
    return next(err);
  }
};

// PUT /api/admin/variants/:id
const updateVariant = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return error(res, "Invalid variant ID.", 400, "INVALID_VARIANT_ID");
    }

    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) {
      return error(res, "Variant not found.", 404, "NOT_FOUND");
    }

    const old_value = variant.toObject();

    const fields = [
      "variant_type",
      "variant_name",
      "quantity_value",
      "quantity_unit",
      "member_count",
      "status",
      "availability",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        variant[field] = req.body[field];
      }
    });

    const orderType = normalizeOrderType(req.body.order_type);

    if (orderType) {
      variant.order_type = orderType;
    }

    if (req.body.price !== undefined) {
      const newPrice = Number(req.body.price);

      if (!Number.isFinite(newPrice) || newPrice < 0) {
        return error(
          res,
          "Price must be a valid number greater than or equal to 0.",
          422,
          "INVALID_PRICE"
        );
      }

      variant.price = toFixed2(newPrice);
    }

    await variant.save();

    await createAudit({
      admin_id: req.admin._id,
      action: AUDIT_ACTIONS.VARIANT_CHANGED,
      entity_type: "ProductVariant",
      entity_id: variant._id,
      old_value,
      new_value: variant,
      ip_address: req.ip,
    });

    return success(res, variant, "Variant updated.");
  } catch (err) {
    return next(err);
  }
};

// PUT /api/admin/variants/:id/price
const updateVariantPrice = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return error(res, "Invalid variant ID.", 400, "INVALID_VARIANT_ID");
    }

    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) {
      return error(res, "Variant not found.", 404, "NOT_FOUND");
    }

    const newPrice = Number(req.body.price);

    if (!Number.isFinite(newPrice) || newPrice <= 0) {
      return error(
        res,
        "Price must be a valid number greater than 0.",
        422,
        "INVALID_PRICE"
      );
    }

    const roundedPrice = toFixed2(newPrice);
    const old_value = { price: variant.price };

    const pctChange =
      Number(variant.price) > 0
        ? Math.abs(
            ((roundedPrice - Number(variant.price)) /
              Number(variant.price)) *
              100
          )
        : 0;

    variant.price = roundedPrice;
    await variant.save();

    await createAudit({
      admin_id: req.admin._id,
      action: AUDIT_ACTIONS.PRICE_CHANGED,
      entity_type: "ProductVariant",
      entity_id: variant._id,
      old_value,
      new_value: { price: variant.price },
      ip_address: req.ip,
    });

    return success(
      res,
      {
        variant,
        price_change_pct: toFixed2(pctChange),
        old_price: old_value.price,
      },
      "Price updated."
    );
  } catch (err) {
    return next(err);
  }
};

// PATCH /api/admin/variants/:id/status
const updateVariantStatus = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return error(res, "Invalid variant ID.", 400, "INVALID_VARIANT_ID");
    }

    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return error(
        res,
        "Status must be active or inactive.",
        422,
        "INVALID_STATUS"
      );
    }

    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) {
      return error(res, "Variant not found.", 404, "NOT_FOUND");
    }

    variant.status = status;
    await variant.save();

    await createAudit({
      admin_id: req.admin._id,
      action: AUDIT_ACTIONS.VARIANT_CHANGED,
      entity_type: "ProductVariant",
      entity_id: variant._id,
      new_value: { status: variant.status },
      ip_address: req.ip,
    });

    return success(res, variant, "Variant status updated.");
  } catch (err) {
    return next(err);
  }
};

// PATCH /api/admin/variants/:id/availability
const updateVariantAvailability = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return error(res, "Invalid variant ID.", 400, "INVALID_VARIANT_ID");
    }

    if (typeof req.body.availability !== "boolean") {
      return error(
        res,
        "Availability must be true or false.",
        422,
        "INVALID_AVAILABILITY"
      );
    }

    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) {
      return error(res, "Variant not found.", 404, "NOT_FOUND");
    }

    const old_value = { availability: variant.availability };

    variant.availability = req.body.availability;
    await variant.save();

    await createAudit({
      admin_id: req.admin._id,
      action: AUDIT_ACTIONS.VARIANT_CHANGED,
      entity_type: "ProductVariant",
      entity_id: variant._id,
      old_value,
      new_value: { availability: variant.availability },
      ip_address: req.ip,
    });

    const allDown =
      variant.availability === false
        ? await allVariantsUnavailable(variant.product_id)
        : false;

    return success(
      res,
      {
        variant,
        all_variants_unavailable: allDown,
      },
      "Variant availability updated."
    );
  } catch (err) {
    return next(err);
  }
};

// Revalidate order item prices against current variant prices.
// Called before payment confirmation.
const revalidateOrderPrices = async (orderId) => {
  const items = await OrderItem.find({ order_id: orderId }).lean();
  const changes = [];

  for (const item of items) {
    // Hundi items have no product variant; skip them.
    if (!item.variant_id) continue;

    const variant = await ProductVariant.findById(item.variant_id).lean();

    if (!variant) continue;

    if (toFixed2(variant.price) !== toFixed2(item.unit_price_snapshot)) {
      changes.push({
        variant_id: variant._id,
        variant_name: variant.variant_name,
        snapshot_price: item.unit_price_snapshot,
        current_price: variant.price,
      });
    }
  }

  return changes.length === 0
    ? { valid: true }
    : { valid: false, changes };
};

// DELETE /api/admin/variants/:id
const deleteVariant = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return error(res, "Invalid variant ID.", 400, "INVALID_VARIANT_ID");
    }

    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) {
      return error(res, "Variant not found.", 404, "NOT_FOUND");
    }

    const old_value = variant.toObject();

    // A variant used in existing orders must not be deleted.
    const orderItemExists = await OrderItem.exists({
      variant_id: variant._id,
    });

    if (orderItemExists) {
      return error(
        res,
        "This variant is linked to existing orders. Deactivate it instead of deleting.",
        409,
        "VARIANT_IN_USE"
      );
    }

    await variant.deleteOne();

    await createAudit({
      admin_id: req.admin._id,
      action: AUDIT_ACTIONS.VARIANT_CHANGED,
      entity_type: "ProductVariant",
      entity_id: variant._id,
      old_value,
      new_value: null,
      ip_address: req.ip,
    });

    return success(
      res,
      { id: variant._id },
      "Variant deleted successfully."
    );
  } catch (err) {
    console.error("Delete variant error:", err);

    return error(res, "Failed to delete variant.", 500, "SERVER_ERROR");
  }
};

module.exports = {
  getVariants,
  createVariant,
  updateVariant,
  updateVariantPrice,
  updateVariantStatus,
  updateVariantAvailability,
  deleteVariant,
  revalidateOrderPrices,
};
