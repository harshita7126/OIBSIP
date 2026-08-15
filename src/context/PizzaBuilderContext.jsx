import React, { createContext, useContext, useState, useEffect } from 'react';
import { builderService } from '../services/builderService';

const PizzaBuilderContext = createContext();

export const PizzaBuilderProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected Options State
  const [selectedSize, setSelectedSize] = useState({ name: 'Medium (12")', extraPrice: 50 });
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const opts = await builderService.getBuilderOptions();
        setOptions(opts);
        if (opts) {
          if (Array.isArray(opts.bases) && opts.bases.length > 0) {
            const firstAvail = opts.bases.find(b => b.isAvailable !== false) || opts.bases[0];
            setSelectedBase(firstAvail);
          }
          if (Array.isArray(opts.sauces) && opts.sauces.length > 0) {
            const firstAvail = opts.sauces.find(s => s.isAvailable !== false) || opts.sauces[0];
            setSelectedSauce(firstAvail);
          }
          if (Array.isArray(opts.cheeses) && opts.cheeses.length > 0) {
            const firstAvail = opts.cheeses.find(c => c.isAvailable !== false) || opts.cheeses[0];
            setSelectedCheese(firstAvail);
          }
          if (Array.isArray(opts.sizes) && opts.sizes.length > 1) {
            setSelectedSize(opts.sizes[1]); // Default to Medium
          }
        }
      } catch (err) {
        console.error('Failed to load pizza builder options from MongoDB', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const toggleVeggie = (vegItem) => {
    if (vegItem.isAvailable === false) return;
    setSelectedVeggies(prev => {
      const exists = prev.some(v => v.id === vegItem.id);
      if (exists) {
        return prev.filter(v => v.id !== vegItem.id);
      } else {
        return [...prev, vegItem];
      }
    });
  };

  const getPriceBreakdown = () => {
    const basePrice = options?.baseCraftPrice !== undefined ? options.baseCraftPrice : 249;
    const sizeExtra = selectedSize?.extraPrice !== undefined
      ? selectedSize.extraPrice
      : (selectedSize?.name?.includes('Medium') ? 50 : selectedSize?.name?.includes('Large') ? 100 : 0);
    const baseExtra = selectedBase?.price || 0;
    const sauceExtra = selectedSauce?.price || 0;
    const cheeseExtra = selectedCheese?.price || 0;
    const veggiesExtra = selectedVeggies.reduce((sum, v) => sum + (v.price || 0), 0);

    const total = basePrice + sizeExtra + baseExtra + sauceExtra + cheeseExtra + veggiesExtra;

    return {
      basePrice,
      sizeExtra,
      baseExtra,
      sauceExtra,
      cheeseExtra,
      veggiesExtra,
      total
    };
  };

  const calculateTotalPrice = () => {
    return getPriceBreakdown().total;
  };

  const resetBuilder = () => {
    if (options) {
      const firstAvailBase = options.bases?.find(b => b.isAvailable !== false) || options.bases[0];
      const firstAvailSauce = options.sauces?.find(s => s.isAvailable !== false) || options.sauces[0];
      const firstAvailCheese = options.cheeses?.find(c => c.isAvailable !== false) || options.cheeses[0];
      setSelectedBase(firstAvailBase);
      setSelectedSauce(firstAvailSauce);
      setSelectedCheese(firstAvailCheese);
    }
    setSelectedVeggies([]);
    setSelectedSize({ name: 'Medium (12")', extraPrice: 50 });
    setCurrentStep(1);
  };

  return (
    <PizzaBuilderContext.Provider
      value={{
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
      }}
    >
      {children}
    </PizzaBuilderContext.Provider>
  );
};

export const usePizzaBuilder = () => {
  const context = useContext(PizzaBuilderContext);
  if (!context) {
    throw new Error('usePizzaBuilder must be used within a PizzaBuilderProvider');
  }
  return context;
};
