import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, ShoppingBag, RotateCcw, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePizzaBuilder } from '../../context/PizzaBuilderContext';
import { PizzaVisualizer } from '../../components/pizza/PizzaVisualizer';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const CustomBuilderPage = () => {
  const {
    currentStep,
    setCurrentStep,
    options,
    loading,
    selectedSize,
    setSelectedSize,
    selectedBase,
    setSelectedBase,
    selectedSauce,
    setSelectedSauce,
    selectedCheese,
    setSelectedCheese,
    selectedVeggies,
    toggleVeggie,
    calculateTotalPrice,
    getPriceBreakdown,
    resetBuilder
  } = usePizzaBuilder();

  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  if (loading || !options) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin mx-auto mb-4" />
        <p className="font-display text-lg font-bold text-gray-700">Warming up the Woodfire Oven...</p>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Choose Base', subtitle: 'Crust & Ferment Style' },
    { num: 2, title: 'Choose Sauce', subtitle: 'Artisanal Puree' },
    { num: 3, title: 'Choose Cheese', subtitle: 'Melting Layer' },
    { num: 4, title: 'Select Veggies', subtitle: 'Fresh Farm Toppings' },
  ];

  const breakdown = getPriceBreakdown();

  const handleAddCustomToCart = () => {
    const finalPrice = calculateTotalPrice();
    const customPizzaItem = {
      id: `custom_pizza_${Date.now()}`,
      name: `Custom ${selectedBase?.name.split(' ')[0] || 'Artisan'} Crave`,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      price: finalPrice,
      selectedSize: { ...selectedSize, multiplier: 1.0 },
      quantity: 1,
      customizations: [
        `Base: ${selectedBase?.name}`,
        `Sauce: ${selectedSauce?.name}`,
        `Cheese: ${selectedCheese?.name}`,
        ...selectedVeggies.map(v => v.name)
      ]
    };

    addToCart(customPizzaItem);
    addToast('🎉 Custom Masterpiece added to your cart!', 'success');
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-brand-orange text-xs font-bold border border-brand-orange/30">
          <Sparkles className="w-4 h-4 text-brand-gold animate-spin-slow" />
          <span>Craft Your Own Pizza</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-gray-900">
          Interactive Woodfire Builder
        </h1>
        <p className="text-sm text-gray-500">
          Tailor every layer from dough fermentation to woodfire drizzle.
        </p>
      </div>

      {/* 4-Step Stepper Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-3xl border border-gray-200 shadow-soft-sm">
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isDone = currentStep > step.num;

          return (
            <button
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-brand-charcoal text-white shadow-soft-md scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                  isActive
                    ? 'bg-brand-orange text-white'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isDone ? '✓' : step.num}
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold block leading-snug">{step.title}</span>
                <span className={`text-[10px] block ${isActive ? 'text-slate-300' : 'text-gray-400'}`}>
                  {step.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Layout: Visualizer Canvas Left + Selection Cards Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Pizza Visualizer */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-soft-md space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Preview Canvas</span>
            <button
              onClick={resetBuilder}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <PizzaVisualizer
            base={selectedBase}
            sauce={selectedSauce}
            cheese={selectedCheese}
            veggies={selectedVeggies}
            size={selectedSize}
          />

          {/* Size Selector */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-xs font-semibold text-gray-700 block">Crust Diameter & Size:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Personal (8")', extraPrice: 0 },
                { name: 'Medium (12")', extraPrice: 50 },
                { name: 'Large (16")', extraPrice: 100 }
              ].map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedSize.name === s.name
                      ? 'bg-brand-orange text-white shadow-orange-glow'
                      : 'bg-white text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  {s.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Price Bar */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-brand-orange transition-colors cursor-pointer"
                >
                  <span>Estimated Price</span>
                  {showPriceBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <span className="font-display text-2xl font-bold text-gray-900 block">
                  ₹{breakdown.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button
                onClick={handleAddCustomToCart}
                className="px-6 py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-orange-glow flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Crave</span>
              </button>
            </div>

            {/* Collapsible Price Breakdown */}
            <AnimatePresence>
              {showPriceBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100 text-xs space-y-1.5 text-gray-700"
                >
                  <div className="flex justify-between">
                    <span>Base Craft Pizza (Personal 8")</span>
                    <span>₹{breakdown.basePrice.toFixed(2)}</span>
                  </div>
                  {breakdown.sizeExtra > 0 && (
                    <div className="flex justify-between text-brand-orange">
                      <span>Size Upgrade ({selectedSize?.name.split(' ')[0]})</span>
                      <span>+₹{breakdown.sizeExtra.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.baseExtra > 0 && (
                    <div className="flex justify-between text-brand-orange">
                      <span>Crust ({selectedBase?.name.split(' ')[0]})</span>
                      <span>+₹{breakdown.baseExtra.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.sauceExtra > 0 && (
                    <div className="flex justify-between text-brand-orange">
                      <span>Sauce ({selectedSauce?.name.split(' ')[0]})</span>
                      <span>+₹{breakdown.sauceExtra.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.cheeseExtra > 0 && (
                    <div className="flex justify-between text-brand-orange">
                      <span>Cheese ({selectedCheese?.name.split(' ')[0]})</span>
                      <span>+₹{breakdown.cheeseExtra.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.veggiesExtra > 0 && (
                    <div className="flex justify-between text-brand-orange">
                      <span>Veggies ({selectedVeggies.length} items)</span>
                      <span>+₹{breakdown.veggiesExtra.toFixed(2)}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Column: Step Configurator Options */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft-sm space-y-6">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CHOOSE BASE */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">Step 1: Choose Your Pizza Base</h3>
                  <p className="text-xs text-gray-500">5 Handcrafted Artisan Crust Choices</p>
                </div>

                <div className="space-y-3">
                  {options.bases.map((base) => {
                    const isSelected = selectedBase?.id === base.id;
                    const isAvailable = base.isAvailable !== false;
                    return (
                      <div
                        key={base.id}
                        onClick={() => isAvailable && setSelectedBase(base)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                          !isAvailable
                            ? 'opacity-50 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-brand-orange bg-orange-50/60 shadow-soft-sm cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm ${!isAvailable ? 'line-through text-gray-400' : 'text-gray-900'}`}>{base.name}</h4>
                            {base.tag && (
                              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-amber-700 bg-amber-100 rounded-full">
                                {base.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{base.desc}</p>
                        </div>
                        {isAvailable ? (
                          <span className="font-bold text-sm text-gray-800">
                            {base.price > 0 ? `+₹${base.price.toFixed(2)}` : 'Included'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-rose-700 bg-rose-100 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHOOSE SAUCE */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">Step 2: Choose Artisanal Sauce</h3>
                  <p className="text-xs text-gray-500">Hand-crushed tomatoes & pesto creams</p>
                </div>

                <div className="space-y-3">
                  {options.sauces.map((sauce) => {
                    const isSelected = selectedSauce?.id === sauce.id;
                    const isAvailable = sauce.isAvailable !== false;
                    return (
                      <div
                        key={sauce.id}
                        onClick={() => isAvailable && setSelectedSauce(sauce)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                          !isAvailable
                            ? 'opacity-50 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-brand-orange bg-orange-50/60 shadow-soft-sm cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: sauce.color }}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md shrink-0"
                          />
                          <div>
                            <h4 className={`font-bold text-sm ${!isAvailable ? 'line-through text-gray-400' : 'text-gray-900'}`}>{sauce.name}</h4>
                            <p className="text-xs text-gray-500">{sauce.desc}</p>
                          </div>
                        </div>
                        {isAvailable ? (
                          <span className="font-bold text-sm text-gray-800">
                            {sauce.price > 0 ? `+₹${sauce.price.toFixed(2)}` : 'Included'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-rose-700 bg-rose-100 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CHOOSE CHEESE */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">Step 3: Choose Cheese Layer</h3>
                  <p className="text-xs text-gray-500">Imported Italian & Dairy-Free options</p>
                </div>

                <div className="space-y-3">
                  {options.cheeses.map((cheese) => {
                    const isSelected = selectedCheese?.id === cheese.id;
                    const isAvailable = cheese.isAvailable !== false;
                    return (
                      <div
                        key={cheese.id}
                        onClick={() => isAvailable && setSelectedCheese(cheese)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                          !isAvailable
                            ? 'opacity-50 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-brand-orange bg-orange-50/60 shadow-soft-sm cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div>
                          <h4 className={`font-bold text-sm ${!isAvailable ? 'line-through text-gray-400' : 'text-gray-900'}`}>{cheese.name}</h4>
                          <p className="text-xs text-gray-500">{cheese.desc}</p>
                        </div>
                        {isAvailable ? (
                          <span className="font-bold text-sm text-gray-800">
                            {cheese.price > 0 ? `+₹${cheese.price.toFixed(2)}` : 'Included'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-rose-700 bg-rose-100 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: SELECT VEGETABLES */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">Step 4: Select Organic Vegetables</h3>
                  <p className="text-xs text-gray-500">Pick multiple fresh farm toppings</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.veggies.map((veg) => {
                    const isSelected = selectedVeggies.some(v => v.id === veg.id);
                    const isAvailable = veg.isAvailable !== false;
                    return (
                      <div
                        key={veg.id}
                        onClick={() => isAvailable && toggleVeggie(veg)}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                          !isAvailable
                            ? 'opacity-50 bg-gray-100 border-gray-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-brand-orange bg-orange-50/80 shadow-soft-sm cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            style={{ backgroundColor: veg.color }}
                            className="w-5 h-5 rounded-full border border-white shrink-0 shadow-xs"
                          />
                          <span className={`font-bold text-xs ${!isAvailable ? 'line-through text-gray-400' : 'text-gray-900'}`}>{veg.name}</span>
                        </div>
                        {isAvailable ? (
                          <span className="font-bold text-xs text-brand-orange">+₹{veg.price.toFixed(2)}</span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-rose-700 bg-rose-100 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 font-bold text-xs disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-full bg-brand-charcoal text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-soft-md cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddCustomToCart}
                className="px-6 py-2.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-orange-glow flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Finish & Add to Cart</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
