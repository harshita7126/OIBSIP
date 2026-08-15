import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { CategoryFilter } from '../../components/pizza/CategoryFilter';
import { PizzaCard } from '../../components/pizza/PizzaCard';
import { PizzaModal } from '../../components/pizza/PizzaModal';
import { PizzaCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { pizzaService } from '../../services/pizzaService';

export const MenuPage = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedPizzaModal, setSelectedPizzaModal] = useState(null);

  useEffect(() => {
    const loadPizzas = async () => {
      setLoading(true);
      try {
        const results = await pizzaService.getPizzas({
          search: searchQuery,
          category: selectedCategory,
          sortBy,
          dietary: selectedDietary
        });
        setPizzas(results);
      } catch (err) {
        console.error('Failed to load pizzas', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadPizzas();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy, selectedDietary]);

  const toggleDietary = (tag) => {
    setSelectedDietary(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-charcoal via-slate-900 to-brand-charcoal rounded-3xl p-8 sm:p-12 text-white shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-800">
        <div className="space-y-3 text-center md:text-left">
          <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange bg-orange-950/80 rounded-full border border-brand-orange/40 inline-block">
            Artisan Woodfired Menu
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Explore Gourmet Craves
          </h1>
          <p className="text-sm text-slate-300 max-w-lg">
            72-hour slow fermented dough, hand-stretched topped with peak seasonal ingredients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleDietary('Vegetarian')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedDietary.includes('Vegetarian')
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🌱 Vegetarian Only
          </button>
          <button
            onClick={() => toggleDietary('Spicy')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedDietary.includes('Spicy')
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🔥 Spicy Craves
          </button>
        </div>
      </div>

      {/* Filter & Category Controls */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Grid or Skeletons or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(n => <PizzaCardSkeleton key={n} />)}
        </div>
      ) : pizzas.length === 0 ? (
        <EmptyState
          title="No pizzas match your craves"
          description={`We couldn't find any pizza matching "${searchQuery}". Try clearing filters.`}
          actionText="Reset All Filters"
          onActionClick={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedDietary([]);
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {pizzas.map(pizza => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              onQuickView={(p) => setSelectedPizzaModal(p)}
            />
          ))}
        </motion.div>
      )}

      {/* Quick View Modal */}
      <PizzaModal
        pizza={selectedPizzaModal}
        isOpen={!!selectedPizzaModal}
        onClose={() => setSelectedPizzaModal(null)}
      />

    </div>
  );
};
