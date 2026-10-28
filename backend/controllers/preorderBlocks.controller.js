const PreorderSettings = require("../models/PreorderSettings");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const ok = (res, data) => res.json({ success: true, data });
const bad = (res, message) => res.status(400).json({ success: false, message });

// GET /api/admin/preorder-schedule/blocked            -> all blocked slots
// GET /api/admin/preorder-schedule/blocked?date=...   -> blocked slots of one date
exports.listBlocked = async (req, res) => {
  const { date } = req.query;
  if (date && !DATE_RE.test(date)) return bad(res, "date must be YYYY-MM-DD");

  const s = await PreorderSettings.get();

  const blocked = s.blockedSlots
    .filter((b) => !date || b.date === date)
    .map((b) => ({ date: b.date, start: b.start }))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

  const closedDays = s.dayOverrides.filter((o) => o.closed).map((o) => o.date);

  return ok(res, { blocked, closed_days: closedDays, count: blocked.length });
};

// POST /api/admin/preorder-schedule/unblock-all   { "date": "2026-10-28" }
// Removes every blocked slot of that date (useful after testing).
exports.unblockAll = async (req, res) => {
  const { date } = req.body || {};
  if (!DATE_RE.test(date || "")) return bad(res, "date must be YYYY-MM-DD");

  const s = await PreorderSettings.get();
  const before = s.blockedSlots.length;

  s.blockedSlots = s.blockedSlots.filter((b) => b.date !== date);
  await s.save();

  return ok(res, { date, removed: before - s.blockedSlots.length });
};