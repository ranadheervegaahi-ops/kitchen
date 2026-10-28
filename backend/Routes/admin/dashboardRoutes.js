const router = require("express").Router();
const { getDashboard, getRecentOrders } = require("../../controllers/dashboardController");
const auth = require("../../Middleware/authMiddleware");

router.get("/", auth, getDashboard);
router.get("/recent-orders", auth, getRecentOrders);

module.exports = router;
