const express = require("express");
const router = express.Router();

const authCustomer = require("../../Middleware/customerAuthMiddleware");
const { getMenu, getMenuProduct } = require("../../controllers/customerMenuController");

router.use(authCustomer);

router.get("/", getMenu);
router.get("/:id", getMenuProduct);

module.exports = router;