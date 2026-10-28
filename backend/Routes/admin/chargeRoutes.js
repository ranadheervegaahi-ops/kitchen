const router = require("express").Router();
const auth = require("../../Middleware/authMiddleware");
const { getCharges, updateCharges } = require("../../controllers/chargeSettingsController");

router.get("/", auth, getCharges);
router.put("/", auth, updateCharges);

module.exports = router;