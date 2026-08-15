import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const storageKey = userId ? `cravecrust_cart_${userId}` : 'cravecrust_cart_guest';

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Load user-scoped cart items when storageKey changes (e.g. account switch / login / logout)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setCartItems([]);
    }
  }, [storageKey]);

  // Save cart items to user-scoped key
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems, storageKey]);

  const addToCart = (item) => {
    setCartItems(prev => {
      // Check if identical item (same id & size & customizations string) exists
      const existingIndex = prev.findIndex(i => 
        i.id === item.id && 
        i.selectedSize?.name === item.selectedSize?.name &&
        JSON.stringify(i.customizations || []) === JSON.stringify(item.customizations || [])
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity || 1;
        return updated;
      }

      return [...prev, {
        ...item,
        cartId: `${item.id}_${Date.now()}`,
        quantity: item.quantity || 1
      }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateQuantity = (cartId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'CRAVE20') {
      setAppliedCoupon('CRAVE20');
      setDiscountPercent(0.20);
      return { success: true, message: '20% Crave Discount Applied!' };
    }
    if (cleanCode === 'FIRSTPIZZA') {
      setAppliedCoupon('FIRSTPIZZA');
      setDiscountPercent(0.15);
      return { success: true, message: '15% Welcome Discount Applied!' };
    }
    return { success: false, message: 'Invalid or expired promo code' };
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.price * (item.selectedSize?.multiplier || 1.0);
    return acc + (unitPrice * item.quantity);
  }, 0);

  const discountAmount = subtotal * discountPercent;
  const tax = (subtotal - discountAmount) * 0.08; // 8% sales tax
  const freeDeliveryThreshold = 600;
  const expressDeliveryFee = 49;
  const deliveryFee = subtotal > 0 ? (subtotal >= freeDeliveryThreshold ? 0 : expressDeliveryFee) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + tax + deliveryFee);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        applyCoupon,
        appliedCoupon,
        discountPercent,
        subtotal,
        discountAmount,
        tax,
        deliveryFee,
        freeDeliveryThreshold,
        expressDeliveryFee,
        grandTotal,
        totalItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
