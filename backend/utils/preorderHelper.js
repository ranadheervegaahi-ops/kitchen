// const { DateTime } = require("luxon");
// const BusinessSetting = require("../models/BusinessSetting");
// const BusinessHours = require("../models/BusinessHours");
// const { TIMEZONE } = require("./constants");

// const getMinPreorderHours = async () => {
//   const setting = await BusinessSetting.findOne({ key: "min_preorder_hours" });
//   return setting ? Number(setting.value) : 2;
// };

// const getTimezone = async () => {
//   const setting = await BusinessSetting.findOne({ key: "timezone" });
//   return setting ? setting.value : TIMEZONE;
// };

// const validatePreorderTime = async (requested_at) => {
//   const tz = await getTimezone();
//   const minHours = await getMinPreorderHours();
//   const now = DateTime.now().setZone(tz);
//   const requested = DateTime.fromJSDate(new Date(requested_at)).setZone(tz);
//   if (requested <= now) return { valid: false, message: "Requested time must be in the future." };
//   const diffHours = requested.diff(now, "hours").hours;
//   if (diffHours < minHours)
//     return { valid: false, message: `Pre-order must be at least ${minHours} hours in advance.` };
//   return { valid: true };
// };

// const validateBusinessHours = async (requested_at) => {
//   const tz = await getTimezone();
//   const requested = DateTime.fromJSDate(new Date(requested_at)).setZone(tz);
//   const dayName = requested.weekdayLong; // Monday, Tuesday...
//   const hours = await BusinessHours.findOne({ day: dayName });
//   if (!hours) return { valid: true }; // no config = open
//   if (!hours.is_open) return { valid: false, message: `Business is closed on ${dayName}.` };
//   if (hours.open_time && hours.close_time) {
//     const [oh, om] = hours.open_time.split(":").map(Number);
//     const [ch, cm] = hours.close_time.split(":").map(Number);
//     const open = requested.set({ hour: oh, minute: om, second: 0 });
//     const close = requested.set({ hour: ch, minute: cm, second: 0 });
//     if (requested < open || requested > close)
//       return { valid: false, message: `Business hours are ${hours.open_time} - ${hours.close_time} on ${dayName}.` };
//   }
//   return { valid: true };
// };
// module.exports = { validatePreorderTime, validateBusinessHours, getMinPreorderHours, getTimezone };

const { DateTime } = require("luxon");

const BusinessSetting = require("../models/BusinessSetting");
const BusinessHours = require("../models/BusinessHours");
const { MIN_PREORDER_HOURS, TIMEZONE } = require("./constants");

// Get minimum preorder hours from Business Settings
const getMinPreorderHours = async () => {
  const setting = await BusinessSetting.findOne({
    key: "min_preorder_hours",
  });
  const minHours = setting ? Number(setting.value) : 2;

  if (!Number.isFinite(minHours) || minHours < 0) {
    throw new Error("Invalid minimum preorder hours configuration.");
  }

  return minHours;
};

// Get configured timezone
const getTimezone = async () => {
  const tz = TIMEZONE;

  if (!DateTime.now().setZone(tz).isValid) {
    throw new Error("Invalid business timezone configuration.");
  }

  return tz;
};

// Validate preorder date and minimum advance booking time
const validatePreorderTime = async (requested_at) => {
  const tz = await getTimezone();
  const minHours = Math.max(
    MIN_PREORDER_HOURS,
    await getMinPreorderHours()
  );

  // Validate requested date
  if (
    requested_at === undefined ||
    requested_at === null ||
    requested_at === ""
  ) {
    return {
      valid: false,
      message: "Requested date and time are required.",
    };
  }

  const requestedInput = String(requested_at).trim();
  const requested = DateTime.fromISO(requestedInput, { zone: tz });

  if (!/[T ]\d{2}:\d{2}/.test(requestedInput) || !requested.isValid) {
    return {
      valid: false,
      message: "Invalid requested date or time.",
    };
  }

  const now = DateTime.now().setZone(tz);
  const earliestAllowed = now.plus({ hours: minHours });

  if (requested.toMillis() < earliestAllowed.toMillis()) {
    return {
      valid: false,
      message: `Pre-order must be at least ${minHours} hours in advance.`,
    };
  }

  // Same-day preorders are allowed if minimum lead time is satisfied
  return {
    valid: true,
  };
};

// Validate requested time against configured business hours
const validateBusinessHours = async (requested_at) => {
  const tz = await getTimezone();

  // Validate requested date
  if (
    requested_at === undefined ||
    requested_at === null ||
    requested_at === ""
  ) {
    return {
      valid: false,
      message: "Requested date and time are required.",
    };
  }

  const requestedInput = String(requested_at).trim();
  const requested = DateTime.fromISO(requestedInput, { zone: tz });

  if (!/[T ]\d{2}:\d{2}/.test(requestedInput) || !requested.isValid) {
    return {
      valid: false,
      message: "Invalid requested date or time.",
    };
  }

  // Get requested weekday in business timezone
  const dayName = requested.weekdayLong;

  const hours = await BusinessHours.findOne({
    day: dayName,
  });

  // Reject when business hours are not configured
  if (!hours) {
    return {
      valid: false,
      message: `Business hours are not configured for ${dayName}.`,
    };
  }

  // Reject closed days
  if (!hours.is_open) {
    return {
      valid: false,
      message: `Business is closed on ${dayName}.`,
    };
  }

  // Validate opening and closing times
  if (!hours.open_time || !hours.close_time) {
    return {
      valid: false,
      message: `Opening and closing times are not configured for ${dayName}.`,
    };
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (
    !timeRegex.test(hours.open_time) ||
    !timeRegex.test(hours.close_time)
  ) {
    return {
      valid: false,
      message: `Invalid business hours configured for ${dayName}.`,
    };
  }

  const [openHour, openMinute] = hours.open_time
    .split(":")
    .map(Number);

  const [closeHour, closeMinute] = hours.close_time
    .split(":")
    .map(Number);

  const open = requested.set({
    hour: openHour,
    minute: openMinute,
    second: 0,
    millisecond: 0,
  });

  const close = requested.set({
    hour: closeHour,
    minute: closeMinute,
    second: 0,
    millisecond: 0,
  });

  // This implementation supports same-day business hours only.
  // Overnight hours require separate handling.
  if (close.toMillis() <= open.toMillis()) {
    return {
      valid: false,
      message: `Invalid business hours configured for ${dayName}.`,
    };
  }

  // Requested time must fall within operating hours
  if (
    requested.toMillis() < open.toMillis() ||
    requested.toMillis() > close.toMillis()
  ) {
    return {
      valid: false,
      message: `Business hours are ${hours.open_time} - ${hours.close_time} on ${dayName}.`,
    };
  }

  return {
    valid: true,
  };
};

module.exports = {
  validatePreorderTime,
  validateBusinessHours,
  getMinPreorderHours,
  getTimezone,
};
