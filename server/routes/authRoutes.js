const express = require("express");

const {
  register,
  login,
  verifyOtp,
  resendOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register & Login
router.post("/register", register);
router.post("/login", login);

// 6-Digit OTP Email Verification
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Legacy Email Verification
router.get("/verify-email", verifyEmail);
router.post("/verify-email", verifyEmail);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Current User Profile
router.get("/me", protect, getCurrentUser);

module.exports = router;