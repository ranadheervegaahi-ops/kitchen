const router = require("express").Router();
const { register, login, logout, me } = require("../../controllers/adminAuthController");
const auth = require("../../Middleware/authMiddleware");
const validate = require("../../Middleware/validationMiddleware");
const { loginValidator, registerValidator } = require("../../validators/authValidator");

// Public
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", auth, logout);
router.get("/me", auth, me);

module.exports = router;
