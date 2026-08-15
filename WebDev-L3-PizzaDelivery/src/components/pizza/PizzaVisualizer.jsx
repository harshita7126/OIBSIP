import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const PizzaVisualizer = ({ base, sauce, cheese, veggies, size }) => {
  const sauceColor = sauce?.color || '#DC2626';

  // 12 Natural distribution positions for toppings
  const toppingPositions = [
    { top: '24%', left: '36%', rotate: 12, scale: 1 },
    { top: '28%', left: '62%', rotate: 45, scale: 0.95 },
    { top: '44%', left: '22%', rotate: -20, scale: 1.05 },
    { top: '48%', left: '72%', rotate: 85, scale: 0.9 },
    { top: '66%', left: '38%', rotate: 15, scale: 1 },
    { top: '62%', left: '58%', rotate: -35, scale: 1.1 },
    { top: '36%', left: '46%', rotate: 90, scale: 0.85 },
    { top: '56%', left: '30%', rotate: 10, scale: 1.05 },
    { top: '38%', left: '28%', rotate: -60, scale: 0.95 },
    { top: '72%', left: '50%', rotate: 110, scale: 1 },
    { top: '32%', left: '74%', rotate: -15, scale: 0.9 },
    { top: '50%', left: '48%', rotate: 30, scale: 1.15 }
  ];

  // Render SVG topping icon for each specific veggie
  const renderVeggieShape = (vegId, color) => {
    switch (vegId) {
      case 'veg-1': // Charred Bell Peppers
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
            <path d="M4 12 C 4 6, 12 4, 18 8 C 22 12, 18 20, 12 18 C 8 16, 4 16, 4 12 Z" fill={color || '#EF4444'} stroke="#7F1D1D" strokeWidth="1.5" />
            <path d="M7 11 C 9 8, 14 7, 16 9" fill="none" stroke="#FCA5A5" strokeWidth="1" opacity="0.6" />
          </svg>
        );

      case 'veg-2': // Wild Cremini Mushrooms
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
            <path d="M5 13 C 5 7, 19 7, 19 13 Z" fill={color || '#A16207'} stroke="#451A03" strokeWidth="1.5" />
            <rect x="10" y="12" width="4" height="7" rx="1.5" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
          </svg>
        );

      case 'veg-3': // Pickled Jalapeño Rings
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
            <circle cx="12" cy="12" r="9" fill={color || '#166534'} stroke="#052E16" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4.5" fill="none" stroke="#86EFAC" strokeWidth="2" />
            <circle cx="10" cy="10" r="1" fill="#FEF08A" />
            <circle cx="14" cy="14" r="1" fill="#FEF08A" />
          </svg>
        );

      case 'veg-4': // Kalamata Olives
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
            <ellipse cx="12" cy="12" rx="8" ry="6" fill={color || '#1F2937'} stroke="#000000" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="3.5" ry="2.5" fill="#374151" />
          </svg>
        );

      case 'veg-5': // Caramelized Red Onions
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
            <path d="M4 18 C 4 9, 15 4, 20 12" fill="none" stroke={color || '#831843'} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M6 18 C 6 11, 14 7, 18 13" fill="none" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'veg-6': // Sweet Golden Corn
        return (
          <div className="flex gap-0.5 items-center justify-center p-0.5">
            <div className="w-2.5 h-3 rounded-full bg-amber-400 border border-amber-600 shadow-xs" />
            <div className="w-2.5 h-3 rounded-full bg-yellow-300 border border-amber-600 shadow-xs -mt-1" />
          </div>
        );

      case 'veg-7': // Sun-Dried Tomatoes
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
            <path d="M5 9 Q 12 4, 19 9 Q 17 18, 5 9 Z" fill={color || '#991B1B'} stroke="#450A0A" strokeWidth="1.5" />
            <circle cx="11" cy="10" r="1.5" fill="#FCA5A5" />
          </svg>
        );

      case 'veg-8': // Fresh Baby Spinach
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md">
            <path d="M12 3 C 6 6, 4 15, 12 21 C 20 15, 18 6, 12 3 Z" fill={color || '#15803D'} stroke="#052E16" strokeWidth="1.2" />
            <path d="M12 3 L 12 18" stroke="#86EFAC" strokeWidth="1" />
          </svg>
        );

      default:
        return (
          <div style={{ backgroundColor: color || '#166534' }} className="w-5 h-5 rounded-full border border-white shadow-md" />
        );
    }
  };

  // Crust styling based on base choice
  const getCrustStyles = () => {
    switch (base?.id) {
      case 'base-2': // Neapolitan Thin
        return 'border-[12px] border-amber-800 bg-gradient-to-tr from-amber-800 via-amber-700 to-amber-600';
      case 'base-3': // Stuffed Crust
        return 'border-[22px] border-amber-500 bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-500 shadow-amber-500/30';
      case 'base-4': // Sourdough
        return 'border-[18px] border-amber-900 bg-gradient-to-tr from-amber-900 via-amber-800 to-amber-700';
      case 'base-5': // Cauliflower
        return 'border-[14px] border-amber-600 bg-gradient-to-tr from-yellow-700 via-amber-600 to-amber-500';
      default: // Woodfired Hand-Tossed
        return 'border-[16px] border-amber-700 bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500';
    }
  };

  // Cheese layer colors & melted spot styles
  const getCheeseOverlay = () => {
    if (!cheese) return null;
    switch (cheese.id) {
      case 'cheese-2': // Sharp Cheddar
        return {
          bg: 'bg-gradient-to-tr from-amber-200 via-yellow-300 to-amber-400/90',
          spots: 'bg-amber-400/60'
        };
      case 'cheese-3': // Smoked Gouda
        return {
          bg: 'bg-gradient-to-tr from-amber-100 via-yellow-200 to-amber-300/80',
          spots: 'bg-amber-300/60'
        };
      case 'cheese-4': // Quad Cheese Overload
        return {
          bg: 'bg-gradient-to-tr from-amber-50 via-yellow-200 to-orange-200/90',
          spots: 'bg-amber-400/70'
        };
      case 'cheese-5': // Plant-Based Almond Mozzarella
        return {
          bg: 'bg-gradient-to-tr from-stone-50 via-amber-50 to-yellow-100/90',
          spots: 'bg-amber-200/50'
        };
      default: // Fresh Mozzarella Fior di Latte
        return {
          bg: 'bg-gradient-to-tr from-amber-50 via-yellow-100 to-amber-100/90',
          spots: 'bg-amber-200/60'
        };
    }
  };

  const cheeseStyle = getCheeseOverlay();

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center p-4">
      
      {/* Ambient Outer Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/15 via-brand-gold/15 to-transparent rounded-full blur-3xl" />

      {/* Ceramic Woodfire Plate */}
      <div className="relative w-full h-full rounded-full bg-stone-100 shadow-soft-lg border-8 border-stone-200/90 p-4 flex items-center justify-center">
        
        {/* Animated Crust Layer */}
        <motion.div
          animate={{ scale: size?.multiplier || 1.0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className={`relative w-full h-full rounded-full shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${getCrustStyles()}`}
        >
          {/* Charred Woodfire Spots on Crust */}
          <div className="absolute top-2 left-6 w-3 h-3 rounded-full bg-amber-950/70 blur-[0.5px]" />
          <div className="absolute bottom-4 right-8 w-4 h-2 rounded-full bg-amber-950/60 blur-[0.5px]" />
          <div className="absolute top-1/2 left-2 w-3 h-4 rounded-full bg-amber-950/80 blur-[0.5px]" />

          {/* Sauce Layer */}
          <motion.div
            key={sauce?.id || 'default_sauce'}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={{ duration: 0.35 }}
            style={{ backgroundColor: sauceColor }}
            className="w-[84%] h-[84%] rounded-full shadow-inner border-2 border-amber-900/30 overflow-hidden relative flex items-center justify-center"
          >
            {/* Sauce Herb Texture & Swirls */}
            <div className="absolute inset-0 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-15" />
            <div className="absolute top-3 left-8 w-12 h-6 rounded-full bg-white/10 blur-xs" />

            {/* Cheese Layer */}
            {cheeseStyle && (
              <motion.div
                key={cheese?.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`w-[93%] h-[93%] rounded-full ${cheeseStyle.bg} shadow-soft-xs relative overflow-hidden`}
              >
                {/* Melted Cheese Blobs & Golden Brown Spots */}
                <div className={`absolute top-1/4 left-1/3 w-14 h-14 rounded-full ${cheeseStyle.spots} blur-xs`} />
                <div className={`absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full ${cheeseStyle.spots} blur-xs`} />
                <div className="absolute top-1/2 right-1/3 w-10 h-10 rounded-full bg-amber-500/25 blur-xs" />
              </motion.div>
            )}

            {/* Veggie Toppings Layer */}
            <AnimatePresence>
              {veggies?.map((veg, vIdx) => {
                // Determine how many positions to render based on veggie count
                const countToRender = Math.min(8, toppingPositions.length);
                const positions = toppingPositions.slice(vIdx % 3, (vIdx % 3) + countToRender);

                return (
                  <React.Fragment key={veg.id}>
                    {positions.map((pos, pIdx) => {
                      const uniqueKey = `${veg.id}_${pIdx}`;
                      return (
                        <motion.div
                          key={uniqueKey}
                          initial={{ scale: 0, y: -25, opacity: 0 }}
                          animate={{ scale: pos.scale, y: 0, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ delay: (vIdx * 0.04) + (pIdx * 0.02), type: 'spring', stiffness: 350, damping: 20 }}
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `rotate(${pos.rotate}deg)`
                          }}
                          className="absolute z-20"
                        >
                          {renderVeggieShape(veg.id, veg.color)}
                        </motion.div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

          </motion.div>

        </motion.div>

      </div>

      {/* Floating Badge */}
      <div className="absolute bottom-2 right-2 glass-panel px-3 py-1.5 rounded-full shadow-soft-md border border-white/60 flex items-center gap-1.5 text-xs font-bold text-gray-800 z-30">
        <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
        <span>Live Crave Canvas</span>
      </div>
    </div>
  );
};
