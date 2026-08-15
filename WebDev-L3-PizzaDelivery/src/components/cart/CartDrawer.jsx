import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatImageUrl } from '../../utils/imageUtils';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    applyCoupon,
    discountAmount,
    tax,
    deliveryFee,
    freeDeliveryThreshold = 600,
    grandTotal
  } = useCart();
  const { addToast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      addToast(res.message, 'success');
      setCouponInput('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-gray-100"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-gray-900">Your Cart</h3>
                <p className="text-xs text-gray-400">{cartItems.length} items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Banner */}
          <div className="px-6 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 text-xs">
            {subtotal >= freeDeliveryThreshold ? (
              <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" /> You unlocked FREE Express Delivery! 🚀
              </p>
            ) : (
              <div>
                <p className="font-semibold text-gray-700 mb-1">
                  Add <span className="text-brand-orange font-bold">₹{amountNeeded.toFixed(2)}</span> more for Free Delivery
                </p>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressToFreeDelivery}%` }}
                    className="h-full bg-gradient-to-r from-brand-orange to-brand-gold transition-all duration-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-display text-base font-bold text-gray-800">Your cart is empty</h4>
                <p className="text-xs text-gray-400 mt-1 mb-6 max-w-xs">
                  Discover our chef signature pizzas or build your custom woodfired pie.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/menu');
                  }}
                  className="px-6 py-2.5 rounded-full bg-brand-orange text-white text-xs font-bold shadow-orange-glow"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 relative group"
                >
                  <img
                    src={formatImageUrl(item.image)}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-brand-orange font-semibold">{item.selectedSize?.name}</p>
                      {item.customizations?.length > 0 && (
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                          {item.customizations.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display font-bold text-sm text-gray-900">
                        ₹{(item.price * (item.selectedSize?.multiplier || 1.0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>

                      <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-soft-sm">
                        <button
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="text-gray-500 hover:text-brand-orange p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="text-gray-500 hover:text-brand-orange p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/80 space-y-4">
              
              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo Code (Try CRAVE20)"
                    className="w-full bg-white text-xs rounded-xl pl-9 pr-3 py-2 border border-gray-200 focus:outline-none focus:border-brand-orange uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Sales Tax (8%)</span>
                  <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-brand-orange font-display text-lg">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold text-xs transition-colors"
                >
                  View Full Cart Details
                </button>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
