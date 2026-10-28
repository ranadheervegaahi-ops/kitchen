// // const { DateTime } = require("luxon");
// // const PreorderSettings = require("../models/PreorderSettings");
// // const { success } = require("./response");
// // const { getTodayDayState } = require("../controllers/preorderSchedule.controller");

// // const TZ = "Asia/Kolkata";

// // const toMin = (t) => {
// //   const [h, m] = String(t).split(":").map(Number);
// //   return h * 60 + m;
// // };

// // // Can customers place a NORMAL (immediate) order right now?
// // const getOrderingStatus = async () => {
// //   const s = await PreorderSettings.get();
// //   const now = DateTime.now().setZone(TZ);
// //   const date = now.toISODate();
// //   const nowMin = now.hour * 60 + now.minute;
// //   const dow = now.weekday % 7; // luxon: Mon=1..Sun=7  ->  0=Sunday..6=Saturday

// //   // 1) Day closed (admin "close day" override, or a normally closed weekday)
// //   const override = s.dayOverrides.find((o) => o.date === date);
// //   const cfg = s.weekly.find((w) => w.day === dow);
// //   const closed = override ? override.closed : !cfg || !cfg.open;

// //   if (closed) {
// //     return {
// //       accepting: false,
// //       code: "STORE_CLOSED",
// //       message: "We are closed today. You can pre-order for another day.",
// //     };
// //   }

// //   // 2) Current time falls inside a slot the admin blocked
// //   const blocked = s.blockedSlots.some((b) => {
// //     if (b.date !== date) return false;
// //     const start = toMin(b.start);
// //     return nowMin >= start && nowMin < start + s.slotMinutes;
// //   });

// //   if (blocked) {
// //     return {
// //       accepting: false,
// //       code: "ORDERING_BLOCKED",
// //       message:
// //         "Orders are temporarily unavailable. Please try again later or pre-order for another time.",
// //     };
// //   }

// //   // 3) All remaining slots of today are filled / blocked
// //   const today = await getTodayDayState();

// //   if (today.allFull) {
// //     return {
// //       accepting: false,
// //       code: "ALL_SLOTS_FULL",
// //       message: "All slots are filled for today. Please pre-order for another day.",
// //     };
// //   }

// //   return { accepting: true, code: null, message: "" };
// // };

// // // GET /api/customer/orders/ordering-status
// // const orderingStatusHandler = async (req, res) => {
// //   return success(res, await getOrderingStatus());
// // };

// // module.exports = { getOrderingStatus, orderingStatusHandler };
// const { DateTime } = require("luxon");
// const PreorderSettings = require("../models/PreorderSettings");
// const { success } = require("./response");
// const { getTodayDayState } = require("../controllers/preorderSchedule.controller");

// const TZ = "Asia/Kolkata";

// const toMin = (t) => {
//   const [h, m] = String(t).split(":").map(Number);
//   return h * 60 + m;
// };

// // 17:00 -> "5 PM", 17:30 -> "5:30 PM"
// const fmtTime = (mins) => {
//   const h = Math.floor(mins / 60);
//   const m = mins % 60;
//   const ap = h >= 12 ? "PM" : "AM";
//   const h12 = h % 12 || 12;
//   return m ? `${h12}:${String(m).padStart(2, "0")} ${ap}` : `${h12} ${ap}`;
// };

// // Can customers place a NORMAL (immediate / Order Now) order right now?
// const getOrderingStatus = async () => {
//   const s = await PreorderSettings.get();
//   const now = DateTime.now().setZone(TZ);
//   const date = now.toISODate();
//   const nowMin = now.hour * 60 + now.minute;
//   const dow = now.weekday % 7; // luxon: Mon=1..Sun=7  ->  0=Sunday..6=Saturday

//   // helps to spot phone-clock vs server-clock differences
//   const base = { server_time: now.toFormat("d LLL, h:mm a") };

//   // 1) Day closed (admin "close day" override, or a normally closed weekday)
//   const override = s.dayOverrides.find((o) => o.date === date);
//   const cfg = s.weekly.find((w) => w.day === dow);
//   const closed = override ? override.closed : !cfg || !cfg.open;

//   if (closed) {
//     return {
//       ...base,
//       accepting: false,
//       code: "STORE_CLOSED",
//       message: "We are closed today. You can pre-order for another day.",
//     };
//   }

//   // 2) Current time falls inside a slot the admin blocked
//   const blockedStarts = s.blockedSlots
//     .filter((b) => b.date === date)
//     .map((b) => toMin(b.start));

//   const current = blockedStarts.find(
//     (start) => nowMin >= start && nowMin < start + s.slotMinutes
//   );

