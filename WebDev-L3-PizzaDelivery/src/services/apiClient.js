import api from '../api/api';

// Export Axios instance as apiClient and default export for full compatibility
export const apiClient = api;

// Ensure request method is available for legacy simulated client callers
if (!apiClient.request) {
  apiClient.request = async (endpoint, options = {}) => {
    const method = (options.method || 'GET').toLowerCase();
    return apiClient({
      url: endpoint,
      method,
      data: options.body,
      headers: options.headers,
    });
  };
}

export default apiClient;
