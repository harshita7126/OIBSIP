import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { DollarSign, ShoppingBag, Clock, Smile, Flame, CheckCircle2, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsData, ordersData] = await Promise.all([
        adminService.getAnalytics(),
        orderService.getAllOrders().catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
      setError('Unable to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      addToast(`Updated ${orderId} status to "${newStatus}"`, 'success');
      loadDashboard();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

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
        <div className="text-rose-500 font-bold text-lg">Unable to load analytics</div>
        <p className="text-xs text-slate-400">Please verify backend server connection and try again.</p>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold transition-all mx-auto cursor-pointer"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const kpis = analytics?.kpis || {
    totalRevenue: analytics?.revenue?.total || 0,
    revenueGrowth: "+0%",
    activeOrders: analytics?.orders?.active || 0,
    avgDeliveryTime: analytics?.averageDeliveryTime || "22 min",
    satisfactionRate: analytics?.satisfactionRate || "98.6%",
    totalCustomers: analytics?.customers || 0,
  };

  const salesHistoryList = analytics?.revenue?.history || analytics?.salesHistory || [];
  const topPizzasList = analytics?.topSelling || analytics?.topPizzas || [];

  return (
    <div className="space-y-8">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(kpis.totalRevenue || 0).toLocaleString('en-IN')}`}
          change={kpis.revenueGrowth || "+0%"}
          isPositive={true}
          icon={DollarSign}
        />
        <StatCard
          title="Active Orders"
          value={kpis.activeOrders || 0}
          change="+4 in queue"
          isPositive={true}
          icon={ShoppingBag}
        />
        <StatCard
          title="Avg Oven-to-Door Time"
          value={kpis.avgDeliveryTime || "22 min"}
          change="-2.5 min"
          isPositive={true}
          icon={Clock}
        />
        <StatCard
          title="Satisfaction Rate"
          value={kpis.satisfactionRate || "98.6%"}
          change="+0.4%"
          isPositive={true}
          icon={Smile}
        />
      </div>

      {/* Revenue & Top Pizzas Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Chart Mock */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base">Weekly Revenue Velocity</h3>
            <span className="text-xs text-slate-400">Last 7 Days</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
            {salesHistoryList.map((item) => {
              const maxRev = Math.max(...salesHistoryList.map(s => s.revenue || 0), 100);
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
                        ₹{item.revenue}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Seller Distribution */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-white text-base">Top Selling Craves</h3>
          
          <div className="space-y-3">
            {topPizzasList.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                <span>No order sales data yet</span>
              </div>
            ) : (
              topPizzasList.map((p) => (
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

      {/* Real-time Order Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">Live Order Dispatch Queue</h3>
            <p className="text-xs text-slate-400">Change order status to push live tracking updates to customers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Live Status Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">{order.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{order.customer?.name}</div>
                    <div className="text-[10px] text-slate-400">{order.customer?.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">
                    {order.items?.map(i => i.name).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-orange">
                    ₹{(order.totalAmount || order.summary?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.orderStatus || (order.status === 'in_oven' ? 'Woodfire Oven' : order.status === 'preparing' ? 'Preparing' : order.status === 'out_for_delivery' ? 'Out For Delivery' : order.status === 'delivered' ? 'Delivered' : 'Received')}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-slate-800 text-white font-bold text-xs rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="Received">Received</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Woodfire Oven">Woodfire Oven</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
