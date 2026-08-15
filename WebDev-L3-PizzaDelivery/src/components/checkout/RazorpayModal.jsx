import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Lock, X, AlertTriangle } from "lucide-react";
import { paymentService } from "../../services/paymentService";
import { loadRazorpayScript } from "../../utils/loadRazorpayScript";

export const RazorpayModal = ({ isOpen, onClose, amount, customer, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      // Load Razorpay script proactively on modal open
      loadRazorpayScript();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunchRazorpay = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay Checkout SDK failed to load. Please check your internet connection.");
      }

      // 2. Create Razorpay order on backend via paymentService
      const orderData = await paymentService.createRazorpayOrder(amount);

      if (!orderData.success || !orderData.orderId) {
        throw new Error(orderData.message || "Failed to initialize Razorpay order.");
      }

      // 3. Configure official Razorpay Checkout options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "CraveCrust Gourmet Kitchen",
        description: "Woodfire Artisanal Pizza Order",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&q=80",
        order_id: orderData.orderId,

        prefill: {
          name: customer?.name || "Pizza Enthusiast",
          email: customer?.email || "customer@cravecrust.com",
          contact: customer?.phone || "9999999999",
        },

        notes: {
          deliveryAddress: customer?.address || "",
        },

        theme: {
          color: "#f97316", // Brand Orange
        },

        // Callback executed upon payment completion on Razorpay window
        handler: async (response) => {
          try {
            setIsProcessing(true);

            // Send razorpay_order_id, razorpay_payment_id, razorpay_signature for HMAC verification
            const verification = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              onPaymentSuccess(verification);
            } else {
              setErrorMessage(verification.message || "Payment verification failed.");
            }
          } catch (verifErr) {
            setErrorMessage(verifErr.message || "HMAC signature verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            console.log("Razorpay Checkout popup closed by user.");
          },
        },
      };

      // 4. Instantiate and open official Razorpay Checkout window
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (failedRes) => {
        setIsProcessing(false);
        setErrorMessage(
          failedRes.error?.description || "Payment failed on Razorpay gateway."
        );
      });

      setIsProcessing(false);
      razorpayInstance.open();
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err.message || "Could not launch Razorpay Payment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Razorpay Launch Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100"
      >
        {/* Razorpay Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
              R
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight flex items-center gap-1.5">
                Razorpay Checkout <ShieldCheck className="w-4 h-4 text-blue-400" />
              </h3>
              <p className="text-xs text-slate-400">CraveCrust Secure Gateway</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Amount Payable</span>
            <span className="font-display text-2xl font-bold text-emerald-400">
              ₹{amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-gray-600 leading-relaxed text-center">
            Clicking below will launch the official <strong className="text-slate-900">Razorpay Test Mode Checkout</strong> window. Supports UPI, Cards, NetBanking, and Wallets.
          </p>

          <button
            type="button"
            onClick={handleLaunchRazorpay}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connecting to Gateway...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Launch Razorpay Gateway</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RazorpayModal;
