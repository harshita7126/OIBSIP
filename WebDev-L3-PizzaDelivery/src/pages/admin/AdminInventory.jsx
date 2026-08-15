import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, Plus, Minus, RefreshCw, Boxes } from 'lucide-react';

export const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchInventory = async () => {
    try {
      const data = await adminService.getInventory();
      setInventory(data);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (id, delta) => {
    try {
      const updated = await adminService.updateStock(id, delta);
      addToast(`Adjusted ${updated.item} stock to ${updated.stock} ${updated.unit}`, 'info');
      fetchInventory();
    } catch (err) {
      addToast('Failed to update stock', 'error');
    }
  };

  const lowStockItems = inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Kitchen Inventory Matrix</h2>
          <p className="text-xs text-slate-400">Track ingredient availability and threshold alerts</p>
        </div>
        <button
          onClick={fetchInventory}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Matrix
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/60 border border-amber-800/80 p-4 rounded-2xl flex items-center gap-3 text-amber-300 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            {lowStockItems.length} ingredient(s) require re-ordering: {lowStockItems.map(i => i.item).join(', ')}.
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ingredient</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Stock Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">{item.item}</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                  <td className="py-3.5 px-4 font-display font-bold text-sm text-slate-200">
                    {item.stock} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${
                      item.status === 'in_stock'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : item.status === 'low_stock'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.supplier}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(item.id, -5)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 5)}
                        className="p-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
