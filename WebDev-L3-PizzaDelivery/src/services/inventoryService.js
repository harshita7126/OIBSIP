import api from "../api/api";

export const inventoryService = {
  // Get all inventory items
  async getInventory() {
    try {
      const response = await api.get("/inventory");
      return response.data.inventory || [];
    } catch (err) {
      console.error("[inventoryService.getInventory] Error fetching inventory:", err);
      throw err;
    }
  },

  // Adjust stock quantity by delta (+5 or -5) or absolute quantity
  async updateStock(itemId, deltaOrData) {
    try {
      const payload = typeof deltaOrData === "number" ? { delta: deltaOrData } : deltaOrData;
      const response = await api.put(`/inventory/${itemId}`, payload);
      return response.data.item;
    } catch (err) {
      console.error(`[inventoryService.updateStock] Error updating stock for item ${itemId}:`, err);
      throw err;
    }
  },

  // Create new inventory item
  async createItem(itemData) {
    try {
      const response = await api.post("/inventory", itemData);
      return response.data.item;
    } catch (err) {
      console.error("[inventoryService.createItem] Error creating item:", err);
      throw err;
    }
  },

  // Delete item
  async deleteItem(itemId) {
    try {
      await api.delete(`/inventory/${itemId}`);
      return true;
    } catch (err) {
      console.error(`[inventoryService.deleteItem] Error deleting item ${itemId}:`, err);
      throw err;
    }
  },
};

export default inventoryService;
