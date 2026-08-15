import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Eye, Clock, Flame, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatImageUrl } from '../../utils/imageUtils';

export const PizzaCard = ({ pizza, onQuickView }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [selectedSize, setSelectedSize] = useState(pizza.sizes?.[1] || { name: 'Medium (12")', multiplier: 1.0 });
  const [addedAnimation, setAddedAnimation] = useState(false);

  const calculatePrice = () => {
    return (pizza.price * selectedSize.multiplier).toFixed(2);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: pizza._id,
      name: pizza.name,
      image: pizza.image,
      price: pizza.price,
      selectedSize,
      customizations: pizza.ingredients?.slice(0, 3) || []
    });

    setAddedAnimation(true);
    addToast(`Added ${pizza.name} (${selectedSize.name}) to cart!`, 'success');
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group bg-white rounded-3xl p-5 border border-gray-100 shadow-soft-sm hover:shadow-soft-lg transition-all flex flex-col justify-between relative overflow-hidden"
    >
      {/* Popular / New Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {pizza.isPopular && (
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-brand-orange to-amber-500 rounded-full shadow-orange-glow flex items-center gap-1">
            <Flame className="w-3 h-3" /> Popular
          </span>
        )}
        {pizza.isNew && (
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-full border border-emerald-300">
            Chef Special
          </span>
        )}
      </div>

      <div>
        {/* Pizza Image with hover zoom */}
        <div
          onClick={() => onQuickView(pizza)}
          className="relative w-full h-52 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer mb-4"
        >
          <img
            src={formatImageUrl(pizza.image)}
            alt={pizza.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 flex items-center gap-1.5 shadow-lg">
              <Eye className="w-4 h-4 text-brand-orange" /> Quick View
            </span>
          </div>
        </div>

        {/* Rating & Prep Time */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-gray-800 font-bold">{pizza.rating}</span>
            <span className="text-gray-400">({pizza.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{pizza.prepTime}</span>
          </div>
        </div>

        {/* Name & Tagline */}
        <h3
          onClick={() => onQuickView(pizza)}
          className="font-display text-lg font-bold text-gray-900 hover:text-brand-orange transition-colors cursor-pointer line-clamp-1 mb-1"
        >
          {pizza.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {pizza.tagline || pizza.description}
        </p>

        {/* Size Pills */}
        <div className="flex items-center gap-1.5 mb-5 bg-gray-50 p-1 rounded-xl border border-gray-100">
          {pizza.sizes?.map((size, index) => {
            const sizeName =
              typeof size === "string"
                ? size
                : size?.name || "Medium";
              
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(
                    typeof size === "string"
                      ? { name: size, multiplier: 1 }
                      : size
                  );
                }}
          className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
            selectedSize?.name === sizeName
              ? "bg-white text-brand-orange shadow-soft-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {sizeName.split(" ")[0]}
        </button>
      );
    })}
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400 block font-medium">Price</span>
          <span className="font-display text-xl font-bold text-gray-900">
            ₹{calculatePrice()}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-md ${
            addedAnimation
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-orange-glow'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4" /> Added!
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add to Order
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
