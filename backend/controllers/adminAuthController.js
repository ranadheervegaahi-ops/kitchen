const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/response");
const { createAudit } = require("../utils/auditHelper");
const { AUDIT_ACTIONS } = require("../utils/constants");
// POST /api/admin/auth/register
const register = async (req, res) => {
  const { name, email, mobile, password, status } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) return error(res, "An admin with this email already exists.", 409, "DUPLICATE");

  const admin = await Admin.create({
    name: name.trim(),
    email,
    mobile: mobile?.trim(),
    password_hash: password,
    status: status || "active",
  });

  return success(
    res,
    { id: admin._id, name: admin.name, email: admin.email, mobile: admin.mobile, status: admin.status },
    "Admin registered successfully.",
    201
  );
};

// POST /api/admin/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password)))
    return error(res, "Invalid email or password.", 401, "INVALID_CREDENTIALS");
  if (admin.status !== "active")
    return error(res, "Your account is disabled.", 403, "ACCOUNT_DISABLED");

  admin.last_login_at = new Date();
  await admin.save();

  const token = generateToken({ id: admin._id });
  await createAudit({ admin_id: admin._id, action: AUDIT_ACTIONS.LOGIN, ip_address: req.ip });

  return success(res, {
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, mobile: admin.mobile },
  }, "Login successful.");
};

// POST /api/admin/auth/logout
const logout = async (req, res) => {
  await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.LOGOUT, ip_address: req.ip });
  return success(res, {}, "Logged out successfully.");
};

// GET /api/admin/auth/me
const me = async (req, res) => {
  const { _id, name, email, mobile, status, last_login_at } = req.admin;
  return success(res, { id: _id, name, email, mobile, status, last_login_at });
};

module.exports = { register, login, logout, me };
