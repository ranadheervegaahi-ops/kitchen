const express = require("express");
const router = express.Router();

const authCustomer = require("../../Middleware/customerAuthMiddleware");

const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} = require("../../controllers/customerAddressController");

router.use(authCustomer);

router.post("/", createAddress);
router.get("/", getAddresses);
router.get("/:id", getAddressById);
router.put("/:id", updateAddress);
router.patch("/:id/default", setDefaultAddress);
router.delete("/:id", deleteAddress);
module.exports = router;