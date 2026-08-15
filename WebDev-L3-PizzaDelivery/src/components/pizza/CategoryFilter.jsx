import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const CategoryFilter = ({
  categories = ['All', 'Signature', 'Veggie', 'Meat Lovers', 'Crust Specials'],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pizza name, toppings, truffle, pepperoni..."
            className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded-full pl-11 pr-4 py-3 border border-gray-200 shadow-soft-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white text-gray-800 font-semibold text-xs rounded-xl px-3 py-2 border border-gray-200 shadow-soft-sm focus:outline-none focus:border-brand-orange cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated ⭐</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-charcoal text-white shadow-soft-md scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80 shadow-soft-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
