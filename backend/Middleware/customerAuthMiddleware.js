const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const { error } = require("../utils/response");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Not authenticated", 401, "UNAUTHORIZED");
  }

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role !== "customer") {
      return error(res, "Customer authentication required", 403, "FORBIDDEN");
    }

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return error(res, "Customer not found", 401, "UNAUTHORIZED");
    }

    req.customer = customer;
    req.user = { id: customer._id };
    return next();
  } catch {
    return error(res, "Invalid or expired token", 401, "UNAUTHORIZED");
  }
};
