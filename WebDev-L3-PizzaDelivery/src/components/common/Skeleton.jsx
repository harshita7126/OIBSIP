import React from 'react';

export const PizzaCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft-sm space-y-4">
    <div className="w-full h-48 rounded-2xl skeleton-shimmer" />
    <div className="space-y-2">
      <div className="h-5 w-3/4 rounded-md skeleton-shimmer" />
      <div className="h-4 w-full rounded-md skeleton-shimmer" />
      <div className="h-4 w-2/3 rounded-md skeleton-shimmer" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="h-6 w-20 rounded-md skeleton-shimmer" />
      <div className="h-10 w-28 rounded-full skeleton-shimmer" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-4"><div className="h-4 w-24 rounded skeleton-shimmer" /></td>
    <td className="py-4 px-4"><div className="h-4 w-32 rounded skeleton-shimmer" /></td>
    <td className="py-4 px-4"><div className="h-4 w-20 rounded skeleton-shimmer" /></td>
    <td className="py-4 px-4"><div className="h-4 w-16 rounded skeleton-shimmer" /></td>
    <td className="py-4 px-4"><div className="h-8 w-24 rounded-full skeleton-shimmer" /></td>
  </tr>
);
