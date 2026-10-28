const router = require("express").Router();
const { getBusinessSettings, updateBusinessSettings, getOrderSettings, updateOrderSettings, getBusinessHours, updateBusinessHours } = require("../../controllers/settingsController");
const auth = require("../../Middleware/authMiddleware");
const validate = require("../../Middleware/validationMiddleware");
const { businessSettingsValidator, orderSettingsValidator, businessHoursValidator } = require("../../validators/settingsValidator");

router.get("/business", auth, getBusinessSettings);
router.put("/business", auth, businessSettingsValidator, validate, updateBusinessSettings);
router.get("/order", auth, getOrderSettings);
router.put("/order", auth, orderSettingsValidator, validate, updateOrderSettings);
router.get("/hours", auth, getBusinessHours);
router.put("/hours", auth, businessHoursValidator, validate, updateBusinessHours);

module.exports = router;
