/**
 * Utility helper to standardize product and order item image URLs.
 * Resolves relative backend paths, converts invalid/temporary localhost ports (e.g. :37857, :7070),
 * and provides a high-quality fallback Unsplash image for empty/broken URLs.
 */

const BACKEND_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const DEFAULT_PIZZA_IMAGE = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';

export const formatImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return DEFAULT_PIZZA_IMAGE;
  }

  const trimmed = imageUrl.trim();
  if (!trimmed) return DEFAULT_PIZZA_IMAGE;

  // Handle localhost URLs with temporary or static ports (e.g., 37857, 7070, 5173, etc.)
  if (trimmed.startsWith('http://localhost:') || trimmed.startsWith('https://localhost:') || trimmed.startsWith('http://127.0.0.1:') || trimmed.startsWith('https://127.0.0.1:')) {
    try {
      const urlObj = new URL(trimmed);
      // If port is not 5000 (active backend port), check if it is a valid uploads asset, otherwise fallback to default image
      if (urlObj.port !== '5000') {
        if (urlObj.pathname && urlObj.pathname.startsWith('/uploads/')) {
          return `${BACKEND_BASE}${urlObj.pathname}`;
        }
        return DEFAULT_PIZZA_IMAGE;
      }
      return trimmed;
    } catch (e) {
      return DEFAULT_PIZZA_IMAGE;
    }
  }

  // Handle relative image paths like "/uploads/pizza.jpg" or "uploads/pizza.jpg"
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${BACKEND_BASE}${cleanPath}`;
  }

  // Valid HTTP/HTTPS external image URLs (e.g. Unsplash)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return DEFAULT_PIZZA_IMAGE;
};

/**
 * Generates clean initials from user full name.
 * Example: "Harshita Labba" -> "HL", "Harshi" -> "H", "Pizza Enthusiast" -> "PE"
 */
export const getUserInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
  return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
};

/**
 * Formats user profile photo / avatar URL.
 * Returns null if no custom photo was uploaded so components render clean initials.
 */
export const formatUserAvatarUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return null;
  }
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;

  // Handle base64 Data URLs (e.g. data:image/png;base64,...)
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Handle localhost / backend uploads
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${BACKEND_BASE}${cleanPath}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
};

export default formatImageUrl;
