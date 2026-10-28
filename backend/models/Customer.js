const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    gender: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);

customerSchema.index({ mobile: 1 });

module.exports = mongoose.model("Customer", customerSchema);
