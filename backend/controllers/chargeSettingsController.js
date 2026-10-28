const ChargeSettings = require("../models/ChargeSettings");
const { success, error } = require("../utils/response");

// GET /api/admin/charges
const getCharges = async (req, res) => {
  return success(res, await ChargeSettings.get());
};

// PUT /api/admin/charges   (send only the fields you want to change)
const updateCharges = async (req, res) => {
  try {
    const b = req.body;
    const s = await ChargeSettings.get();

    const bad = (message) => Object.assign(new Error(message), { statusCode: 422, code: "VALIDATION_ERROR" });

    const num = (key, min, max) => {
      if (b[key] === undefined) return;
      const v = Number(b[key]);
      if (!Number.isFinite(v) || v < min || v > max) throw bad(`${key} must be between ${min} and ${max}.`);
      s[key] = v;
    };
    const flag = (key) => {
      if (b[key] === undefined) return;
      if (typeof b[key] !== "boolean") throw bad(`${key} must be true or false.`);
      s[key] = b[key];
    };
    const coord = (key, min, max) => {
      if (b[key] === undefined) return;
      if (b[key] === null || b[key] === "") {
        s[key] = null;
        return;
      }
      const v = Number(b[key]);
      if (!Number.isFinite(v) || v < min || v > max) throw bad(`${key} must be between ${min} and ${max}.`);
      s[key] = v;
    };

    num("packing_charge", 0, 10000);
    num("delivery_rate_per_km", 0, 10000);
    num("min_delivery_km", 0, 100);
    num("max_delivery_km", 0, 1000);
    num("road_distance_factor", 1, 3);
    flag("packing_on_pickup");
    flag("packing_on_delivery");
    coord("restaurant_lat", -90, 90);
    coord("restaurant_lng", -180, 180);

    await s.save();
    return success(res, s, "Charge settings updated.");
  } catch (e) {
    return error(res, e.message || "Failed to update charge settings.", e.statusCode || 500, e.code || "SERVER_ERROR");
  }
};

module.exports = { getCharges, updateCharges };