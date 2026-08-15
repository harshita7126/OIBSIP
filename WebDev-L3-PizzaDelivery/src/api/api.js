import axios from 'axios';

// Base URL configured for http://localhost:5000/api with environment variable override support
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Keys used for localStorage token management
export const TOKEN_KEY = 'cravecrust_auth_token';
export const USER_KEY = 'cravecrust_user_session';

/**
 * Request Interceptor:
 * Automatically retrieves JWT token from localStorage and attaches it to the Authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Handles successful responses and standardizes API error messages & status codes
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const { status, data } = error.response;
      errorMessage = data?.message || data?.error || errorMessage;

      if (status === 401) {
        // Clear invalid or expired JWT token on unauthorized responses
        ['cravecrust_auth_token', 'cravecrust_user_session', 'token', 'user', 'role', 'adminToken', 'adminUser'].forEach((k) => {
          try {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
          } catch (e) {}
        });
        console.warn('Session expired or unauthorized access (401). Token cleared.');
      } else if (status === 403) {
        errorMessage = data?.message || 'Access forbidden. You do not have permission.';
      } else if (status === 404) {
        errorMessage = data?.message || 'Requested resource not found.';
      } else if (status === 500) {
        errorMessage = data?.message || 'Server error. Please try again later.';
      }
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = 'Network error: Unable to connect to backend server. Please verify backend is running on http://localhost:5000.';
    } else {
      errorMessage = error.message || errorMessage;
    }

    // Enhance error object with custom user-friendly message
    error.customMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;
export { api };
