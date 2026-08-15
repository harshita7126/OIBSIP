import React from 'react';
import { SearchX, ShoppingBag, Sparkles, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No items found',
  description = 'Try adjusting your search query or filters.',
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-soft-sm max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center text-brand-orange mb-4 shadow-orange-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold text-sm rounded-full shadow-orange-glow transition-all"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onActionClick}
            className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold text-sm rounded-full shadow-orange-glow transition-all"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
