
// const crypto = require("crypto");
// const Customer = require("../models/Customer");
// const { success, error } = require("../utils/response");

// // Development-only OTP storage.
// // Server restart ayithe pending OTPs clear avuthayi.
// const otpStore = new Map();

// const OTP_EXPIRY_MS = 5 * 60 * 1000;
// const RESEND_COOLDOWN_MS = 30 * 1000;

// const normalizeMobile = (mobile) => {
//   if (typeof mobile !== "string") return null;

//   const cleaned = mobile.trim().replace(/[\s-]/g, "");
//   const normalized = cleaned.startsWith("+91")
//     ? cleaned.slice(3)
//     : cleaned.startsWith("91") && cleaned.length === 12
//       ? cleaned.slice(2)
//       : cleaned;

//   return /^[6-9]\d{9}$/.test(normalized)
//     ? normalized
//     : null;
// };

// // POST /api/customer/auth/send-otp
// const sendCustomerOTP = async (req, res) => {
//   const mobile = normalizeMobile(req.body.mobile);

//   if (!mobile) {
//     return error(
//       res,
//       "Enter a valid Indian mobile number.",
//       400,
//       "INVALID_MOBILE"
//     );
//   }

//   const existingCustomer = await Customer.findOne({ mobile });

//   if (existingCustomer) {
//     return error(
//       res,
//       "This mobile number is already registered.",
//       409,
//       "CUSTOMER_EXISTS"
//     );
//   }

//   const existingOTP = otpStore.get(mobile);
//   const now = Date.now();

//   if (
//     existingOTP &&
//     now - existingOTP.createdAt < RESEND_COOLDOWN_MS
//   ) {
//     return error(
//       res,
//       "Please wait 30 seconds before requesting another OTP.",
//       429,
//       "OTP_COOLDOWN"
//     );
//   }

//   const otp = crypto.randomInt(1000, 10000).toString();

//   otpStore.set(mobile, {
//     otp,
//     createdAt: now,
//     expiresAt: now + OTP_EXPIRY_MS,
//     attempts: 0,
//   });

//   // Development only: OTP console lo display avuthundi.
//   console.log(`[DEV OTP] Mobile: ${mobile} | OTP: ${otp}`);

//   return success(
//     res,
//     { mobile, expiresIn: 300, resendAfter: 30 },
//     "OTP generated successfully. Check the backend console."
//   );
// };

// // POST /api/customer/auth/verify-otp
// const verifyCustomerOTP = async (req, res) => {
//   const { name, email, address, otp } = req.body;
//   const mobile = normalizeMobile(req.body.mobile);

//   if (!mobile) {
//     return error(res, "Invalid mobile number.", 400, "INVALID_MOBILE");
//   }

//   if (
//     typeof name !== "string" ||
//     !name.trim() ||
//     typeof otp !== "string" ||
//     !/^\d{4}$/.test(otp)
//   ) {
//     return error(
//       res,
//       "Valid name and 4-digit OTP are required.",
//       400,
//       "INVALID_INPUT"
//     );
//   }

//   const record = otpStore.get(mobile);

//   if (!record) {
//     return error(
//       res,
//       "OTP not found. Please request a new OTP.",
//       400,
//       "OTP_NOT_FOUND"
//     );
//   }

//   if (Date.now() > record.expiresAt) {
//     otpStore.delete(mobile);

//     return error(
//       res,
//       "OTP expired. Please request a new OTP.",
//       400,
//       "OTP_EXPIRED"
//     );
//   }

//   if (record.attempts >= 5) {
//     otpStore.delete(mobile);

//     return error(
//       res,
//       "Too many incorrect attempts. Request a new OTP.",
//       429,
//       "OTP_ATTEMPTS_EXCEEDED"
//     );
//   }

//   if (record.otp !== otp) {
//     record.attempts += 1;

//     if (record.attempts >= 5) {
//       otpStore.delete(mobile);
//     }

//     return error(
//       res,
//       "Incorrect OTP.",
//       400,
//       "INVALID_OTP"
//     );
//   }

//   const existingCustomer = await Customer.findOne({ mobile });

//   if (existingCustomer) {
//     otpStore.delete(mobile);

//     return error(
//       res,
//       "This mobile number is already registered.",
//       409,
//       "CUSTOMER_EXISTS"
//     );
//   }

