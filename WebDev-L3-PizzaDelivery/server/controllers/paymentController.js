const Razorpay = require("razorpay");
const crypto = require("crypto");

// Helper to validate Razorpay environment variables
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay API keys are not configured in backend environment variables. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env."
    );
  }

  return {
    razorpay: new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    }),
    keyId,
    keySecret,
  };
};

// ===============================
// Create Razorpay Order
// ===============================
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid order amount is required.",
      });
    }

    const { razorpay, keyId } = getRazorpayInstance();

    // Convert amount to smallest currency unit (paise for INR / cents for USD)
    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: currency || "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    console.log(`💳 [Razorpay Order Created]: ID=${order.id}, Amount=${order.amount} ${order.currency}`);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
    });
  } catch (error) {
    console.error("❌ [createRazorpayOrder Error]:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Verify Razorpay Payment Signature
// ===============================
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details (orderId, paymentId, signature) are required.",
      });
    }

    const { keySecret } = getRazorpayInstance();

    // Generate expected HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.warn(`⚠️ [Razorpay Verification Failed]: Signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Verification failed.",
      });
    }

    console.log(`✅ [Razorpay Payment Verified]: PaymentId=${razorpay_payment_id}, OrderId=${razorpay_order_id}`);

    res.status(200).json({
      success: true,
      transactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      status: "Paid",
      method: method || "Razorpay Online Payment",
    });
  } catch (error) {
    console.error("❌ [verifyPayment Error]:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
