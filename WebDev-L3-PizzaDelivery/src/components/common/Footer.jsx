import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Send, Heart, Shield, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast('🎉 Welcome to the CraveCrust Secret Sauce Club! Check your inbox for ₹50 off coupon.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-gold flex items-center justify-center shadow-orange-glow">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Crave<span className="text-brand-orange">Crust</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Crafted for Every Craving. 72-hour slow-fermented artisan sourdough, imported Italian San Marzano tomatoes, and woodfired to perfection at 450°C.
            </p>

            <div className="flex items-center gap-4 text-gray-400 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
                <Award className="w-4 h-4 text-brand-gold" />
                <span>#1 Artisan Pizza 2026</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>30-Min Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase mb-4">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/menu" className="hover:text-brand-orange transition-colors">
                  Signature Pizzas
                </Link>
              </li>
              <li>
                <Link to="/builder" className="hover:text-brand-orange transition-colors flex items-center gap-1.5">
                  <span>Custom Pizza Builder</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold text-brand-orange bg-orange-950 border border-brand-orange/40 rounded-full">New</span>
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Veggie" className="hover:text-brand-orange transition-colors">
                  Artisanal Veggie Craves
                </Link>
              </li>
              <li>
                <Link to="/menu?category=Meat+Lovers" className="hover:text-brand-orange transition-colors">
                  Smoked Meat Lovers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase mb-4">
              Customer Portal
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/track" className="hover:text-brand-orange transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-brand-orange transition-colors">
                  Order History & Receipts
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-orange transition-colors">
                  My Profile & Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Console</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase mb-4">
              Join the Crave Club
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Subscribe for secret drops, 20% off promo codes, and chef specials.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-gray-800/90 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-brand-orange transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg flex items-center justify-center transition-colors shadow-orange-glow"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 CraveCrust Inc. All rights reserved. Crafted for Every Craving.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
