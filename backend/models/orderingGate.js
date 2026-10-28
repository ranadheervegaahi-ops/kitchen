// const { DateTime } = require("luxon");
// const PreorderSettings = require("../models/PreorderSettings");
// const { success } = require("./response");
// const { getTodayDayState } = require("../controllers/preorderSchedule.controller");

// const TZ = "Asia/Kolkata";

// const toMin = (t) => {
//   const [h, m] = String(t).split(":").map(Number);
//   return h * 60 + m;
// };

// // Can customers place a NORMAL (immediate) order right now?
// const getOrderingStatus = async () => {
//   const s = await PreorderSettings.get();
//   const now = DateTime.now().setZone(TZ);
//   const date = now.toISODate();
//   const nowMin = now.hour * 60 + now.minute;
//   const dow = now.weekday % 7; // luxon: Mon=1..Sun=7  ->  0=Sunday..6=Saturday

//   // 1) Day closed (admin "close day" override, or a normally closed weekday)
//   const override = s.dayOverrides.find((o) => o.date === date);
//   const cfg = s.weekly.find((w) => w.day === dow);
//   const closed = override ? override.closed : !cfg || !cfg.open;

//   if (closed) {
//     return {
//       accepting: false,
//       code: "STORE_CLOSED",
//       message: "We are closed today. You can pre-order for another day.",
//     };
//   }

//   // 2) Current time falls inside a slot the admin blocked
//   const blocked = s.blockedSlots.some((b) => {
//     if (b.date !== date) return false;
//     const start = toMin(b.start);
//     return nowMin >= start && nowMin < start + s.slotMinutes;
//   });

//   if (blocked) {
//     return {
//       accepting: false,
//       code: "ORDERING_BLOCKED",
//       message:
//         "Orders are temporarily unavailable. Please try again later or pre-order for another time.",
//     };
//   }

//   // 3) All remaining slots of today are filled / blocked
//   const today = await getTodayDayState();

//   if (today.allFull) {
//     return {
//       accepting: false,
//       code: "ALL_SLOTS_FULL",
//       message: "All slots are filled for today. Please pre-order for another day.",
//     };
//   }

//   return { accepting: true, code: null, message: "" };
// };

// // GET /api/customer/orders/ordering-status
// const orderingStatusHandler = async (req, res) => {
//   return success(res, await getOrderingStatus());
// };

// module.exports = { getOrderingStatus, orderingStatusHandler };