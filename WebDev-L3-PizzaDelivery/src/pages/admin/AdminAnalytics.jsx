import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { BarChart3, TrendingUp, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
      setError('Unable to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
        <span className="text-xs font-semibold">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <div>
          <h3 className="font-bold text-white text-base">Unable to load analytics</h3>
          <p className="text-xs text-slate-400 mt-1">Please verify backend server connection and try again.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
        </button>
      </div>
    );
  }

  // Safe data extraction with default empty structures
  const hourlyPeakList = analytics?.hourlyPeak || [];
  const revenueTotal = analytics?.revenue?.total ?? analytics?.kpis?.totalRevenue ?? 0;
  const revenueHistory = analytics?.revenue?.history || analytics?.salesHistory || [];
  const topSellingList = analytics?.topSelling || analytics?.topPizzas || [];
  const customersCount = analytics?.customers ?? analytics?.kpis?.totalCustomers ?? 0;
  const activeOrdersCount = analytics?.orders?.active ?? analytics?.kpis?.activeOrders ?? 0;
  const totalOrdersCount = analytics?.orders?.total ?? 0;

  const hasOrders = totalOrdersCount > 0 || revenueTotal > 0 || customersCount > 0 || hourlyPeakList.some(i => i.orders > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Store Analytics & Peak Hour Traffic</h2>
        <p className="text-xs text-slate-400">Identify kitchen bottlenecks and high-demand ordering hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hourly Peak Bar Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" /> Peak Ordering Hours Heatmap
            </h3>
            <span className="text-xs text-slate-400">Volume by Hour</span>
          </div>

          {!hasOrders || hourlyPeakList.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-1">
              <BarChart3 className="w-8 h-8 opacity-40 text-brand-orange" />
              <span className="font-semibold text-slate-400">No orders yet</span>
              <span className="text-[11px] text-slate-600">No revenue data available until customer orders arrive</span>
            </div>
          ) : (
            <div className="h-56 flex items-end justify-between gap-4 pt-8 pb-2">
              {hourlyPeakList.map((item) => {
                const maxVal = item.max || 1;
                const pct = Math.max(5, Math.min(100, Math.round(((item.orders || 0) / maxVal) * 100)));
                return (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      style={{ height: (item.orders || 0) > 0 ? `${pct}%` : '6px' }}
                      className={`w-full rounded-t-lg transition-all ${
                        (item.orders || 0) > 0
                          ? 'bg-gradient-to-t from-purple-600 via-brand-orange to-brand-gold hover:brightness-125'
                          : 'bg-slate-800'
                      }`}
                      title={`${item.hour}: ${item.orders || 0} orders`}
                    />
                    <span className="text-[11px] font-bold text-slate-400">{item.hour}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer Retention Card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-white">
          <h3 className="font-display font-bold text-base">Key Performance Index</h3>
          
          <div className="space-y-4 text-xs">
            <div className="bg-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-slate-400">Total Customers</span>
              <div className="font-display text-2xl font-bold text-emerald-400">
                {customersCount}
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-slate-400">Total Revenue Generated</span>
              <div className="font-display text-2xl font-bold text-brand-orange">
                ₹{revenueTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-slate-400">Active Kitchen Orders</span>
              <div className="font-display text-2xl font-bold text-amber-400">
                {activeOrdersCount}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Secondary Row: Revenue History & Top Selling Pizzas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales History */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue Velocity
            </h3>
            <span className="text-xs text-slate-400">Last 7 Days</span>
          </div>

          {!hasOrders || revenueHistory.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-1">
              <span className="font-semibold text-slate-400">No sales data available</span>
              <span className="text-[11px] text-slate-600">Weekly revenue graph will update upon checkout</span>
            </div>
          ) : (
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2">
              {revenueHistory.map((item) => {
                const maxRev = Math.max(...revenueHistory.map(s => s.revenue || 0), 100);
                const pct = Math.max(5, Math.min(100, Math.round(((item.revenue || 0) / maxRev) * 100)));
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      style={{ height: (item.revenue || 0) > 0 ? `${pct}%` : '6px' }}
                      className={`w-full rounded-t-lg transition-all relative group ${
                        (item.revenue || 0) > 0 ? 'bg-gradient-to-t from-purple-600 to-brand-orange hover:opacity-80' : 'bg-slate-800'
                      }`}
                    >
                      {(item.revenue || 0) > 0 && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ${item.revenue}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-white text-base">Top Selling Craves</h3>
          
          <div className="space-y-3">
            {!hasOrders || topSellingList.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                <span>No data available yet</span>
              </div>
            ) : (
              topSellingList.map((p) => (
                <div key={p.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 line-clamp-1">{p.name}</span>
                    <span className="text-brand-orange">{p.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${p.percentage}%` }}
                      className="h-full bg-brand-orange rounded-full"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
