import api from "../api/api";
import { MOCK_BUILDER_OPTIONS } from "../data/mockPizzas";

export const builderService = {
  /**
   * Fetch Pizza Builder configuration from MongoDB via GET /api/builder/options.
   * Falls back to isolated MOCK_BUILDER_OPTIONS only if backend server is unreachable.
   */
  async getBuilderOptions() {
    try {
      const response = await api.get('/builder/options');
      if (response.data && response.data.options) {
        return response.data.options;
      }
      return MOCK_BUILDER_OPTIONS;
    } catch (err) {
      console.warn('[builderService] Failed to load builder options from MongoDB API. Using fallback options:', err.message);
      return MOCK_BUILDER_OPTIONS;
    }
  },

  /**
   * Update Builder Options in MongoDB (Admin Owner & Store Manager)
   */
  async updateBuilderOptions(builderData) {
    const response = await api.put('/builder/options', builderData);
    return response.data;
  }
};

export default builderService;
