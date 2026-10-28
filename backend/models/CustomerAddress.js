const mongoose = require("mongoose");

const customerAddressSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
      required: true,
      trim: true,
    },

    house_flat_no: {
      type: String,
      required: true,
      trim: true,
    },

    street_area: {
      type: String,
      required: true,
      trim: true,
    },

    landmark: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode."],
    },

    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CustomerAddress",
  customerAddressSchema
);