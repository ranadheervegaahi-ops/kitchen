const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { success } = require("../utils/response");
const { ORDER_STATUS, PAYMENT_STATUS } = require("../utils/constants");

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [counts, salesAgg] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd },
          status: { $in: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.COMPLETED] },
          payment_status: PAYMENT_STATUS.SUCCESS,
        },
      },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]),
  ]);

  const countMap = {};
  counts.forEach(({ _id, count }) => (countMap[_id] = count));

  return success(res, {
    today_orders: Object.values(countMap).reduce((a, b) => a + b, 0),
    confirmed: countMap[ORDER_STATUS.CONFIRMED] || 0,
    pending_payment: countMap[ORDER_STATUS.PAYMENT_PENDING] || 0,
    processing: countMap[ORDER_STATUS.PROCESSING] || 0,
    completed: countMap[ORDER_STATUS.COMPLETED] || 0,
    cancelled: countMap[ORDER_STATUS.CANCELLED] || 0,
    pre_orders: await Order.countDocuments({ order_type: "PRE_ORDER", createdAt: { $gte: todayStart, $lte: todayEnd } }),
    today_sales: salesAgg[0]?.total || 0,
  });
};

// GET /api/admin/dashboard/recent-orders
const getRecentOrders = async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("customer_id", "name mobile");
  return success(res, orders);
};

module.exports = { getDashboard, getRecentOrders };
