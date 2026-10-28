const mongoose = require("mongoose");

const chargeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "charges", unique: true },

    packing_charge: { type: Number, default: Number(process.env.PACKING_CHARGE ?? 30), min: 0 },
    packing_on_pickup: { type: Boolean, default: true },
    packing_on_delivery: { type: Boolean, default: true },

    delivery_rate_per_km: { type: Number, default: Number(process.env.DELIVERY_RATE_PER_KM ?? 10), min: 0 },
    min_delivery_km: { type: Number, default: 1, min: 0 }, // minimum billed km
    max_delivery_km: { type: Number, default: 15, min: 0 }, // 0 = no limit

    // Optional: lets the server work out the distance from a saved address
    restaurant_lat: { type: Number, default: null },
    restaurant_lng: { type: Number, default: null },
    road_distance_factor: { type: Number, default: 1, min: 1 }, // straight-line km x factor
  },
  { timestamps: true }
);

chargeSettingsSchema.statics.get = async function () {
  const existing = await this.findOne({ key: "charges" });
  if (existing) return existing;
  try {
    return await this.create({ key: "charges" });
  } catch {
    return this.findOne({ key: "charges" });
  }
};

module.exports = mongoose.model("ChargeSettings", chargeSettingsSchema);