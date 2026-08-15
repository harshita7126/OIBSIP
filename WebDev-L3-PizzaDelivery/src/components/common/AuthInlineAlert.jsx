import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable inline alert component for authentication & form validation errors.
 * Renders directly above submit buttons on auth pages.
 */
export const AuthInlineAlert = ({ message, isDarkMode = false }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl p-3 flex items-start gap-2.5 text-xs font-medium border shadow-sm transition-all ${
        isDarkMode
          ? 'bg-red-950/60 border-red-800/80 text-red-200'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
      role="alert"
    >
      <AlertCircle
        className={`w-4 h-4 shrink-0 mt-0.5 ${
          isDarkMode ? 'text-red-400' : 'text-red-600'
        }`}
      />
      <span className="leading-snug flex-1">{message}</span>
    </motion.div>
  );
};

export default AuthInlineAlert;
