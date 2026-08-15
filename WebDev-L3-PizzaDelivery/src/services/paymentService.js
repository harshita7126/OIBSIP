import api from "../api/api";

export const paymentService = {
  // Create Razorpay order on backend
  async createRazorpayOrder(amount, currency = "INR") {
    try {
      const response = await api.post("/payments/razorpay/create-order", {
        amount,
        currency,
      });
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate Razorpay payment order.";
      throw new Error(message);
    }
  },

  // Verify HMAC-SHA256 payment signature on backend
  async verifyPayment(paymentDetails) {
    try {
      const response = await api.post("/payments/razorpay/verify", paymentDetails);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Payment verification failed.";
      throw new Error(message);
    }
  },
};

export default paymentService;