import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl', dark = false }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`relative w-full ${maxWidth} rounded-3xl overflow-hidden z-10 my-8 ${
              dark
                ? 'bg-slate-900 border border-slate-800 text-white shadow-2xl'
                : 'bg-white border border-gray-100 shadow-soft-lg'
            }`}
          >
            {/* Header */}
            {title && (
              <div
                className={`flex items-center justify-between px-6 py-4 border-b ${
                  dark ? 'border-slate-800 bg-slate-900/90' : 'border-gray-100 bg-gray-50/50'
                }`}
              >
                <h3 className={`font-display text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-full transition-colors ${
                    dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
