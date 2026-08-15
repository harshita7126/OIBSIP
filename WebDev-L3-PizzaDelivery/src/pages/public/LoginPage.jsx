import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthInlineAlert } from '../../components/common/AuthInlineAlert';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, getDefaultAdminRoute } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      
      const fromPath = location.state?.from?.pathname;
      if (fromPath) {
        navigate(fromPath);
      } else if (['owner', 'manager', 'kitchen', 'support', 'admin'].includes(user.role)) {
        navigate(getDefaultAdminRoute());
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (type) => {
    if (error) setError('');
    if (type === 'customer') {
      setEmail('harshital7126@gmail.com');
      setPassword('123456789');
    } else {
      setEmail('owner@cravecrust.com');
      setPassword('owner123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-soft-lg space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-gold flex items-center justify-center shadow-orange-glow">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="font-display text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to view profile, track orders & manage settings</p>
        </div>

        {/* Quick Demo Login Presets */}
        <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-100 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange block text-center">
            🚀 Quick Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="py-1.5 px-3 bg-white hover:bg-orange-100/50 rounded-xl text-xs font-semibold text-gray-700 border border-orange-200 transition-colors cursor-pointer"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-xs font-semibold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
            >
              Executive Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="name@example.com"
                className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-orange hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Reusable Inline Error Alert */}
          <AuthInlineAlert message={error} />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register Footer */}
        <div className="text-center pt-2 text-xs text-gray-500">
          Don't have a CraveCrust account?{' '}
          <Link to="/register" className="font-bold text-brand-orange hover:underline">
            Register Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