//   if (current !== undefined) {
//     // join back-to-back blocked slots (e.g. 4-5 PM and 5-6 PM -> until 6 PM)
//     let end = current + s.slotMinutes;
//     while (blockedStarts.includes(end)) end += s.slotMinutes;

//     return {
//       ...base,
//       accepting: false,
//       code: "ORDERING_BLOCKED",
//       message: `Orders are paused until ${fmtTime(end)}. Please try again then or pre-order for another time.`,
//       blocked_from: fmtTime(current),
//       reopens_at: fmtTime(end),
//     };
//   }

//   // 3) All remaining slots of today are filled / blocked
//   const today = await getTodayDayState();

//   if (today.allFull) {
//     return {
//       ...base,
//       accepting: false,
//       code: "ALL_SLOTS_FULL",
//       message: "All slots are filled for today. Please pre-order for another day.",
//     };
//   }

//   return { ...base, accepting: true, code: null, message: "" };
// };

// // GET /api/customer/orders/ordering-status
// const orderingStatusHandler = async (req, res) => {
//   return success(res, await getOrderingStatus());
// };

// module.exports = { getOrderingStatus, orderingStatusHandler };
const { DateTime } = require("luxon");
const PreorderSettings = require("../models/PreorderSettings");
const { success } = require("./response");
const { getTodayDayState } = require("../controllers/preorderSchedule.controller");

const TZ = "Asia/Kolkata";

// true  (default): a blocked slot also stops Order Now while the clock is inside it
// false           : blocked slots only affect pre-orders
const BLOCK_NOW_ON_BLOCKED_SLOT =
  String(process.env.BLOCK_ORDER_NOW_ON_BLOCKED_SLOT ?? "true").toLowerCase() !== "false";

const toMin = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
};

// 17:00 -> "5 PM", 17:30 -> "5:30 PM"
const fmtTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${ap}` : `${h12} ${ap}`;
};

// Can customers place a NORMAL (immediate / Order Now) order right now?
const getOrderingStatus = async () => {
  const s = await PreorderSettings.get();
  const now = DateTime.now().setZone(TZ);
  const date = now.toISODate();
  const nowMin = now.hour * 60 + now.minute;
  const dow = now.weekday % 7; // luxon: Mon=1..Sun=7  ->  0=Sunday..6=Saturday

  const blockedStarts = s.blockedSlots
    .filter((b) => b.date === date)
    .map((b) => toMin(b.start));

  // helps to see what the server sees (server clock vs phone clock, what is blocked today)
  const base = {
    server_time: now.toFormat("d LLL, h:mm a"),
    server_date: date,
    blocked_slots_today: [...blockedStarts].sort((a, b) => a - b).map(fmtTime),
  };

  // 1) Day closed (admin "close day" override, or a normally closed weekday)
  const override = s.dayOverrides.find((o) => o.date === date);
  const cfg = s.weekly.find((w) => w.day === dow);
  const closed = override ? override.closed : !cfg || !cfg.open;

  if (closed) {
    console.log(`[ORDERING GATE] STORE_CLOSED on ${date}`);
    return {
      ...base,
      accepting: false,
      code: "STORE_CLOSED",
      message: "We are closed today. You can pre-order for another day.",
    };
  }

  // 2) Current time falls inside a slot the admin blocked
  if (BLOCK_NOW_ON_BLOCKED_SLOT) {
    const current = blockedStarts.find(
      (start) => nowMin >= start && nowMin < start + s.slotMinutes
    );

    if (current !== undefined) {
      // join back-to-back blocked slots (e.g. 4-5 PM and 5-6 PM -> until 6 PM)
      let end = current + s.slotMinutes;
      while (blockedStarts.includes(end)) end += s.slotMinutes;

      console.log(
        `[ORDERING GATE] ORDERING_BLOCKED: server time ${base.server_time}, ` +
          `blocked slot ${fmtTime(current)} - ${fmtTime(end)} on ${date}`
      );

      return {
        ...base,
        accepting: false,
        code: "ORDERING_BLOCKED",
        message: `Orders are paused until ${fmtTime(end)}. Please try again then or pre-order for another time.`,
        blocked_from: fmtTime(current),
        reopens_at: fmtTime(end),
      };
    }
  }

  // 3) All remaining slots of today are filled / blocked
  const today = await getTodayDayState();

  if (today.allFull) {
    console.log(`[ORDERING GATE] ALL_SLOTS_FULL on ${date}`);
    return {
      ...base,
      accepting: false,
      code: "ALL_SLOTS_FULL",
      message: "All slots are filled for today. Please pre-order for another day.",
    };
  }

  return { ...base, accepting: true, code: null, message: "" };
};

// GET /api/customer/orders/ordering-status
const orderingStatusHandler = async (req, res) => {
  return success(res, await getOrderingStatus());
};

module.exports = { getOrderingStatus, orderingStatusHandler };