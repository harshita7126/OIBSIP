import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'orange' }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl bg-slate-800 text-${color}-400 border border-slate-700`}>
          <Icon className="w-5 h-5 text-brand-orange" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight">{value}</h3>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
            isPositive ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800' : 'text-rose-400 bg-rose-950/60 border border-rose-800'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
