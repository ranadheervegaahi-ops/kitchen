const router = require("express").Router();
const { getCustomers, getCustomer, getCustomerOrders } = require("../../controllers/customerController");
const auth = require("../../Middleware/authMiddleware");
router.get("/", auth, getCustomers);
router.get("/:id", auth, getCustomer);
router.get("/:id/orders", auth, getCustomerOrders);
module.exports = router;
// const express = require("express");
// const router = express.Router();

// const authCustomer = require("../../Middleware/customerAuthMiddleware");
// const validate = require("../../Middleware/validationMiddleware");
// const { createCustomerOrderValidator } = require("../../validators/orderValidator");
// const { createMyOrder, getMyOrders, getMyOrder } = require("../../controllers/customerOrderController");
// const { getCustomerSlots } = require("../../controllers/preorderSchedule.controller");

// router.use(authCustomer);

// router.get("/slots", getCustomerSlots); // keep above "/:id"
// router.post("/", createCustomerOrderValidator, validate, createMyOrder);
// router.get("/", getMyOrders);
// router.get("/:id", getMyOrder);

// module.exports = router;