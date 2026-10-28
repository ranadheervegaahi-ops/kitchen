const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    action: { type: String, required: true },
    entity_type: { type: String },
    entity_id: { type: String },
    old_value: { type: mongoose.Schema.Types.Mixed },
    new_value: { type: mongoose.Schema.Types.Mixed },
    ip_address: { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ admin_id: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
