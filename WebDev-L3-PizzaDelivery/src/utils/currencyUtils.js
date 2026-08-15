/**
 * Standardized currency formatting utility for CraveCrust.
 * Formats all prices and monetary values in Indian Rupees (₹) using en-IN locale.
 */

export const formatINR = (amount, options = {}) => {
  const num = Number(amount || 0);
  const includeDecimals = options.decimals !== false;
  
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return `₹${formatted}`;
};

export default formatINR;
