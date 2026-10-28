
const router = require("express").Router();
const {
  sendCustomerOTP,
  verifyCustomerOTP,
  sendMobileChangeOTP,
  verifyMobileChangeOTP,
} = require("../../controllers/customerAuthController");
const customerAuth = require("../../Middleware/customerAuthMiddleware");

router.post("/send-otp", sendCustomerOTP);
router.post("/verify-otp", verifyCustomerOTP);
router.post("/change-mobile/send-otp", customerAuth, sendMobileChangeOTP);
router.post("/change-mobile/verify-otp", customerAuth, verifyMobileChangeOTP);

module.exports = router;
// const express = require("express");
// const router = express.Router();

// const authCustomer = require("../../Middleware/customerAuthMiddleware");
// const {
//   sendRegisterOTP,
//   verifyRegisterOTP,
//   sendLoginOTP,
//   verifyLoginOTP,
//   sendCustomerOTP,
//   verifyCustomerOTP,
//   sendMobileChangeOTP,
//   verifyMobileChangeOTP,
// } = require("../../controllers/customerAuthController");

// // Register (new customers)
// router.post("/register/send-otp", sendRegisterOTP);
// router.post("/register/verify-otp", verifyRegisterOTP);

// // Login (existing customers)
// router.post("/login/send-otp", sendLoginOTP);
// router.post("/login/verify-otp", verifyLoginOTP);

// // Legacy combined flow (remove once the app uses register/login above)
// router.post("/send-otp", sendCustomerOTP);
// router.post("/verify-otp", verifyCustomerOTP);

// // Logged-in customer: change mobile number
// router.post("/change-mobile/send-otp", authCustomer, sendMobileChangeOTP);
// router.post("/change-mobile/verify-otp", authCustomer, verifyMobileChangeOTP);

// module.exports = router;