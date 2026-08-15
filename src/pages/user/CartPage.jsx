import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/common/EmptyState';
import { formatImageUrl } from '../../utils/imageUtils';

export const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    applyCoupon,
    discountAmount,
    tax,
    deliveryFee,
    grandTotal
  } = useCart();
  const { addToast } = useToast();
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!coupon) return;
    const res = applyCoupon(coupon);
    if (res.success) {
      addToast(res.message, 'success');
      setCoupon('');
    } else {
      addToast(res.message, 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any artisan pizzas or custom creations yet."
          actionText="Explore Pizza Menu"
          actionLink="/menu"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900">Your Order Summary</h1>
        <p className="text-xs text-gray-500">Review your pizza selections before proceeding to secure payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartId}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={formatImageUrl(item.image)}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-100"
                />
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-gray-900">{item.name}</h3>
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase text-brand-orange bg-orange-50 rounded-full border border-orange-200">
                    {item.selectedSize?.name}
                  </span>
                  {item.customizations?.length > 0 && (
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {item.customizations.join(' • ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    onClick={() => updateQuantity(item.cartId, -1)}
                    className="p-1 hover:text-brand-orange"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartId, 1)}
                    className="p-1 hover:text-brand-orange"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-display font-bold text-base text-gray-900 w-20 text-right">
                  ₹{(item.price * (item.selectedSize?.multiplier || 1.0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Add More Pizzas from Menu
          </Link>
        </div>

        {/* Right Column: Order Checkout Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-soft-md space-y-6">
          <h3 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Payment Summary
          </h3>

          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Promo Code (CRAVE20)"
                className="w-full bg-gray-50 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-gray-200 font-semibold uppercase focus:outline-none focus:border-brand-orange"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
            >
              Apply
            </button>
          </form>

          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Promo Discount ({appliedCoupon})</span>
                <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-bold text-gray-900">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery Fee</span>
              <span className="font-bold text-gray-900">
                {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Grand Total</span>
              <span className="font-display text-xl text-brand-orange">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Proceed to Razorpay Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
};
