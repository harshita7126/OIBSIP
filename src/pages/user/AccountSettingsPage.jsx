import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, CreditCard, Shield, Sliders, CheckCircle2, Eye, EyeOff, Save, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AccountSettingsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('security');

  // Form States
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirmPass: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    orderSMS: true,
    orderEmail: true,
    promotions: false,
    weeklyOffers: true
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      addToast('New passwords do not match', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswords({ current: '', newPass: '', confirmPass: '' });
      addToast('Password updated securely!', 'success');
    }, 600);
  };

  const handleNotificationSave = () => {
    addToast('Notification preferences saved', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900">Account Settings</h1>
        <p className="text-xs text-gray-500">Manage security settings, notifications & payment preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          {[
            { id: 'security', label: 'Security & Password', icon: KeyRound },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'payment', label: 'Saved Payments', icon: CreditCard },
            { id: 'privacy', label: 'Privacy & Data', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-brand-charcoal text-white shadow-soft-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-orange' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft-sm">
          
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-display text-lg font-bold text-gray-900">Security Credentials</h3>
                <p className="text-xs text-gray-500">Update password & enable two-factor authentication</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Current Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    required
                    className="w-full bg-gray-50 text-sm rounded-xl p-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">New Password</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      required
                      className="w-full bg-gray-50 text-sm rounded-xl p-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Confirm New Password</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={passwords.confirmPass}
                      onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                      required
                      className="w-full bg-gray-50 text-sm rounded-xl p-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1.5"
                  >
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPass ? 'Hide passwords' : 'Show passwords'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-full bg-brand-orange text-white text-xs font-bold shadow-orange-glow flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-display text-lg font-bold text-gray-900">Notification Alerts</h3>
                <p className="text-xs text-gray-500">Control order status updates & promotional alerts</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'orderSMS', title: 'SMS Order Tracking Updates', desc: 'Real-time text alerts when driver approaches' },
                  { key: 'orderEmail', title: 'Email Receipts & Confirmations', desc: 'Detailed order receipts sent to your inbox' },
                  { key: 'weeklyOffers', title: 'Weekly Gourmet Specials', desc: 'Exclusive discount codes and secret menu alerts' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                      <p className="text-[11px] text-gray-500">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-brand-orange rounded cursor-pointer"
                    />
                  </div>
                ))}

                <button
                  onClick={handleNotificationSave}
                  className="px-6 py-2.5 rounded-full bg-brand-orange text-white text-xs font-bold shadow-orange-glow flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'payment' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-display text-lg font-bold text-gray-900">Saved Payment Methods</h3>
                <p className="text-xs text-gray-500">Manage mock cards for quick checkout</p>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-brand-orange uppercase block">Mock Visa Premium</span>
                  <span className="font-mono text-sm tracking-wider">•••• •••• •••• 4242</span>
                  <span className="text-[10px] text-gray-400 block">Expires 12/28</span>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  Default Card
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-display text-lg font-bold text-gray-900">Privacy & Data Governance</h3>
                <p className="text-xs text-gray-500">Your privacy controls & session logs</p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
                <span className="text-xs font-bold text-brand-orange block">🔒 Bank-Grade Encryption Simulated</span>
                <p className="text-xs text-gray-600">
                  CraveCrust stores user sessions securely using local token simulation. All API calls are mapped to clean service functions.
                </p>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
