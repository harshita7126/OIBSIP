import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, Award, Mail, Phone } from 'lucide-react';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCust = async () => {
      try {
        const data = await adminService.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to fetch customers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCust();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Customer Directory & LTV</h2>
        <p className="text-xs text-slate-400">View customer lifetime value, order frequency, and VIP status</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Member Status</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{c.email}</td>
                  <td className="py-3.5 px-4 font-bold">{c.ordersCount} orders</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">${c.totalSpent.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${
                      c.status === 'VIP Member'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
