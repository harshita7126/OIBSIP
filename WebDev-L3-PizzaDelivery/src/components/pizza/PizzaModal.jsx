import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Flame, Shield, Check, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatImageUrl } from '../../utils/imageUtils';

export const PizzaModal = ({ pizza, isOpen, onClose }) => {
  if (!pizza) return null;

  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [selectedSize, setSelectedSize] = useState(pizza.sizes?.[1] || { name: 'Medium (12")', multiplier: 1.0 });
  const [quantity, setQuantity] = useState(1);
  const [extraToppings, setExtraToppings] = useState([]);

  const availableExtras = [
    { name: 'Extra Mozzarella', price: 1.50 },
    { name: 'Truffle Oil Drizzle', price: 2.00 },
    { name: 'Crispy Garlic Chips', price: 1.00 },
    { name: 'Hot Honey Drip', price: 1.25 }
  ];

  const toggleExtra = (topping) => {
    setExtraToppings(prev => {
      const exists = prev.some(t => t.name === topping.name);
      return exists ? prev.filter(t => t.name !== topping.name) : [...prev, topping];
    });
  };

  const calculateTotal = () => {
    const sizeBase = pizza.price * selectedSize.multiplier;
    const extrasTotal = extraToppings.reduce((acc, t) => acc + t.price, 0);
    return ((sizeBase + extrasTotal) * quantity).toFixed(2);
  };

  const handleAddToCart = () => {
    addToCart({
      id: pizza.id,
      name: pizza.name,
      image: pizza.image,
      price: pizza.price * selectedSize.multiplier + extraToppings.reduce((acc, t) => acc + t.price, 0),
      selectedSize,
      quantity,
      customizations: [
        ...pizza.ingredients,
        ...extraToppings.map(t => t.name)
      ]
    });
    addToast(`Added ${quantity}x ${pizza.name} to your cart!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Image & Badges */}
        <div className="space-y-4">
          <div className="relative w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-soft-md bg-gray-100">
            <img
              src={formatImageUrl(pizza.image)}
              alt={pizza.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {pizza.dietary?.map((tag) => (
                <span key={tag} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-full border border-emerald-300 shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Rating</span>
              <span className="font-bold text-gray-900 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pizza.rating}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Bake Time</span>
              <span className="font-bold text-gray-900 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-orange" /> {pizza.prepTime}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Calories</span>
              <span className="font-bold text-gray-900 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> {pizza.calories}
              </span>
            </div>
          </div>
        </div>

        {/* Right Details & Configuration */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">{pizza.category} Series</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-1">{pizza.name}</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{pizza.description}</p>
          </div>

          {/* Ingredients tags */}
          <div>
            <span className="text-xs font-semibold text-gray-700 block mb-2">Key Ingredients:</span>
            <div className="flex flex-wrap gap-1.5">
              {pizza.ingredients?.map((ing) => (
                <span key={ing} className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-lg">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <span className="text-xs font-semibold text-gray-700 block mb-2">Select Crust Size:</span>
            <div className="grid grid-cols-3 gap-2">
              {pizza.sizes?.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                    selectedSize.name === size.name
                      ? 'border-brand-orange bg-orange-50/60 text-brand-orange shadow-soft-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div>{size.name.split(' ')[0]}</div>
                  <div className="text-[10px] opacity-75">{size.name.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Chef Extra Toppings */}
          <div>
            <span className="text-xs font-semibold text-gray-700 block mb-2">Chef Extra Drizzle & Toppings:</span>
            <div className="grid grid-cols-2 gap-2">
              {availableExtras.map((extra) => {
                const isSelected = extraToppings.some(t => t.name === extra.name);
                return (
                  <button
                    key={extra.name}
                    onClick={() => toggleExtra(extra)}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                      isSelected
                        ? 'border-brand-orange bg-orange-50 text-brand-orange'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{extra.name}</span>
                    <span className="font-bold">+₹{extra.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Add Button */}
          <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:text-brand-orange shadow-soft-sm transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:text-brand-orange shadow-soft-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₹{calculateTotal()}</span>
            </button>
          </div>

        </div>

      </div>
    </Modal>
  );
};
