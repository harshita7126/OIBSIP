import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, User, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RazorpayModal } from '../../components/checkout/RazorpayModal';
import { orderService } from '../../services/orderService';

export const CheckoutPage = () => {
  const { cartItems, grandTotal, subtotal, tax, deliveryFee, discountAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [instructions, setInstructions] = useState('Ring doorbell upon arrival');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  if (cartItems.length === 0 && !isRazorpayOpen && !isOrderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">
          Your cart is empty
        </h2>

        <button
          onClick={() => navigate("/menu")}
          className="bg-brand-orange text-white px-6 py-3 rounded-xl"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const handleStartPayment = (e) => {
    e.preventDefault();

    if (!customer.name || !customer.address || !customer.phone) {
      addToast("Please complete all delivery details.", "error");
      return;
    }

    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = async (paymentVerification) => {
    setIsRazorpayOpen(false);

    if (!paymentVerification || !paymentVerification.transactionId) {
      addToast("Payment verification failed. Missing transaction ID.", "error");
      return;
    }

    try {
      console.log("Creating order...");
      const newOrder = await orderService.createOrder({
        customer,
        items: cartItems.map(item => ({
          product: item.id || item._id,
          name: item.name,
          size: item.selectedSize?.name || "Medium",
          price: item.price,
          quantity: item.quantity,
          customizations: item.customizations || []
        })),
        summary: {
          subtotal,
          tax,
          deliveryFee,
          discount: discountAmount,
          total: grandTotal
        },
        totalAmount: grandTotal,
        paymentMethod: "Razorpay",
        paymentStatus: "Paid",
        transactionId: paymentVerification.transactionId,
        razorpayOrderId: paymentVerification.razorpayOrderId,
        payment: {
          method: "Razorpay",
          transactionId: paymentVerification.transactionId,
          razorpayOrderId: paymentVerification.razorpayOrderId,
          status: "Paid"
        }
      });

      console.log("Order created successfully", newOrder);
      addToast("🚀 Order placed successfully! Directing to Live Tracker...", "success");

      const orderId = newOrder.id || newOrder._id;
      setIsOrderSuccess(true);
      navigate(`/track?orderId=${orderId}`);

      setTimeout(() => {
        clearCart();
      }, 500);

    } catch (err) {
      const errMsg = err.response?.data?.message || err.customMessage || err.message || "Failed to create order record.";
      console.error("Order creation failed:", errMsg);
      addToast(errMsg, "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900">Checkout & Address</h1>
        <p className="text-xs text-gray-500">Provide delivery location & complete payment via Razorpay.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Delivery Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft-sm space-y-6">
          <h3 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-orange" />
            <span>Delivery Destination</span>
          </h3>

          <form onSubmit={handleStartPayment} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    required
                    className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    required
                    className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Street Address</label>
              <textarea
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                required
                rows={3}
                className="w-full bg-gray-50 text-sm rounded-xl p-3.5 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Delivery Instructions (Optional)</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Gate code, Leave with receptionist..."
                className="w-full bg-gray-50 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-base shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer pt-2"
            >
              <span>Proceed to Razorpay Modal (₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Basket Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-soft-sm space-y-4">
          <h3 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Items in Order ({cartItems.length})
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between text-xs py-1">
                <div>
                  <span className="font-bold text-gray-900">{item.quantity}x {item.name}</span>
                  <span className="text-gray-400 block">{item.selectedSize?.name}</span>
                </div>
                <span className="font-bold text-gray-800">
                  ₹{(item.price * (item.selectedSize?.multiplier || 1.0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax & Fees</span>
              <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200">
              <span>Payable Amount</span>
              <span className="text-brand-orange font-display text-lg">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={grandTotal}
        customer={customer}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};
