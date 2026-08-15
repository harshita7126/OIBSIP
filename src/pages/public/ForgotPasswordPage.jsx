import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, ArrowLeft, Send } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { AuthInlineAlert } from '../../components/common/AuthInlineAlert';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      addToast('Reset link sent to your inbox!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-soft-lg space-y-6"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-gold flex items-center justify-center shadow-orange-glow">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="font-display text-2xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="text-xs text-gray-500">Enter your email and we'll send password recovery instructions.</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <h3 className="font-bold text-base text-gray-900">Check Your Email</h3>
            <p className="text-xs text-gray-600">
              We sent a password reset link to <span className="font-bold text-gray-900">{email}</span>.
            </p>
            <Link
              to="/login"
              className="inline-block pt-2 text-xs font-bold text-brand-orange hover:underline"
            >
              Back to Login Page
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange transition-all font-medium"
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
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Request...' : 'Send Recovery Link'}</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
