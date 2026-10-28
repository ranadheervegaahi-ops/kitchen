const CustomerAddress = require("../models/CustomerAddress");
const { success, error } = require("../utils/response");

const VALID_LABELS = ["Home", "Work", "Other"];

// POST /api/customer/addresses
const createAddress = async (req, res) => {
  try {
    const {
      label = "Home",
      house_flat_no,
      street_area,
      landmark = "",
      pincode,
      is_default = false,
    } = req.body;

    if (
      !house_flat_no?.trim() ||
      !street_area?.trim() ||
      !pincode
    ) {
      return error(
        res,
        "House/flat number, street/area and pincode are required.",
        400
      );
    }

    if (!VALID_LABELS.includes(label)) {
      return error(res, "Invalid address label.", 400);
    }

    if (!/^[1-9][0-9]{5}$/.test(String(pincode))) {
      return error(res, "Enter a valid 6-digit pincode.", 400);
    }

    const addressCount = await CustomerAddress.countDocuments({
      customer_id: req.user.id,
    });

    const shouldBeDefault = is_default || addressCount === 0;

    if (shouldBeDefault) {
      await CustomerAddress.updateMany(
        { customer_id: req.user.id },
        { $set: { is_default: false } }
      );
    }

    const address = await CustomerAddress.create({
      customer_id: req.user.id,
      label,
      house_flat_no: house_flat_no.trim(),
      street_area: street_area.trim(),
      landmark: landmark.trim(),
      pincode: String(pincode),
      is_default: shouldBeDefault,
    });

    return success(res, address, "Address saved successfully.");
  } catch (err) {
    console.error("Create address error:", err);
    return error(res, "Failed to save address.", 500);
  }
};

// GET /api/customer/addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await CustomerAddress.find({
      customer_id: req.user.id,
    }).sort({ is_default: -1, createdAt: -1 });

    return success(res, addresses, "Addresses fetched successfully.");
  } catch (err) {
    console.error("Get addresses error:", err);
    return error(res, "Failed to fetch addresses.", 500);
  }
};

// GET /api/customer/addresses/:id
const getAddressById = async (req, res) => {
  try {
    const address = await CustomerAddress.findOne({
      _id: req.params.id,
      customer_id: req.user.id,
    });

    if (!address) {
      return error(res, "Address not found.", 404);
    }

    return success(res, address, "Address fetched successfully.");
  } catch (err) {
    if (err.name === "CastError") {
      return error(res, "Invalid address ID.", 400);
    }

    console.error("Get address error:", err);
    return error(res, "Failed to fetch address.", 500);
  }
};

// PUT /api/customer/addresses/:id
const updateAddress = async (req, res) => {
  try {
    const {
      label,
      house_flat_no,
      street_area,
      landmark,
      pincode,
      is_default,
    } = req.body;

    const address = await CustomerAddress.findOne({
      _id: req.params.id,
      customer_id: req.user.id,
    });

    if (!address) {
      return error(res, "Address not found.", 404);
    }

    if (label !== undefined) {
      if (!VALID_LABELS.includes(label)) {
        return error(res, "Invalid address label.", 400);
      }
      address.label = label;
    }

    if (house_flat_no !== undefined) {
      if (!house_flat_no.trim()) {
        return error(res, "House/flat number is required.", 400);
      }
      address.house_flat_no = house_flat_no.trim();
    }

    if (street_area !== undefined) {
      if (!street_area.trim()) {
        return error(res, "Street/area is required.", 400);
      }
      address.street_area = street_area.trim();
    }

    if (landmark !== undefined) {
      address.landmark = landmark.trim();
    }

    if (pincode !== undefined) {
      if (!/^[1-9][0-9]{5}$/.test(String(pincode))) {
        return error(res, "Enter a valid 6-digit pincode.", 400);
      }
      address.pincode = String(pincode);
    }

    if (is_default === true) {
      await CustomerAddress.updateMany(
        { customer_id: req.user.id },
        { $set: { is_default: false } }
      );

      address.is_default = true;
    }

    await address.save();

    return success(res, address, "Address updated successfully.");
  } catch (err) {
    if (err.name === "CastError") {
      return error(res, "Invalid address ID.", 400);
    }

    console.error("Update address error:", err);
    return error(res, "Failed to update address.", 500);
  }
};

// PATCH /api/customer/addresses/:id/default
const setDefaultAddress = async (req, res) => {
  try {
    const address = await CustomerAddress.findOne({
      _id: req.params.id,
      customer_id: req.user.id,
    });

    if (!address) {
      return error(res, "Address not found.", 404);
    }

    await CustomerAddress.updateMany(
      { customer_id: req.user.id },
      { $set: { is_default: false } }
    );

    address.is_default = true;
    await address.save();

    return success(res, address, "Default address updated.");
  } catch (err) {
    if (err.name === "CastError") {
      return error(res, "Invalid address ID.", 400);
    }

    console.error("Set default address error:", err);
    return error(res, "Failed to set default address.", 500);
  }
};

// DELETE /api/customer/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    const address = await CustomerAddress.findOne({
      _id: req.params.id,
      customer_id: req.user.id,
    });

    if (!address) {
      return error(res, "Address not found.", 404);
    }

    const wasDefault = address.is_default;

    await address.deleteOne();

    // If the default address is deleted, select another saved address.
    if (wasDefault) {
      const nextAddress = await CustomerAddress.findOne({
        customer_id: req.user.id,
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.is_default = true;
        await nextAddress.save();
      }
    }

    return success(res, null, "Address deleted successfully.");
  } catch (err) {
    if (err.name === "CastError") {
      return error(res, "Invalid address ID.", 400);
    }

    console.error("Delete address error:", err);
    return error(res, "Failed to delete address.", 500);
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};