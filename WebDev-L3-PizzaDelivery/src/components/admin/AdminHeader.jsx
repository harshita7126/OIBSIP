import React, { useState } from 'react';
import { Bell, Power, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';

export const AdminHeader = ({ title = 'Dashboard Overview' }) => {
  const { user, roleConfig, logout } = useAuth();
  const [storeOpen, setStoreOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white font-display tracking-tight flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {roleConfig?.name || user?.roleTitle || 'Admin'}
          </span>
        </h1>
        <p className="text-xs text-slate-400">Live woodfire kitchen control panel</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Store Open/Closed Toggle */}
        <button
          onClick={() => setStoreOpen(!storeOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            storeOpen
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${storeOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          <span>{storeOpen ? 'Store Accepting Orders' : 'Store Paused'}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange animate-ping" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <UserAvatar user={user} size="sm" />
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">
              {user?.name || 'Admin Officer'}
            </span>
            <span className="text-[10px] text-purple-400 font-semibold block">
              {roleConfig?.name || user?.roleTitle || 'Admin'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out of Admin Portal"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </header>
  );
};
