import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Mail, RefreshCw } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { AuthInlineAlert } from '../../components/common/AuthInlineAlert';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleOtpChange = (index, value) => {
    if (error) setError('');

    // Handle single digit input
    const cleanDigit = value.replace(/[^0-9]/g, '');
    if (!cleanDigit && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanDigit ? cleanDigit[cleanDigit.length - 1] : '';
    setOtp(newOtp);

    // Auto-focus next input field if digit entered
    if (cleanDigit && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pastedData.length >= 6) {
      const digits = pastedData.slice(0, 6).split('');
      setOtp(digits);
      const lastInput = document.getElementById('otp-digit-5');
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = email.trim();
    const code = otp.join('');

    if (!targetEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(targetEmail, code);
      setVerified(true);
      addToast('🎉 Email Verified Successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      setError('Please enter your email address to resend the code.');
      return;
    }

    if (cooldown > 0 || resending) return;

    setError('');
    setResending(true);
    try {
      await authService.resendOtp(targetEmail);
      addToast('📬 A new 6-digit verification code has been sent to your email!', 'info');
      setCooldown(60); // 60s cooldown
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-soft-lg space-y-6 text-center"
      >
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-brand-orange mx-auto flex items-center justify-center shadow-orange-glow">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            {verified ? 'Email Verified Successfully' : 'Verify Your Email'}
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {verified
              ? 'Your CraveCrust account is active & ready'
              : 'Enter the 6-digit verification code sent to your email'}
          </p>
        </div>

        {verified ? (
          <div className="space-y-6 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-1 text-left">
              <span className="font-bold block text-sm text-emerald-900">🎉 Email Verified Successfully</span>
              <p className="text-emerald-800 leading-relaxed">
                Thank you for verifying your email address. You may now log in to place orders and manage your profile.
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            {!location.state?.email && (
              <div className="text-left space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@example.com"
                    className="w-full bg-gray-50 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {location.state?.email && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                <span>Code sent to: <strong>{email}</strong></span>
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="text-brand-orange text-xs font-semibold hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}

            {/* Six-Digit Individual OTP Input Boxes */}
            <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-digit-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  placeholder="•"
                  className="w-11 h-13 text-center font-display text-xl font-bold bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-orange focus:bg-white focus:outline-none transition-all shadow-soft-sm text-gray-900"
                />
              ))}
            </div>

            {/* Reusable Inline Error Alert */}
            <AuthInlineAlert message={error} />

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Verifying Code...' : 'Verify Email & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || resending}
                className="font-bold text-brand-orange hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {resending && <RefreshCw className="w-3 h-3 animate-spin inline" />}
                <span>
                  {cooldown > 0 ? `Resend Code in (${cooldown}s)` : 'Resend OTP'}
                </span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
