const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Razorpay Order
router.post("/razorpay/create-order", createRazorpayOrder);

// Verify Payment Signature
router.post("/razorpay/verify", verifyPayment);

module.exports = router;