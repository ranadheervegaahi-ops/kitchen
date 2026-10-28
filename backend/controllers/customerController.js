const Customer = require("../models/Customer");
const Order = require("../models/Order");
const { success, error } = require("../utils/response");
// GET /api/admin/customers
const getCustomers = async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { mobile: { $regex: search, $options: "i" } }];
  const skip = (Number(page) - 1) * Number(limit);
  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Customer.countDocuments(filter),
  ]);
  // Attach order counts
  const ids = customers.map((c) => c._id);
  const orderCounts = await Order.aggregate([
    { $match: { customer_id: { $in: ids } } },
    { $group: { _id: "$customer_id", count: { $sum: 1 }, last_order: { $max: "$createdAt" } } },
  ]);
  const countMap = {};
  orderCounts.forEach(({ _id, count, last_order }) => (countMap[_id.toString()] = { count, last_order }));
  const data = customers.map((c) => ({
    ...c.toObject(),
    order_count: countMap[c._id.toString()]?.count || 0,
    last_order_at: countMap[c._id.toString()]?.last_order || null,
  }));
  return success(res, { customers: data, total, page: Number(page), limit: Number(limit) });
};
// GET /api/admin/customers/:id
const getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return error(res, "Customer not found.", 404, "NOT_FOUND");
  return success(res, customer);
};
// GET /api/admin/customers/:id/orders
const getCustomerOrders = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find({ customer_id: req.params.id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments({ customer_id: req.params.id }),
  ]);
  return success(res, { orders, total, page: Number(page), limit: Number(limit) });
};

module.exports = { getCustomers, getCustomer, getCustomerOrders };
