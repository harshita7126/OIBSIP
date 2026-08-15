import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, PackageCheck, Filter, ChevronRight, MapPin, Receipt } from 'lucide-react';
import { orderService } from '../../services/orderService';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load order history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Active') return ['received', 'preparing', 'in_oven', 'out_for_delivery'].includes(order.status);
    if (statusFilter === 'Delivered') return order.status === 'delivered';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">Your Order History</h1>
          <p className="text-xs text-gray-500">Track status, receipts & view past woodfire creations.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-gray-200 shadow-soft-xs">
          {['All', 'Active', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-brand-charcoal text-white shadow-soft-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-medium">Fetching your order history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-4 shadow-soft-sm">
          <PackageCheck className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-lg text-gray-800">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {statusFilter === 'All' ? "You haven't placed any orders yet." : `No ${statusFilter.toLowerCase()} orders.`}
          </p>
          <Link to="/menu" className="inline-block px-6 py-2.5 rounded-full bg-brand-orange text-white text-xs font-bold shadow-orange-glow">
            Explore Menu & Place Order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft-sm hover:shadow-soft-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-base text-gray-900">{order.id}</span>
                    <span className={`px-3 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-gray-400 block font-medium">Order Total</span>
                    <span className="font-display font-bold text-lg text-gray-900">₹{(order.summary?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <Link
                    to={`/track?orderId=${order.id}`}
                    className="px-4 py-2 rounded-full bg-brand-orange text-white text-xs font-bold shadow-orange-glow hover:bg-brand-orange-hover transition-all flex items-center gap-1.5"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Item Summary</span>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{item.quantity}x {item.name}</span>
                          {item.size && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200/60 font-semibold text-gray-600">{item.size}</span>}
                        </div>
                        {item.customizations?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.customizations.map((cust, cIdx) => (
                              <span
                                key={cIdx}
                                className="px-2 py-0.5 text-[10px] font-medium text-amber-900 bg-amber-50 border border-amber-200/60 rounded-md"
                              >
                                {cust}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 sm:self-center">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
