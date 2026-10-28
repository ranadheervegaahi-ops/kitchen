// const router = require("express").Router();
// const { updateVariant, updateVariantPrice, updateVariantStatus, updateVariantAvailability } = require("../../controllers/variantController");
// const auth = require("../../Middleware/authMiddleware");
// const validate = require("../../Middleware/validationMiddleware");
// const { variantValidator, variantPriceValidator, variantStatusValidator, variantAvailabilityValidator } = require("../../validators/variantValidator");

// router.put("/:id", auth, variantValidator, validate, updateVariant);
// router.put("/:id/price", auth, variantPriceValidator, validate, updateVariantPrice);
// router.patch("/:id/status", auth, variantStatusValidator, validate, updateVariantStatus);
// router.patch("/:id/availability", auth, variantAvailabilityValidator, validate, updateVariantAvailability);

// module.exports = router;

// const router = require("express").Router();

// const {
//   getVariants,
//   createVariant,
//   updateVariant,
//   updateVariantPrice,
//   updateVariantStatus,
//   updateVariantAvailability,
// } = require("../../controllers/variantController");

// const auth = require("../../Middleware/authMiddleware");
// const validate = require("../../Middleware/validationMiddleware");

// const {
//   variantValidator,
//   variantPriceValidator,
//   variantStatusValidator,
//   variantAvailabilityValidator,
// } = require("../../validators/variantValidator");

// // GET /api/admin/products/:id/variants
// // Get all variants belonging to a product
// router.get(
//   "/products/:id/variants",
//   auth,
//   getVariants
// );

// // POST /api/admin/products/:id/variants
// // Create a new product variant
// router.post(
//   "/products/:id/variants",
//   auth,
//   variantValidator,
//   validate,
//   createVariant
// );

// // PUT /api/admin/variants/:id
// // Update variant details
// router.put(
//   "/:id",
//   auth,
//   variantValidator,
//   validate,
//   updateVariant
// );

// // PUT /api/admin/variants/:id/price
// // Update variant price
// router.put(
//   "/:id/price",
//   auth,
//   variantPriceValidator,
//   validate,
//   updateVariantPrice
// );

// // PATCH /api/admin/variants/:id/status
// // Activate or deactivate a variant
// router.patch(
//   "/:id/status",
//   auth,
//   variantStatusValidator,
//   validate,
//   updateVariantStatus
// );

// // PATCH /api/admin/variants/:id/availability
// // Mark a variant available or unavailable
// router.patch(
//   "/:id/availability",
//   auth,
//   variantAvailabilityValidator,
//   validate,
//   updateVariantAvailability
// );

// module.exports = router;

const router = require("express").Router();

const {
  getVariants,
  createVariant,
  updateVariant,
  updateVariantPrice,
  updateVariantStatus,
  updateVariantAvailability,
  deleteVariant,
} = require("../../controllers/variantController");

const auth = require("../../Middleware/authMiddleware");
const validate = require("../../Middleware/validationMiddleware");

const {
  variantValidator,
  variantPriceValidator,
  variantStatusValidator,
  variantAvailabilityValidator,
} = require("../../validators/variantValidator");

// GET /api/admin/products/:id/variants
router.get(
  "/products/:id/variants",
  auth,
  getVariants
);

// POST /api/admin/products/:id/variants
router.post(
  "/products/:id/variants",
  auth,
  variantValidator,
  validate,
  createVariant
);

// DELETE /api/admin/variants/:id
router.delete(
  "/:id",
  auth,
  deleteVariant
);

// PUT /api/admin/variants/:id
router.put(
  "/:id",
  auth,
  variantValidator,
  validate,
  updateVariant
);

// PUT /api/admin/variants/:id/price
router.put(
  "/:id/price",
  auth,
  variantPriceValidator,
  validate,
  updateVariantPrice
);

// PATCH /api/admin/variants/:id/status
router.patch(
  "/:id/status",
  auth,
  variantStatusValidator,
  validate,
  updateVariantStatus
);

// PATCH /api/admin/variants/:id/availability
router.patch(
  "/:id/availability",
  auth,
  variantAvailabilityValidator,
  validate,
  updateVariantAvailability
);

module.exports = router;
