const mongoose = require("mongoose");

const whatsAppMessageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String },
    message: { type: String, required: true },
    direction: { type: String, enum: ["inbound", "outbound"], required: true },
    status: { type: String, default: "received" },
    raw_payload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhatsAppMessage", whatsAppMessageSchema);
