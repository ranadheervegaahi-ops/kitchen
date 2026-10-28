const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const { success } = require("../utils/response");
const { ORDER_STATUS, PAYMENT_STATUS } = require("../utils/constants");

const SALES_STATUSES = [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.COMPLETED];

const buildDateFilter = (date_from, date_to, date) => {
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }
  const filter = {};
  if (date_from) filter.$gte = new Date(date_from);
  if (date_to) filter.$lte = new Date(date_to);
  return Object.keys(filter).length ? filter : undefined;
};

// GET /api/admin/reports/sales
const getSalesReport = async (req, res) => {
  const { date_from, date_to, date } = req.query;
  const dateFilter = buildDateFilter(date_from, date_to, date);
  const match = { payment_status: PAYMENT_STATUS.SUCCESS };
  if (dateFilter) match.createdAt = dateFilter;

  const [all, completed, confirmed, salesAgg] = await Promise.all([
    Order.countDocuments(dateFilter ? { createdAt: dateFilter } : {}),
    Order.countDocuments({ ...match, status: ORDER_STATUS.COMPLETED }),
    Order.countDocuments({ ...match, status: ORDER_STATUS.CONFIRMED }),
    Order.aggregate([
      { $match: { ...match, status: { $in: SALES_STATUSES } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]),
  ]);

  return success(res, {
    total_orders: all,
    completed_orders: completed,
    confirmed_orders: confirmed,
    sales: salesAgg[0]?.total || 0,
  });
};

// GET /api/admin/reports/product-sales
const getProductSalesReport = async (req, res) => {
  const { date_from, date_to, date } = req.query;
  const dateFilter = buildDateFilter(date_from, date_to, date);

  // Get qualifying order IDs
  const orderFilter = { payment_status: PAYMENT_STATUS.SUCCESS, status: { $in: SALES_STATUSES } };
  if (dateFilter) orderFilter.createdAt = dateFilter;
  const orders = await Order.find(orderFilter).select("_id");
  const orderIds = orders.map((o) => o._id);

  const report = await OrderItem.aggregate([
    { $match: { order_id: { $in: orderIds } } },
    {
      $group: {
        _id: { product_name: "$product_name_snapshot", variant_name: "$variant_name_snapshot" },
        quantity_sold: { $sum: "$quantity" },
        revenue: { $sum: "$subtotal" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  return success(res, report.map((r) => ({
    product: r._id.product_name,
    variant: r._id.variant_name,
    quantity_sold: r.quantity_sold,
    revenue: r.revenue,
  })));
};

module.exports = { getSalesReport, getProductSalesReport };
