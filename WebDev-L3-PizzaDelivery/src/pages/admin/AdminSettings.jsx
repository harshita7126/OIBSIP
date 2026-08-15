import React, { useState } from 'react';
import { Settings, Save, Shield, MapPin, DollarSign, Percent } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: 'CraveCrust Gourmet Kitchen #1',
    deliveryRadiusMiles: 8.5,
    minOrderValue: 15.00,
    salesTaxPercent: 8.0,
    freeDeliveryThreshold: 600.00,
    woodfireTempCelsius: 450
  });

  const { addToast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    addToast('⚙️ Store settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Store Settings & Operating Parameters</h2>
        <p className="text-xs text-slate-400">Configure delivery radius, tax percentages, and store rules</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Store Outlet Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full bg-slate-800 text-sm text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Radius (Miles)</label>
              <input
                type="number"
                step="0.5"
                value={settings.deliveryRadiusMiles}
                onChange={(e) => setSettings({ ...settings, deliveryRadiusMiles: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 text-sm text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Minimum Order Value (₹)</label>
              <input
                type="number"
                step="1"
                value={settings.minOrderValue}
                onChange={(e) => setSettings({ ...settings, minOrderValue: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 text-sm text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Sales Tax (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.salesTaxPercent}
                onChange={(e) => setSettings({ ...settings, salesTaxPercent: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 text-sm text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                step="1"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 text-sm text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Operational Parameters</span>
          </button>
        </form>
      </div>
    </div>
  );
};
