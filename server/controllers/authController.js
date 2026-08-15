const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateRandomToken, hashToken } = require("../utils/tokenGenerator");
const { sendVerificationOtpEmail, sendPasswordResetEmail } = require("../utils/emailService");

const JWT_SECRET = process.env.JWT_SECRET;;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

const getRoleTitle = (role) => {
  switch (role) {
    case "owner":
      return "Store Owner";
    case "store_manager":
    case "manager":
      return "Store Manager";
    case "kitchen_staff":
    case "kitchen":
      return "Kitchen Staff";
    case "customer_support":
    case "support":
      return "Customer Support";
    default:
      return "Customer";
  }
};

// ===============================
// Register User (6-Digit OTP Flow)
// ===============================
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log(`[AUTH REGISTER] Request received: ${email}`);

    if (!email || !password) {
      console.error(`[AUTH REGISTER] Registration failed: Email and password are required`);
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      console.log(`[AUTH REGISTER] Existing user check: FOUND (${cleanEmail})`);
      return res.status(400).json({
        message: "User already exists",
      });
    }
    console.log(`[AUTH REGISTER] Existing user check: NOT FOUND`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-Digit Cryptographic Numeric OTP
    const plaintextOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash("sha256").update(plaintextOtp).digest("hex");
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`[AUTH REGISTER] Creating user with 6-digit OTP...`);
    const user = await User.create({
      name: name || "Pizza Enthusiast",
      email: cleanEmail,
      password: hashedPassword,
      phone: phone || "",
      isVerified: false,
      otp: otpHash,
      otpExpires,
    });

    const dbName = mongoose.connection.name;
    const collectionName = User.collection.name;
    console.log(`[AUTH REGISTER] Database Name: ${dbName}`);
    console.log(`[AUTH REGISTER] Collection Name: ${collectionName}`);
    console.log(`[AUTH REGISTER] User created: ${user._id}`);
    console.log(`[AUTH REGISTER] isVerified: ${user.isVerified}`);

    console.log(`[AUTH REGISTER] Sending 6-digit OTP verification email...`);
    sendVerificationOtpEmail({
      email: user.email,
      name: user.name,
      otp: plaintextOtp,
    }).catch((emailErr) => console.warn("[AUTH REGISTER] Email dispatch non-blocking warning:", emailErr.message));

    console.log(`[AUTH REGISTER] Registration response: 201`);
    res.status(201).json({
      message: "Registration successful! Please check your email for the 6-digit verification code.",
      requiresVerification: true,
      email: user.email,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "customer",
        roleTitle: getRoleTitle(user.role || "customer"),
        isVerified: false,
      },
    });
  } catch (error) {
    console.error(`[AUTH REGISTER] Registration response: 500 (${error.message})`);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Verify 6-Digit OTP (POST /api/auth/verify-otp)
// ===============================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email?.toLowerCase().trim();
    const cleanOtp = String(otp || "").trim();

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit verification code are required.",
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User account not found. Please register first.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email address is already verified. You may log in.",
        isVerified: true,
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "No active verification code found. Please request a new code.",
      });
    }

    if (new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please click Resend OTP to receive a new code.",
      });
    }

    // Compute SHA-256 hash of submitted OTP and compare
    const submittedHash = crypto.createHash("sha256").update(cleanOtp).digest("hex");

    if (submittedHash !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check your email and try again.",
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    console.log(`✅ [verifyOtp] Account verified successfully for ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Email Verified Successfully! You may now sign in to your account.",
      isVerified: true,
    });
  } catch (error) {
    console.error("[verifyOtp] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Resend 6-Digit OTP (POST /api/auth/resend-otp)
// ===============================
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "A new 6-digit verification code has been sent if the account exists.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email address is already verified. You may log in.",
        isVerified: true,
      });
    }

    // Generate NEW 6-digit OTP and update expiration to 10 mins
    const plaintextOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash("sha256").update(plaintextOtp).digest("hex");

    user.otp = otpHash;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationOtpEmail({
      email: user.email,
      name: user.name,
      otp: plaintextOtp,
    });

    console.log(`[resendOtp] New OTP generated and dispatched for ${user.email}`);

    res.status(200).json({
      success: true,
      message: "A new 6-digit verification code has been sent to your email address.",
    });
  } catch (error) {
    console.error("[resendOtp] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Legacy token verification route (backward compatibility mapping to verifyOtp if code supplied)
const verifyEmail = async (req, res) => {
  return verifyOtp(req, res);
};

// ===============================
// Login User
// ===============================
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Explicit isVerified === false check for customers (does NOT block undefined, null, or true for legacy/admin users)
    if (user.isVerified === false && (!user.role || user.role === "customer")) {
      return res.status(401).json({
        success: false,
        requiresVerification: true,
        message: "Please verify your email address before logging in. Check your inbox for the verification link.",
      });
    }

    const token = generateToken(user._id);
    const userRole = user.role || role || "customer";

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || "",
        avatar: user.avatar || user.profilePhoto || "",
        profilePhoto: user.avatar || user.profilePhoto || "",
        role: userRole,
        roleTitle: getRoleTitle(userRole),
        isVerified: user.isVerified !== false,
      },
    });
  } catch (error) {
    console.error("[login] Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Request Password Reset Link
// ===============================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your registered email address.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      // Generate raw token and hash it for MongoDB storage
      const rawToken = generateRandomToken();
      const hashedToken = hashToken(rawToken);

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
      await user.save();

      // Send raw token in email link
      sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        token: rawToken,
      }).catch((err) => {
        console.error("[forgotPassword] Reset email dispatch failed:", err.message);
      });

      console.log(`🔑 [forgotPassword] Password reset token generated for ${user.email}`);
    }

    // Always return generic success response to prevent email enumeration
    res.status(200).json({
      success: true,
      message: "If an account with that email address exists, a password reset link has been sent to your inbox.",
    });
  } catch (error) {
    console.error("[forgotPassword] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Reset Password with Token
// ===============================
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, password } = req.body;
    const targetPassword = newPassword || password;

    if (!token || !targetPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    // Compute SHA-256 hash of incoming token to query MongoDB
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(targetPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`✅ [resetPassword] Password reset successful for ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Password reset successful! You may now log in with your new password.",
    });
  } catch (error) {
    console.error("[resetPassword] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Current User
// ===============================
const getCurrentUser = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || "",
      address: req.user.address || "",
      avatar: req.user.avatar || req.user.profilePhoto || "",
      profilePhoto: req.user.avatar || req.user.profilePhoto || "",
      role: req.user.role,
      roleTitle: getRoleTitle(req.user.role),
      isVerified: req.user.isVerified !== false,
    },
  });
};

module.exports = {
  register,
  login,
  verifyOtp,
  resendOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};