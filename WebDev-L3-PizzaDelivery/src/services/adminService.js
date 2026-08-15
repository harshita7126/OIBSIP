import api from "../api/api";
import { inventoryService } from "./inventoryService";
import { MOCK_ANALYTICS } from "../data/mockAnalytics";
import { formatImageUrl } from "../utils/imageUtils";

export const adminService = {
  // ==========================
  // Inventory (MongoDB Backend)
  // ==========================
  async getInventory() {
    return inventoryService.getInventory();
  },

  async updateStock(itemId, delta) {
    return inventoryService.updateStock(itemId, delta);
  },

  // ==========================
  // Products (MongoDB)
  // ==========================

  async getProducts() {
    const response = await api.get("/products?includeAll=true");
  
    return (response.data.products || []).map((product) => ({
      ...product,
      id: product._id,
      image: formatImageUrl(product.image),
    
      sizes: (product.sizes || []).map((size) => ({
        name: size,
        multiplier:
          size === "Small"
            ? 0.8
            : size === "Large"
            ? 1.3
            : 1,
      })),
    }));
  },

  async addProduct(productData) {
    const response = await api.post("/products", productData);

    return {
      ...response.data.product,
      id: response.data.product._id,
    };
  },

  async deleteProduct(productId) {
    await api.delete(`/products/${productId}`);
    return true;
  },

  async updateProduct(productId, productData) {
    const response = await api.put(
      `/products/${productId}`,
      productData
    );

    return {
      ...response.data.product,
      id: response.data.product._id,
    };
  },

  async toggleProductAvailability(productId, isAvailable) {
    const response = await api.put(`/products/${productId}`, { isAvailable });
    return response.data;
  },

  // ==========================
  // Customers (MongoDB)
  // ==========================

  async getCustomers() {
    const response = await api.get("/users");

    return response.data.customers.map((customer) => ({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      ordersCount: customer.ordersCount,
      totalSpent: customer.totalSpent,
      status: customer.status,
      joined: new Date(customer.joined).toLocaleDateString(),
    }));
  },

  // ==========================
  // Analytics (MongoDB)
  // ==========================

  async getAnalytics() {
    const response = await api.get("/dashboard");

    return response.data;
  },
};

export default adminService;