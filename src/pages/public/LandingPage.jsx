import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Sparkles, ArrowRight, Star, Clock, ShieldCheck, Award, ChefHat, Heart } from 'lucide-react';
import { PizzaCard } from '../../components/pizza/PizzaCard';
import { PizzaModal } from '../../components/pizza/PizzaModal';
import { pizzaService } from '../../services/pizzaService';

export const LandingPage = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPizzaModal, setSelectedPizzaModal] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await pizzaService.getPizzas();
        setFeaturedPizzas(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching landing pizzas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-brand-gold/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-brand-orange/30 text-brand-orange text-xs font-bold shadow-soft-sm">
                <Sparkles className="w-4 h-4 text-brand-gold animate-spin-slow" />
                <span>#1 Gourmet Artisan Pizza Delivery</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Crafted for Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-brand-gold">Craving.</span>
              </h1>

              {/* Tagline & Subtext */}
              <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                72-hour slow-fermented sourdough crusts, hand-crushed Italian San Marzano tomatoes, and 450°C woodfire perfection delivered in 30 minutes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/builder"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-brand-orange text-white font-bold text-base shadow-orange-glow hover:shadow-xl flex items-center justify-center gap-2 transition-all group"
                >
                  <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>Build Your Own Crust</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-800 font-bold text-base shadow-soft-sm hover:shadow-soft-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore Menu</span>
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200/80 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="font-display text-2xl font-extrabold text-gray-900 block">450°C</span>
                  <span className="text-xs text-gray-500 font-medium">Oak Woodfire</span>
                </div>
                <div>
                  <span className="font-display text-2xl font-extrabold text-gray-900 block">72 Hrs</span>
                  <span className="text-xs text-gray-500 font-medium">Dough Ferment</span>
                </div>
                <div>
                  <span className="font-display text-2xl font-extrabold text-gray-900 block">4.95 ★</span>
                  <span className="text-xs text-gray-500 font-medium">10,000+ Reviews</span>
                </div>
              </div>

            </motion.div>

            {/* Right Hero Interactive Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-full bg-gradient-to-tr from-orange-100/60 to-amber-100/40 p-6 shadow-soft-lg flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                  alt="Crafted CraveCrust Pizza"
                  className="w-full h-full object-cover rounded-full shadow-2xl animate-float border-8 border-white"
                />

                {/* Floating Micro Badge 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 right-4 glass-card px-4 py-2.5 rounded-2xl shadow-soft-lg border border-white flex items-center gap-2"
                >
                  <Flame className="w-5 h-5 text-brand-orange animate-pulse" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-900 block">Freshly Baked</span>
                    <span className="text-[10px] text-gray-500">Woodfire Oven #4</span>
                  </div>
                </motion.div>

                {/* Floating Micro Badge 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-2 left-4 glass-card px-4 py-2.5 rounded-2xl shadow-soft-lg border border-white flex items-center gap-2"
                >
                  <Award className="w-5 h-5 text-brand-gold" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-900 block">White Truffle Drizzle</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">100% Organic</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">The Artisanal Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900">
            From Oven to Doorstep in 3 Steps
          </h2>
          <p className="text-sm text-gray-500">
            We don't do frozen dough or generic conveyor belt ovens. Every pie is handcrafted to order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm hover:shadow-soft-md transition-all text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-brand-orange mx-auto flex items-center justify-center font-display font-extrabold text-xl">
              1
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">Craft Your Dough & Crust</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Choose from 72-hr fermented sourdough, triple cheese stuffed rim, or Neapolitan thin crust.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm hover:shadow-soft-md transition-all text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-brand-gold mx-auto flex items-center justify-center font-display font-extrabold text-xl">
              2
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">450°C Woodfire Bake</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Blasted in our volcanic stone oak oven for 90 seconds to achieve leopard-spot crispness.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft-sm hover:shadow-soft-md transition-all text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-display font-extrabold text-xl">
              3
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">Thermal Courier Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dispatched in heated thermal boxes with live driver GPS tracking right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Pizzas Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">Signature Collection</span>
            <h2 className="font-display text-3xl font-extrabold text-gray-900 mt-1">Trending Craves</h2>
          </div>
          <Link
            to="/menu"
            className="px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPizzas.map((pizza) => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              onQuickView={(p) => setSelectedPizzaModal(p)}
            />
          ))}
        </div>
      </section>

      {/* Pizza Builder Teaser CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-charcoal via-slate-900 to-brand-charcoal text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-gray-800">
          <div className="relative z-10 max-w-xl space-y-6">
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 rounded-full border border-amber-800 inline-block">
              Interactive 3D Builder
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
              Design Your Custom Pizza Masterpiece
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pick your crust type, artisanal sauce, organic cheese, and infinite toppings with our live visualizer canvas.
            </p>
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow transition-all"
            >
              <span>Launch Pizza Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 lg:opacity-40 pointer-events-none hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
              alt="Custom Pizza Builder Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pizza Quick View Modal */}
      <PizzaModal
        pizza={selectedPizzaModal}
        isOpen={!!selectedPizzaModal}
        onClose={() => setSelectedPizzaModal(null)}
      />

    </div>
  );
};
