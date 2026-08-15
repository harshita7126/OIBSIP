import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Boxes, Pizza, ShoppingBag, Users, BarChart3, Settings, Flame, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const location = useLocation();
  const { user, roleConfig, isRouteAllowed } = useAuth();

  const allMenuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes, badge: 'Stock Alert' },
    { name: 'Product Catalog', path: '/admin/products', icon: Pizza },
    { name: 'Orders Stream', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  // Filter items allowed for active role
  const menuItems = allMenuItems.filter(item => isRouteAllowed(item.path));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800 shrink-0 hidden md:flex">
      <div className="space-y-6">
        
        {/* Admin Brand */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-brand-orange flex items-center justify-center shadow-lg">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-lg tracking-tight">Crave<span className="text-purple-400">Admin</span></h1>
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block -mt-1">
              {roleConfig?.name || user?.roleTitle || 'Executive Portal'}
            </span>
          </div>
        </div>

        {/* Active Role Indicator Card */}
        <div className="mx-1 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Access Role</span>
            <span className="text-xs font-bold text-white truncate block">{roleConfig?.name || user?.roleTitle || 'Admin'}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-extrabold text-amber-400 bg-amber-950 border border-amber-800 rounded-full">
                    Alert
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

      </div>

      {/* Return to Store Customer View */}
      <div className="pt-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-orange" />
          <span>Exit Admin to Storefront</span>
        </NavLink>
      </div>

    </aside>
  );
};
