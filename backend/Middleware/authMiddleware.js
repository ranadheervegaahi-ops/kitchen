const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { error } = require("../utils/response");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return error(res, "Not authenticated", 401, "UNAUTHORIZED");

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password_hash");
    if (!admin) return error(res, "Admin not found", 401, "UNAUTHORIZED");
    if (admin.status !== "active") return error(res, "Account disabled", 403, "FORBIDDEN");
    req.admin = admin;
    next();
  } catch {
    return error(res, "Invalid or expired token", 401, "UNAUTHORIZED");
  }
};
