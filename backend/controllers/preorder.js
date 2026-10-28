const { DateTime } = require("luxon");
const BusinessHours = require("../models/BusinessHours");

const TIMEZONE = "Asia/Kolkata";
const configuredLeadHours = Number(process.env.PREORDER_LEAD_HOURS);

const PREORDER_CONFIG = {
  openingTime:process.env.PREORDER_OPENING_TIME || "10:00",
  closingTime:process.env.PREORDER_CLOSING_TIME || "17:00",
  leadHours: Number.isFinite(configuredLeadHours)
    ? Math.max(2, configuredLeadHours)
    : 2,
  packingCharge: 30,
  deliveryCharge: 40,
};

const round2 = (value) => Math.round(Number(value || 0) * 100) / 100;

const toMinutes = (time) => {
  const [hours, minutes] = String(time).split(":").map(Number);
  return hours * 60 + minutes;
};

const getPreorderInfo = async (dateInput, { mode = "product" } = {}) => {
  const now = DateTime.now().setZone(TIMEZONE);
  const expectedDate = mode === "hundi" ? now.plus({ days: 1 }).startOf("day") : null;
  const date = dateInput
    ? DateTime.fromISO(String(dateInput).trim(), { zone: TIMEZONE })
    : mode === "hundi"
      ? expectedDate
      : now.startOf("day");

  if (!date.isValid || date.toISODate() !== String(dateInput || date.toISODate()).trim()) {
    return null;
  }

  const dateString = date.toISODate();
  const day = date.setLocale("en").toFormat("EEEE");
  const hours = await BusinessHours.findOne({ day }).lean();
  const isProductPreorder = mode === "product";
  const openingTime =
    hours?.open_time ||
    (isProductPreorder ? PREORDER_CONFIG.openingTime : null);
  const closingTime =
    hours?.close_time ||
    (isProductPreorder ? PREORDER_CONFIG.closingTime : null);

  let isOpen = false;
  let message = "";

  if (isProductPreorder && date < now.startOf("day")) {
    message = "This date is in the past.";
  } else if (
    isProductPreorder &&
    date.hasSame(now, "day") &&
    now.hour * 60 +
      now.minute +
      PREORDER_CONFIG.leadHours * 60 >
      toMinutes(closingTime)
  ) {
    message = `Too late for today. Pre-orders need ${PREORDER_CONFIG.leadHours} hours lead time before closing.`;
  } else if (isProductPreorder) {
    isOpen = true;
    message = `Product pre-orders are available daily between ${openingTime} and ${closingTime}.`;
  } else if (mode === "hundi" && dateString !== expectedDate.toISODate()) {
    isOpen = false;
    message = "Hundi pre-orders are available for tomorrow only.";
  } else if (date < now.startOf("day")) {
    isOpen = false;
    message = "This date is in the past.";
  } else if (!hours) {
    isOpen = false;
    message = `Business hours are not configured for ${day}.`;
  } else if (!hours.is_open) {
    isOpen = false;
    message = `Business is closed on ${day}.`;
  } else if (!openingTime || !closingTime) {
    isOpen = false;
    message = `Opening and closing times are not configured for ${day}.`;
  } else {
    isOpen = true;
    message = `Pre-orders accepted between ${openingTime} and ${closingTime}.`;
  }

  return {
    date: dateString,
    day,
    isOpen,
    status: isOpen ? "open" : "closed",
    serverNow: now.toISO(),
    openingTime,
    closingTime,
    leadHours: PREORDER_CONFIG.leadHours,
    message,
  };
};
const calculatePricing = (price) => {
  const subtotal = round2(price);
  const { packingCharge, deliveryCharge } = PREORDER_CONFIG;

  return {
    pickup: {
      subtotal,
      packingCharge,
      deliveryCharge: 0,
      total: round2(subtotal + packingCharge),
    },
    delivery: {
      subtotal,
      packingCharge,
      deliveryCharge,
      total: round2(subtotal + packingCharge + deliveryCharge),
    },
  };
};

const calculateOrderCharges = (subtotalInput, fulfillmentType = "PICKUP") => {
  const subtotal = round2(subtotalInput);
  const packing_charge = PREORDER_CONFIG.packingCharge;
  const delivery_charge =
    String(fulfillmentType).toUpperCase() === "DELIVERY"
      ? PREORDER_CONFIG.deliveryCharge
      : 0;
  return {
    subtotal,
    packing_charge,
    delivery_charge,
    total_amount: round2(subtotal + packing_charge + delivery_charge),
  };
};
const validatePreorderSlot = (requestedAt) => {
  const requested = DateTime.fromISO(String(requestedAt), {
    zone: TIMEZONE,
  });

  if (!/[T ]\d{2}:\d{2}/.test(String(requestedAt)) || !requested.isValid) {
    return { ok: false, message: "Invalid requested date and time." };
  }

  const { openingTime, closingTime, leadHours } = PREORDER_CONFIG;
  const requestedTime = requested.hour * 60 + requested.minute;

  if (requested.toMillis() < DateTime.now().setZone(TIMEZONE).plus({ hours: leadHours }).toMillis()) {
    return {
      ok: false,
      message: `Pre-orders need at least ${leadHours} hours lead time.`,
    };
  }

  if (requestedTime < toMinutes(openingTime) || requestedTime > toMinutes(closingTime)) {
    return {
      ok: false,
      message: `Requested time must be between ${openingTime} and ${closingTime}.`,
    };
  }

  return { ok: true };
};
module.exports = {
  PREORDER_CONFIG,
  getPreorderInfo,
  calculatePricing,
  calculateOrderCharges,
  validatePreorderSlot,
};
