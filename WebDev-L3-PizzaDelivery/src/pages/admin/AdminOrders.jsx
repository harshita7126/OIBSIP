import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { driverService } from '../../services/driverService';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Eye, RefreshCw, Clock, Bike } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const data = await driverService.getDrivers();
      setDrivers(data);
    } catch (err) {
      console.error('Failed to fetch drivers', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDrivers();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      addToast(`Updated order ${orderId} to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const handleAssignDriver = async (orderId, driverId) => {
    if (!driverId) return;
    try {
      await driverService.assignDriver(orderId, driverId);
      addToast(`Driver assigned to order ${orderId}`, 'success');
      fetchOrders();
      fetchDrivers();
    } catch (err) {
      addToast('Failed to assign driver', 'error');
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Order Management Stream</h2>
          <p className="text-xs text-slate-400">Control active kitchen orders & courier assignments</p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'received', 'preparing', 'in_oven', 'out_for_delivery', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items Count</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status Dispatch Control</th>
                <th className="py-3 px-4">Assigned Courier</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">{order.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{order.customer?.name}</div>
                    <div className="text-[10px] text-slate-400">{order.customer?.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold">{order.items?.length} items</td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ₹{(order.totalAmount || order.summary?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{order.payment?.method}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.orderStatus || (order.status === 'in_oven' ? 'Woodfire Oven' : order.status === 'preparing' ? 'Preparing' : order.status === 'out_for_delivery' ? 'Out For Delivery' : order.status === 'delivered' ? 'Delivered' : 'Received')}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-slate-800 text-white font-bold text-xs rounded-xl px-3 py-1.5 border border-slate-700 cursor-pointer"
                    >
                      <option value="Received">Received</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Woodfire Oven">Woodfire Oven</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    {order.driver ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Bike className="w-3.5 h-3.5" />
                        <span>{order.driver.name}</span>
                      </div>
                    ) : (
                      <select
                        defaultValue=""
                        onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                        className="bg-slate-800 text-amber-400 font-semibold text-xs rounded-xl px-2.5 py-1.5 border border-slate-700 cursor-pointer focus:outline-none focus:border-amber-500"
                      >
                        <option value="" disabled>Assign Driver...</option>
                        {drivers
                          .filter((d) => d.available)
                          .map((d) => (
                            <option key={d._id || d.id} value={d._id || d.id}>
                              {d.name} ({d.vehicle})
                            </option>
                          ))}
                      </select>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrderModal(order)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrderModal}
        onClose={() => setSelectedOrderModal(null)}
        title={`Order Details: ${selectedOrderModal?.id}`}
      >
        <div className="space-y-4 text-xs text-gray-700">
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Customer Address</h4>
            <p>{selectedOrderModal?.customer?.name} ({selectedOrderModal?.customer?.phone})</p>
            <p className="text-gray-500">{selectedOrderModal?.customer?.address}</p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Assigned Driver</h4>
            <p className="font-semibold text-gray-800">
              {selectedOrderModal?.driver ? `${selectedOrderModal.driver.name} (${selectedOrderModal.driver.vehicle})` : 'Unassigned'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Items Summary</h4>
            <div className="space-y-1 bg-gray-50 p-3 rounded-xl">
              {selectedOrderModal?.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between font-medium">
                  <span>{item.quantity}x {item.name} ({item.size})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminOrders;
