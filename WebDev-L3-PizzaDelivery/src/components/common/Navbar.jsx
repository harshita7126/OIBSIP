import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShoppingBag, User, LogOut, Menu, X, Sparkles, Shield, Compass, ChevronDown, Clock, Settings, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { UserAvatar } from './UserAvatar';
import { formatImageUrl } from '../../utils/imageUtils';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, getDefaultAdminRoute } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/menu', icon: Compass },
    { name: 'Pizza Builder', path: '/builder', icon: Sparkles, badge: 'Interactive' },
    { name: 'Live Tracker', path: '/track', icon: Clock },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-soft-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <RouterLink to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-orange-glow group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-gray-900 group-hover:text-brand-orange transition-colors">
                Crave<span className="text-brand-orange">Crust</span>
              </span>
              <span className="block text-[9px] font-extrabold uppercase text-gray-400 tracking-widest -mt-1">
                Woodfire Artisan
              </span>
            </div>
          </RouterLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <RouterLink
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-brand-orange bg-orange-50/80 shadow-soft-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black uppercase text-amber-700 bg-amber-100 rounded-full border border-amber-300 ml-1">
                      {link.badge}
                    </span>
                  )}
                </RouterLink>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Cart Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-gray-100 hover:bg-gray-200/80 text-gray-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <span className="hidden sm:inline text-sm font-semibold">Cart</span>
              {totalItemCount > 0 && (
                <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-bold text-white bg-brand-orange rounded-full shadow-orange-glow animate-bounce">
                  {totalItemCount}
                </span>
              )}
            </motion.button>

            {/* User Auth Profile / Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <RouterLink
                  to="/admin/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-full transition-all"
                  title="Switch to Admin / Staff Portal"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Portal</span>
                </RouterLink>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200/80 transition-colors cursor-pointer pr-2.5"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="hidden md:inline text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-gray-100 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {isAdmin ? (user.roleTitle || 'Executive Staff') : 'Signed in as'}
                          </p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        <RouterLink
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile & Addresses
                        </RouterLink>

                        <RouterLink
                          to="/history"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          Order History
                        </RouterLink>

                        <RouterLink
                          to="/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </RouterLink>

                        <RouterLink
                          to={isAdmin ? getDefaultAdminRoute() : "/admin/login"}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-700 bg-purple-50/60 hover:bg-purple-100 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          {isAdmin ? "Admin Console" : "Admin Portal Login"}
                        </RouterLink>

                        <div className="border-t border-gray-100 my-1" />

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <RouterLink
                  to="/admin/login"
                  className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-full transition-all flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Portal</span>
                </RouterLink>
                <RouterLink
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors"
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-orange to-brand-orange-hover rounded-full shadow-orange-glow hover:shadow-lg transition-all"
                >
                  Register
                </RouterLink>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl px-4 py-6 space-y-3"
          >
            <RouterLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-semibold text-gray-800 hover:bg-orange-50 hover:text-brand-orange"
            >
              Home
            </RouterLink>
            {navLinks.map((link) => (
              <RouterLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-gray-800 hover:bg-orange-50 hover:text-brand-orange"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-amber-700 bg-amber-100 rounded-full">
                    {link.badge}
                  </span>
                )}
              </RouterLink>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <RouterLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-gray-800 bg-gray-100"
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-brand-orange"
                >
                  Register
                </RouterLink>
                <RouterLink
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-purple-700 bg-purple-50"
                >
                  Admin Portal
                </RouterLink>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
