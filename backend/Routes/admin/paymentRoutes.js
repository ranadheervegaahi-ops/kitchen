const router = require("express").Router();
const { getPayments } = require("../../controllers/paymentController");
const auth = require("../../Middleware/authMiddleware");

router.get("/", auth, getPayments);

module.exports = router;
