import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, UserCheck, ChefHat, Headphones, Crown, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ADMIN_ROLES } from '../../services/authService';
import { AuthInlineAlert } from '../../components/common/AuthInlineAlert';

export const AdminLoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('owner');
  const [email, setEmail] = useState('owner@cravecrust.com');
  const [password, setPassword] = useState('owner123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const roleOptions = [
    { id: 'owner', name: 'Owner', icon: Crown, desc: 'Full Enterprise Access', email: 'owner@cravecrust.com', password: 'owner123', defaultPath: '/admin' },
    { id: 'manager', name: 'Store Manager', icon: Building2, desc: 'Catalog, Stock & Analytics', email: 'manager@cravecrust.com', password: 'manager123', defaultPath: '/admin' },
    { id: 'kitchen', name: 'Kitchen Staff', icon: ChefHat, desc: 'Live Order Queue & Inventory', email: 'kitchen@cravecrust.com', password: 'kitchen123', defaultPath: '/admin/orders' },
    { id: 'support', name: 'Customer Support', icon: Headphones, desc: 'Orders & Customer CRM', email: 'support@cravecrust.com', password: 'support123', defaultPath: '/admin/orders' },
  ];

  const handleRoleSelect = (roleItem) => {
    if (error) setError('');
    setSelectedRole(roleItem.id);
    setEmail(roleItem.email);
    setPassword(roleItem.password || 'owner123');
  };

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
      const user = await login(email, password, selectedRole);

      const roleName =
        user?.roleTitle ||
        ADMIN_ROLES[selectedRole.toUpperCase()]?.name ||
        user?.role ||
        "Administrator";

      addToast(`🔓 Authenticated as ${roleName}`, "success");

      const roleConfig =
        ADMIN_ROLES[selectedRole.toUpperCase()] ||
        ADMIN_ROLES.OWNER;

      navigate(roleConfig.defaultPath);
    } catch (err) {
      setError(err.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-white space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mx-auto flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-bold">CraveCrust Executive Portal</h2>
          <p className="text-xs text-slate-400">Select role & unlock role-permitted administration dashboard</p>
        </div>

        {/* 4 Role Selector Cards */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
            Select Mock Admin Role:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {roleOptions.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                    {isSelected && <UserCheck className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold block">{r.name}</span>
                    <span className="text-[10px] text-slate-400 block leading-tight">{r.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full bg-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:border-purple-500 focus:outline-none text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full bg-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:border-purple-500 focus:outline-none text-white font-medium"
              />
            </div>
          </div>

          {/* Reusable Dark Mode Inline Error Alert */}
          <AuthInlineAlert message={error} isDarkMode={true} />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
          >
            <span>{loading ? 'Authenticating Role...' : `Unlock Portal as ${roleOptions.find(r => r.id === selectedRole)?.name}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
