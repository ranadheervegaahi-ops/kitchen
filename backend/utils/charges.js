const ChargeSettings = require("../models/ChargeSettings");
const { add, multiply, toFixed2 } = require("./money");

const fail = (message, code, details) =>
  Object.assign(new Error(message), { statusCode: 422, code, details });

const getChargeSettings = () => ChargeSettings.get();

const toRad = (deg) => (deg * Math.PI) / 180;

// Straight-line distance between two coordinates, in km
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const pick = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== "");

// Reads coordinates from a saved address, whatever the field names are
const coordsOf = (a) => {
  if (!a) return null;
  const lat = Number(
    pick(a.latitude, a.lat, a.location?.latitude, a.location?.lat, a.location?.coordinates?.[1])
  );
  const lng = Number(
    pick(a.longitude, a.lng, a.lon, a.location?.longitude, a.location?.lng, a.location?.coordinates?.[0])
  );
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null;
  return { lat, lng };
};

/**
 * Works out packing, delivery fee and total.
 * Delivery fee = billed km x rate per km, where billed km = distance rounded UP
 * to a whole km (minimum min_delivery_km). Example at Rs 10/km: 2 km = 20, 3 km = 30.
 *
 * Distance source, in order:
 *  1. saved address coordinates + restaurant coordinates (calculated on the server)
 *  2. distance_km sent by the app
 */
async function calculateCharges({ fulfillment_type, subtotal, address, distance_km }) {
  const s = await getChargeSettings();
  const delivery = fulfillment_type === "DELIVERY";

  const packing_charge = (delivery ? s.packing_on_delivery : s.packing_on_pickup) ? s.packing_charge : 0;

  let delivery_charge = 0;
  let billed_km = 0;
  let km = null;
  let distance_source = null;

  if (delivery) {
    const from = coordsOf(address);
    if (from && s.restaurant_lat != null && s.restaurant_lng != null) {
      km = haversineKm(s.restaurant_lat, s.restaurant_lng, from.lat, from.lng) * (s.road_distance_factor || 1);
      distance_source = "address";
    } else {
      const sent = distance_km === undefined || distance_km === null || distance_km === "" ? NaN : Number(distance_km);
      if (!Number.isFinite(sent) || sent <= 0) {
        throw fail("Delivery distance (km) is required for delivery.", "DELIVERY_DISTANCE_REQUIRED");
      }
      km = sent;
      distance_source = "app";
    }

    km = Math.round(km * 100) / 100;

    if (s.max_delivery_km > 0 && km > s.max_delivery_km) {
      throw fail(`Delivery is available only within ${s.max_delivery_km} km.`, "OUT_OF_DELIVERY_RANGE", {
        distance_km: km,
        max_delivery_km: s.max_delivery_km,
      });
    }

    billed_km = Math.max(s.min_delivery_km, Math.ceil(km - 0.0001));
    delivery_charge = multiply(billed_km, s.delivery_rate_per_km);
  }

  const total_amount = toFixed2(add(add(subtotal, packing_charge), delivery_charge));

  return {
    packing_charge,
    delivery_charge,
    delivery_distance_km: km,
    billed_km,
    rate_per_km: s.delivery_rate_per_km,
    distance_source,
    total_amount,
  };
}

module.exports = { calculateCharges, getChargeSettings, haversineKm, coordsOf };