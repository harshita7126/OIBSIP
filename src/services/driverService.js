import api from "../api/api";

export const driverService = {
  // Get all drivers (or available drivers)
  async getDrivers() {
    try {
      const response = await api.get("/drivers");
      return response.data.drivers || [];
    } catch (err) {
      console.error("[driverService.getDrivers] Error fetching drivers:", err);
      throw err;
    }
  },

  // Create driver
  async createDriver(driverData) {
    try {
      const response = await api.post("/drivers", driverData);
      return response.data.driver;
    } catch (err) {
      console.error("[driverService.createDriver] Error creating driver:", err);
      throw err;
    }
  },

  // Assign driver to order
  async assignDriver(orderId, driverId) {
    try {
      const response = await api.put(`/orders/${orderId}/assign-driver`, {
        driverId,
      });
      return response.data.order;
    } catch (err) {
      console.error(`[driverService.assignDriver] Error assigning driver ${driverId} to order ${orderId}:`, err);
      throw err;
    }
  },
};

export default driverService;
