const AuditLog = require("../models/AuditLog");
const { success } = require("../utils/response");

// GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
  const { admin_id, action, entity_type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (admin_id) filter.admin_id = admin_id;
  if (action) filter.action = action;
  if (entity_type) filter.entity_type = entity_type;
  const skip = (Number(page) - 1) * Number(limit);
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).populate("admin_id", "name email").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    AuditLog.countDocuments(filter),
  ]);
  return success(res, { logs, total, page: Number(page), limit: Number(limit) });
};

module.exports = { getAuditLogs };
