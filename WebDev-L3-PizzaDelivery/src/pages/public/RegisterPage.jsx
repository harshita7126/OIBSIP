import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthInlineAlert } from '../../components/common/AuthInlineAlert';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      addToast('🎉 Account registered! Please enter the 6-digit verification code sent to your email.', 'success');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
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
          <h2 className="font-display text-2xl font-bold text-gray-900">
            {registrationSuccess ? 'Verify Email Address' : 'Create Crave Account'}
          </h2>
          <p className="text-xs text-gray-500">
            {registrationSuccess
              ? 'Check your inbox to complete verification'
              : 'Join 10,000+ pizza lovers & unlock Crave Rewards'}
          </p>
        </div>

        {registrationSuccess ? (
          <div className="space-y-5 text-center pt-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-brand-orange mx-auto flex items-center justify-center shadow-orange-glow">
              <Mail className="w-7 h-7" />
            </div>

            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
              Account created for <strong className="text-gray-900">{registrationSuccess.email}</strong>.
            </p>

            {registrationSuccess.previewUrl || registrationSuccess.isTestAccount ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-left text-xs">
                <span className="font-bold text-amber-800 block text-sm">⚠️ Local Test Mode Active (Ethereal Email)</span>
                <p className="text-amber-900/80 leading-relaxed">
                  Real emails are <strong>not</strong> delivered to your personal inbox unless <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">EMAIL_USER</code> & <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">EMAIL_PASS</code> are configured in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">server/.env</code>.
                </p>
                <p className="text-amber-900/90 font-medium">Click below to open your virtual test email and activate your account:</p>
                {registrationSuccess.previewUrl && (
                  <a
                    href={registrationSuccess.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full py-2.5 px-4 bg-brand-orange text-white rounded-xl font-bold text-center hover:bg-brand-orange-hover transition-colors shadow-sm mt-1"
                  >
                    Open Ethereal Test Email ↗
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left text-xs text-emerald-800 space-y-1">
                <span className="font-bold block text-sm">📬 Email Dispatched to Inbox!</span>
                <p>We've sent a verification link to <strong>{registrationSuccess.email}</strong>. Please check your email inbox and spam folder.</p>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block py-3 px-8 rounded-full bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-colors"
              >
                Proceed to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  placeholder="Alex Rivera"
                  className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="alex@example.com"
                  className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 382-9102"
                  className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {!registrationSuccess && (
          <div className="text-center pt-2 text-xs text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-orange hover:underline">
              Sign In Here
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};
