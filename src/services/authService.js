import api, { TOKEN_KEY, USER_KEY } from '../api/api';
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser as apiGetCurrentUser,
  clearAuthSession
} from '../api/authService';

export const ADMIN_ROLES = {
  OWNER: { id: 'owner', name: 'Store Owner', defaultPath: '/admin', allowedPaths: ['/admin', '/admin/inventory', '/admin/products', '/admin/orders', '/admin/customers', '/admin/analytics', '/admin/settings'] },
  MANAGER: { id: 'manager', name: 'Store Manager', defaultPath: '/admin', allowedPaths: ['/admin', '/admin/inventory', '/admin/products', '/admin/orders', '/admin/customers', '/admin/analytics'] },
  KITCHEN: { id: 'kitchen', name: 'Kitchen Staff', defaultPath: '/admin/orders', allowedPaths: ['/admin/orders', '/admin/inventory'] },
  SUPPORT: { id: 'support', name: 'Customer Support', defaultPath: '/admin/orders', allowedPaths: ['/admin/orders', '/admin/customers'] }
};

/**
 * Helper function to determine if an error represents a true network / connection failure
 * (e.g., server offline, connection refused, network timeout, or no response received).
 * 
 * Returns false if the backend actually responded with an HTTP status code (400, 401, 403, 500, etc.),
 * ensuring backend authentication and validation errors are propagated to the UI.
 */
const isNetworkOrOfflineError = (err) => {
  // If backend responded with an HTTP status (e.g. 400 Bad Request, 401 Unauthorized, 403 Forbidden),
  // it is a backend response, NOT a network failure.
  if (err?.response || (typeof err?.status === 'number' && err.status > 0)) {
    return false;
  }

  // Check explicit network error flags set by Axios / API layer
  if (err?.isNetworkError === true || err?.code === 'ERR_NETWORK' || err?.code === 'ECONNREFUSED') {
    return true;
  }

  // Check message strings indicative of network/offline connectivity issues
  const message = (err?.message || '').toLowerCase();
  return (
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('econnrefused') ||
    message.includes('unable to connect') ||
    message.includes('timeout') ||
    message.includes('no response')
  );
};

export const authService = {
  /**
   * Login user using Axios API service.
   * - If backend responds with auth/validation failure (401, 400, 403, etc.), error is rethrown to the UI.
   * - Demo fallback is only triggered when the backend server is truly offline / unreachable.
   */
  async login(email, password, role = null) {
    try {
      // Attempt backend authentication via Axios API layer
      return await apiLogin(email, password, role);
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        throw new Error("Unable to connect to authentication server. Please verify backend is running on http://localhost:5000.");
      }
      throw err;
    }
  },

  /**
   * Register user using Axios API service.
   * - If backend responds with error (e.g. 400 User already exists), error is rethrown to the UI.
   * - Demo fallback is only triggered when the backend server is truly offline / unreachable.
   */
  async register(userData) {
    try {
      return await apiRegister(userData);
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        throw new Error("Unable to connect to authentication server. Please try again.");
      }
      throw err;
    }
  },

  async verifyOtp(email, otp) {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        throw new Error("Unable to connect to authentication server. Please try again.");
      }
      throw err;
    }
  },

  async resendOtp(email) {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        throw new Error("Unable to connect to authentication server. Please try again.");
      }
      throw err;
    }
  },

  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        throw new Error("Unable to connect to authentication server. Please try again.");
      }
      throw err;
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        throw new Error("Unable to connect to authentication server. Please try again.");
      }
      throw err;
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        throw new Error("Unable to connect to authentication server. Please try again.");
      }
      throw err;
    }
  },

  async getCurrentUser() {
    return await apiGetCurrentUser();
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      if (response.data?.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch (err) {
      if (!isNetworkOrOfflineError(err)) {
        throw err;
      }
    }
    const current = await this.getCurrentUser();
    const updated = { ...current, ...profileData };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
  },

  async logout() {
    return await apiLogout();
  }
};

export default authService;
