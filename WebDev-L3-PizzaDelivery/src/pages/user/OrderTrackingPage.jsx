import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Phone, MapPin, CheckCircle2, ShieldCheck, Download, RefreshCw, Bike, ArrowRight, Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { OrderTimeline } from '../../components/checkout/OrderTimeline';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const OrderTrackingPage = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const orderId = params.id || searchParams.get('orderId') || searchParams.get('id');

  // Single Order Tracking State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Active Orders List State (used when no orderId in URL)
  const [activeOrders, setActiveOrders] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [manualOrderIdInput, setManualOrderIdInput] = useState('');

  // 1. Lifecycle when orderId IS provided -> Fetch single order with polling
  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    setLoading(true);

    const fetchSingleOrder = async (isInitial = false) => {
      try {
        const data = await orderService.getOrderById(orderId);
        if (isMounted) {
          setOrder(data);
          setApiError(null);
        }
      } catch (err) {
        const errorMessage =
          err.customMessage ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load order details.";
        if (isMounted) {
          setApiError(errorMessage);
          setOrder(null);
        }
      } finally {
        if (isMounted && isInitial) {
          setLoading(false);
        }
      }
    };

    fetchSingleOrder(true);

    const interval = setInterval(() => {
      fetchSingleOrder(false);
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  // 2. Lifecycle when NO orderId in URL -> Fetch customer's active orders
  useEffect(() => {
    if (orderId) return;

    let isMounted = true;
    setListLoading(true);

    const fetchActiveOrders = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setActiveOrders([]);
          setListLoading(false);
        }
        return;
      }

      try {
        const userOrders = await orderService.getUserOrders();
        const active = (userOrders || []).filter((o) => {
          const st = String(o.status || o.orderStatus || '').toLowerCase();
          return st !== 'delivered' && st !== 'cancelled';
        });

        if (isMounted) {
          setActiveOrders(active);
        }
      } catch (err) {
        console.error('[OrderTrackingPage] Error loading active orders:', err);
        if (isMounted) {
          setActiveOrders([]);
        }
      } finally {
        if (isMounted) {
          setListLoading(false);
        }
      }
    };

    fetchActiveOrders();
  }, [orderId, isAuthenticated]);

  const handleManualRefresh = async () => {
    if (!orderId) return;
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setApiError(null);
      addToast('Refreshed kitchen feed!', 'info');
    } catch (err) {
      addToast('Failed to refresh order status.', 'error');
    }
  };

  const handleManualSearchSubmit = (e) => {
    e.preventDefault();
    if (!manualOrderIdInput.trim()) return;
    navigate(`/track?orderId=${manualOrderIdInput.trim()}`);
  };

  // Helper for status badge rendering on active order cards
  const getStatusBadge = (statusStr) => {
    const st = String(statusStr || '').toLowerCase();
    if (st === 'received') return { label: 'Received', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (st === 'preparing') return { label: 'Preparing', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (st === 'in_oven' || st === 'woodfire oven') return { label: 'Woodfire Oven', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    if (st === 'out_for_delivery') return { label: 'Out for Delivery', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    return { label: statusStr || 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  // =========================================================================
  // SCENARIO 1: NO ORDER ID IN URL -> ACTIVE ORDERS LANDING PAGE
  // =========================================================================
  if (!orderId) {
    if (listLoading) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin mx-auto" />
          <p className="font-display font-bold text-gray-700">Connecting to Store Telemetry...</p>
        </div>
      );
    }

    // Unauthenticated Visitor State
    if (!isAuthenticated) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-brand-orange text-xs font-bold border border-orange-200">
              <Clock className="w-4 h-4" />
              <span>Live Order Tracker</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900">
              Track Your Pizza Order
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Please sign in to view your live active orders, or enter your Order ID below.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft-md space-y-6 max-w-lg mx-auto">
            <form onSubmit={handleManualSearchSubmit} className="space-y-4">
              <label className="text-xs font-semibold text-gray-700 block">Enter Order ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 6a7c3b68709ec..."
                  value={manualOrderIdInput}
                  onChange={(e) => setManualOrderIdInput(e.target.value)}
                  className="flex-1 bg-gray-50 text-sm rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:border-brand-orange font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-orange-glow transition-all"
                >
                  Track
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center space-y-3">
              <p className="text-xs text-gray-400">Have an account with active orders?</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-charcoal hover:bg-slate-800 text-white font-bold text-xs shadow-soft-sm transition-all"
              >
                Sign In to View Orders <ArrowRight className="w-4 h-4 text-brand-gold" />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Authenticated Customer: NO Active Orders State
    if (activeOrders.length === 0) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center mx-auto shadow-inner border border-orange-100">
            <Clock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">
              No Active Orders
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              You don't have any orders currently cooking in the oven or on the way. Place a custom craving or explore our artisanal menu!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/menu"
              className="px-6 py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-orange-glow flex items-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Menu</span>
            </Link>
            <Link
              to="/history"
              className="px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      );
    }

    // Authenticated Customer: ACTIVE ORDERS LIST
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-brand-orange text-xs font-bold border border-orange-200 mb-2">
              <Clock className="w-4 h-4 animate-pulse-subtle" />
              <span>Live Kitchen Telemetry</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-gray-900">
              Active Orders ({activeOrders.length})
            </h1>
            <p className="text-xs text-gray-500">
              Select an active order below to view real-time kitchen status & driver tracking.
            </p>
          </div>

          <Link
            to="/history"
            className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
          >
            All Past Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeOrders.map((actOrder) => {
            const badge = getStatusBadge(actOrder.orderStatus || actOrder.status);
            const totalAmount = actOrder.summary?.total || actOrder.totalAmount || 0;

            return (
              <motion.div
                key={actOrder.id}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft-sm hover:shadow-soft-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-brand-charcoal bg-gray-100 px-3 py-1 rounded-full">
                      #{actOrder.id.substring(0, 12)}...
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-gray-900">
                      {actOrder.items?.length || 0} {actOrder.items?.length === 1 ? 'Item' : 'Items'}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {actOrder.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>Placed at {actOrder.createdAt ? new Date(actOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                    <span className="font-display font-extrabold text-sm text-gray-900">
                      ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/track?orderId=${actOrder.id}`)}
                  className="w-full py-3 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Track Live Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 2: ORDER ID SUPPLIED IN URL -> DETAILED SINGLE ORDER TRACKING
  // =========================================================================
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin mx-auto" />
        <p className="font-display font-bold text-gray-700">Connecting to Store Telemetry...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          We couldn't find an active order matching ID <span className="font-mono font-bold text-gray-700">{orderId}</span>. Please check your order history or return to active orders.
        </p>
        {apiError && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl max-w-md mx-auto font-mono text-left space-y-1">
            <span className="font-bold block">API Response:</span>
            <span>{apiError}</span>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/track"
            className="px-6 py-3 rounded-full bg-brand-orange text-white font-bold text-xs shadow-orange-glow"
          >
            View Active Orders
          </Link>
          <Link
            to="/menu"
            className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/track"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Active Orders</span>
        </Link>
      </div>

      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-orange bg-orange-50 rounded-full border border-orange-200">
              Order #{order.id}
            </span>
            <span className="text-xs text-gray-400">
              Placed at {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">
            Est. Delivery in <span className="text-brand-orange">{order.estimatedDelivery || "25-35 mins"}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
          </button>

          <button
            onClick={() => addToast('Receipt PDF downloaded!', 'success')}
            className="px-4 py-2.5 rounded-full bg-brand-charcoal text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-brand-gold" /> Tax Receipt
          </button>
        </div>
      </div>

      {/* Main Grid: Stepper Left + Courier & Order Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Status Stepper */}
        <div className="lg:col-span-7 space-y-6">
          <OrderTimeline timeline={order.timeline} currentStatus={order.status} />

          {/* Delivery Address Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft-sm space-y-3">
            <h4 className="font-display text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-orange" /> Delivery Location
            </h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              {order.customer?.address || "Address provided at checkout"}
            </p>
          </div>
        </div>

        {/* Right Column: Driver Info & Itemized Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Driver Card */}
          <div className="bg-gradient-to-tr from-brand-charcoal to-slate-900 text-white p-6 rounded-3xl shadow-soft-md space-y-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Assigned Courier</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                order.driver
                  ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                  : 'text-amber-400 bg-amber-950 border-amber-800'
              }`}>
                {order.driver ? 'On Route' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-orange">
                <Bike className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  {order.driver ? order.driver.name : "Courier Assignment Pending"}
                </h4>
                <p className="text-xs text-slate-400">
                  {order.driver ? order.driver.vehicle : "Driver will be assigned soon"}
                </p>
                {order.driver && (
                  <p className="text-[11px] text-amber-400 font-semibold mt-0.5">Rating ⭐ {order.driver.rating}</p>
                )}
              </div>
            </div>

            {order.driver ? (
              <button
                onClick={() => addToast(`Calling ${order.driver.name} at ${order.driver.phone}...`, 'info')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                <span>Call Courier ({order.driver.phone})</span>
              </button>
            ) : (
              <div className="w-full py-2.5 rounded-xl bg-slate-800/50 text-slate-400 font-medium text-xs text-center border border-slate-800">
                Awaiting kitchen dispatch & courier pairing
              </div>
            )}
          </div>

          {/* Itemized Order Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft-sm space-y-4">
            <h4 className="font-display text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Items ({order.items?.length})
            </h4>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{item.quantity}x {item.name}</span>
                    {item.size && <span className="text-gray-400 block">{item.size}</span>}
                  </div>
                  <span className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{(order.summary?.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Paid</span>
                <span className="text-brand-orange font-display text-lg">₹{(order.summary?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderTrackingPage;
