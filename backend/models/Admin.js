const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, trim: true },
    password_hash: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    last_login_at: { type: Date },
  },
  { timestamps: true }
);

adminSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

adminSchema.pre("save", async function () {
  if (!this.isModified("password_hash")) return;
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
});

module.exports = mongoose.model("Admin", adminSchema);
