const router = require("express").Router();
const {
  getWeek,
  getDay,
  blockSlot,
  unblockSlot,
  setDayClosed,
  getSettings,
  updateSettings,
  getOrder,
  startOrder,
  cancelOrder,
  printKot,
} = require("../../controllers/preorderSchedule.controller");
const auth = require("../../Middleware/authMiddleware");

// Week tabs and day slots
router.get("/week", auth, getWeek);
router.get("/day", auth, getDay);

// Slot and day controls
router.post("/block", auth, blockSlot);
router.post("/unblock", auth, unblockSlot);
router.post("/close-day", auth, setDayClosed);

// Schedule settings (hours, capacity, lead time, Hundi limit)
router.get("/settings", auth, getSettings);
router.put("/settings", auth, updateSettings);

// Booking drawer actions
router.get("/orders/:id", auth, getOrder);
router.post("/orders/:id/start", auth, startOrder);
router.post("/orders/:id/cancel", auth, cancelOrder);
router.post("/orders/:id/kot", auth, printKot);

module.exports = router;