// const router = require("express").Router();
// const { getOrders, getOrder, updateOrderStatus, getOrderPayment } = require("../../controllers/orderController");
// const auth = require("../../Middleware/authMiddleware");
// const validate = require("../../Middleware/validationMiddleware");
// const { orderStatusValidator } = require("../../validators/orderValidator");
// router.get("/", auth, getOrders);
// router.get("/:id", auth, getOrder);
// router.patch("/:id/status", auth, orderStatusValidator, validate, updateOrderStatus);
// router.get("/:id/payment", auth, getOrderPayment);
// module.exports = router;
const router = require("express").Router();
const { getOrders, getOrder, createOrder, updateOrderStatus, getOrderPayment } = require("../../controllers/orderController");
const auth = require("../../Middleware/authMiddleware");
const validate = require("../../Middleware/validationMiddleware");
const { orderStatusValidator, createOrderValidator } = require("../../validators/orderValidator");

router.get("/", auth, getOrders);
router.post("/", auth, createOrderValidator, validate, createOrder);
router.get("/:id", auth, getOrder);
router.patch("/:id/status", auth, orderStatusValidator, validate, updateOrderStatus);
router.get("/:id/payment", auth, getOrderPayment);

module.exports = router;