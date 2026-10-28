const AuditLog = require("../models/AuditLog");

const createAudit = async ({ admin_id, action, entity_type, entity_id, old_value, new_value, ip_address }) => {
  try {
    await AuditLog.create({ admin_id, action, entity_type, entity_id, old_value, new_value, ip_address });
  } catch (e) {
    // audit failure must never break main flow
    console.error("Audit log failed:", e.message);
  }
};

module.exports = { createAudit };