//   const customer = await Customer.create({
//     name: name.trim(),
//     mobile,
//     ...(typeof email === "string" && email.trim()
//       ? { email: email.trim().toLowerCase() }
//       : {}),
//     ...(typeof address === "string" && address.trim()
//       ? { address: address.trim() }
//       : {}),
//   });

//   otpStore.delete(mobile);

//   return success(
//     res,
//     {
//       customer: {
//         _id: customer._id,
//         name: customer.name,
//         mobile: customer.mobile,
//         email: customer.email,
//         address: customer.address,
//       },
//     },
//     "Customer registered successfully.",
//     201
//   );
// };

// module.exports = {
//   sendCustomerOTP,
//   verifyCustomerOTP,
// };

const crypto = require("crypto");
const Customer = require("../models/Customer");
const { success, error } = require("../utils/response");
const generateToken = require("../utils/generateToken");

// Development only: OTPs are stored in memory.
// Restarting the server clears all OTPs.
const otpStore = new Map();

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

const normalizeMobile = (mobile) => {
  return String(mobile || "").replace(/\D/g, "");
};

// POST /api/customer/auth/send-otp
const sendCustomerOTP = async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body.mobile);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return error(res, "Enter a valid 10-digit Indian mobile number", 400);
    }
    const previousOTP = otpStore.get(mobile);
    const now = Date.now();
    if (
      previousOTP &&
      now - previousOTP.createdAt < RESEND_COOLDOWN_MS
    ) {
      const waitSeconds = Math.ceil(
        (RESEND_COOLDOWN_MS - (now - previousOTP.createdAt)) / 1000
      );

      return error(
        res,
        `Please wait ${waitSeconds} seconds before requesting another OTP`,
        429
      );
    }
    const otp = String(crypto.randomInt(1000, 10000));
    otpStore.set(mobile, {
      otp,
      createdAt: now,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
      verified: false,
    });

    // Development only. Never log OTPs in production.
    console.log(`Development OTP for ${mobile}: ${otp}`);

    return success(res, {
      mobile,
      isRegistered: Boolean(await Customer.exists({ mobile })),
      message: "OTP generated successfully",
      expiresIn: 300,
      resendAfter: 30,
    });
  } catch (err) {
    console.error("Send customer OTP error:", err);
    return error(res, "Failed to generate OTP", 500);
  }
};

// POST /api/customer/auth/verify-otp
const verifyCustomerOTP = async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body.mobile);
    const { otp, name, email, gender, address } = req.body;

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return error(res, "Enter a valid 10-digit Indian mobile number", 400);
    }

    if (!/^\d{4}$/.test(String(otp || ""))) {
      return error(res, "Enter a valid 4-digit OTP", 400);
    }

    const otpData = otpStore.get(mobile);

    if (!otpData) {
      return error(res, "Please request an OTP first", 400);
    }

    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(mobile);
      return error(res, "OTP has expired. Please request a new OTP", 400);
    }

    if (otpData.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(mobile);
      return error(res, "Maximum OTP attempts exceeded. Request a new OTP", 429);
    }

    if (otpData.otp !== String(otp)) {
      otpData.attempts += 1;

      if (otpData.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(mobile);
        return error(res, "Maximum OTP attempts exceeded. Request a new OTP", 429);
      }

      return error(
        res,
        `Invalid OTP. ${MAX_ATTEMPTS - otpData.attempts} attempts remaining`,
        400
      );
    }

    let customer = await Customer.findOne({ mobile });
    const isNewCustomer = !customer;

    if (!customer) {
      if (!name || !String(name).trim()) {
        return error(res, "Name is required", 400);
      }

      if (typeof email !== "string" || !email.trim()) {
        return error(res, "Email is required", 400);
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return error(res, "Enter a valid email address", 400);
      }

      if (typeof gender !== "string" || !gender.trim()) {
        return error(res, "Gender is required", 400);
      }

      const existingEmail = await Customer.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return error(res, "This email address is already registered", 409);
      }

      customer = await Customer.create({
        name: String(name).trim(),
        mobile,
        email: normalizedEmail,
        gender: String(gender).trim(),
        ...(typeof address === "string" && address.trim()
          ? { address: address.trim() }
          : {}),
      });
    }

    otpStore.delete(mobile);

    const token = generateToken({
      id: customer._id,
      role: "customer",
    });

    return success(
      res,
      {
        token,
        tokenType: "Bearer",
        customer: {
          id: customer._id,
          name: customer.name,
          mobile: customer.mobile,
          email: customer.email,
          gender: customer.gender,
          address: customer.address,
        },
      },
      isNewCustomer
        ? "OTP verified, customer registered, and login successful"
        : "OTP verified and login successful",
      isNewCustomer ? 201 : 200
    );
  } catch (err) {
    console.error("Verify customer OTP error:", err);

    if (err.code === 11000) {
      return error(res, "Customer already exists", 409);
    }

    return error(res, "Failed to verify OTP", 500);
  }
};

// POST /api/customer/auth/change-mobile/send-otp
const sendMobileChangeOTP = async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body.mobile);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return error(res, "Enter a valid 10-digit Indian mobile number", 400);
    }

    if (mobile === req.customer.mobile) {
      return error(res, "Enter a different mobile number", 400);
    }

    if (await Customer.exists({ mobile })) {
      return error(res, "This mobile number is already registered", 409);
    }

    const key = `mobile-change:${req.customer._id}`;
    const previousOTP = otpStore.get(key);
    const now = Date.now();

    if (previousOTP && now - previousOTP.createdAt < RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil(
        (RESEND_COOLDOWN_MS - (now - previousOTP.createdAt)) / 1000
      );

      return error(
        res,
        `Please wait ${waitSeconds} seconds before requesting another OTP`,
        429
      );
    }

    const otp = String(crypto.randomInt(1000, 10000));

    otpStore.set(key, {
      otp,
      mobile,
      customerId: String(req.customer._id),
      createdAt: now,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
    });

    // Development only. Never log OTPs in production.
    console.log(`Development mobile-change OTP for ${mobile}: ${otp}`);

    return success(res, {
      mobile,
      expiresIn: 300,
      resendAfter: 30,
      message: "OTP generated successfully",
    });
  } catch (err) {
    console.error("Send mobile change OTP error:", err);
    return error(res, "Failed to generate mobile change OTP", 500);
  }
};

// POST /api/customer/auth/change-mobile/verify-otp
const verifyMobileChangeOTP = async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body.mobile);
    const { otp } = req.body;
    const key = `mobile-change:${req.customer._id}`;
    const otpData = otpStore.get(key);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return error(res, "Enter a valid 10-digit Indian mobile number", 400);
    }

    if (!/^\d{4}$/.test(String(otp || ""))) {
      return error(res, "Enter a valid 4-digit OTP", 400);
    }

    if (
      !otpData ||
      otpData.customerId !== String(req.customer._id) ||
      otpData.mobile !== mobile
    ) {
      return error(res, "Please request an OTP for this mobile number first", 400);
    }

    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(key);
      return error(res, "OTP has expired. Please request a new OTP", 400);
    }

    if (otpData.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(key);
      return error(res, "Maximum OTP attempts exceeded. Request a new OTP", 429);
    }

    if (otpData.otp !== String(otp)) {
      otpData.attempts += 1;

      if (otpData.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(key);
        return error(res, "Maximum OTP attempts exceeded. Request a new OTP", 429);
      }

      return error(
        res,
        `Invalid OTP. ${MAX_ATTEMPTS - otpData.attempts} attempts remaining`,
        400
      );
    }

    if (await Customer.exists({ mobile, _id: { $ne: req.customer._id } })) {
      otpStore.delete(key);
      return error(res, "This mobile number is already registered", 409);
    }

    req.customer.mobile = mobile;
    await req.customer.save();
    otpStore.delete(key);

    return success(
      res,
      {
        customer: {
          id: req.customer._id,
          name: req.customer.name,
          mobile: req.customer.mobile,
          email: req.customer.email,
          gender: req.customer.gender,
          address: req.customer.address,
        },
      },
      "Mobile number updated successfully"
    );
  } catch (err) {
    console.error("Verify mobile change OTP error:", err);
    return error(res, "Failed to update mobile number", 500);
  }
};

module.exports = {
  sendCustomerOTP,
  verifyCustomerOTP,
  sendMobileChangeOTP,
  verifyMobileChangeOTP,
};
