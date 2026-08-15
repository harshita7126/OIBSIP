import api from "../api/api";
import { formatImageUrl } from "../utils/imageUtils";

export const orderService = {
  // Create Order
  async createOrder(orderData) {
    try {
      const response = await api.post("/orders", orderData);
      const order = response.data.order;
      const idStr = String(order._id || order.id);
      return {
        ...order,
        id: idStr,
        _id: idStr,
      };
    } catch (err) {
      console.error("[orderService.createOrder] Error creating order:", err);
      throw err;
    }
  },

  // Get Authenticated Customer Orders
  async getUserOrders() {
    try {
      const response = await api.get("/orders/my-orders");

      const statusMap = {
        Placed: "received",
        Received: "received",
        Preparing: "preparing",
        "Woodfire Oven": "in_oven",
        "Woodfire Baking": "in_oven",
        "In Oven": "in_oven",
        "Out for Delivery": "out_for_delivery",
        "Out For Delivery": "out_for_delivery",
        Delivered: "delivered",
        Cancelled: "cancelled",
      };

      return (response.data.orders || []).map((order) => {
        const idStr = String(order._id || order.id);
        return {
          id: idStr,
          _id: idStr,
          createdAt: order.createdAt,
          customer: {
            name: order.user?.name || "Unknown Customer",
            email: order.user?.email || "",
            phone: order.user?.phone || "",
            address: order.deliveryAddress,
          },
          items: (order.items || []).map((item) => ({
            ...item,
            name: item.name || item.product?.name || "Pizza Item",
            image: formatImageUrl(item.image || item.product?.image),
            price: item.price || item.product?.price || 0,
          })),
          summary: {
            subtotal: order.totalAmount ? Math.round((order.totalAmount / 1.1) * 100) / 100 : 0,
            total: order.totalAmount,
          },
          payment: {
            method: order.paymentMethod,
            status: order.paymentStatus,
            transactionId: order.transactionId,
            razorpayOrderId: order.razorpayOrderId,
          },
          status: statusMap[order.orderStatus] || "received",
          orderStatus: order.orderStatus,
          driver: order.driver && typeof order.driver === "object"
            ? {
                id: order.driver._id || order.driver.id,
                name: order.driver.name,
                vehicle: order.driver.vehicle,
                rating: order.driver.rating,
                phone: order.driver.phone,
              }
            : null,
        };
      });
    } catch (err) {
      console.error("[orderService.getUserOrders] Error fetching user orders:", err);
      throw err;
    }
  },

  // Get All System Orders (Admin Stream: GET /api/orders)
  async getAllOrders() {
    try {
      const response = await api.get("/orders");

      const statusMap = {
        Placed: "received",
        Received: "received",
        Preparing: "preparing",
        "Woodfire Oven": "in_oven",
        "Woodfire Baking": "in_oven",
        "In Oven": "in_oven",
        "Out for Delivery": "out_for_delivery",
        "Out For Delivery": "out_for_delivery",
        Delivered: "delivered",
        Cancelled: "cancelled",
      };

      return (response.data.orders || []).map((order) => {
        const idStr = String(order._id || order.id);
        return {
          id: idStr,
          _id: idStr,
          createdAt: order.createdAt,
          customer: {
            name: order.user?.name || "Customer",
            email: order.user?.email || "",
            phone: order.user?.phone || "",
            address: order.deliveryAddress,
          },
          items: (order.items || []).map((item) => ({
            ...item,
            name: item.name || item.product?.name || "Pizza Item",
            image: formatImageUrl(item.image || item.product?.image),
            price: item.price || item.product?.price || 0,
            customizations: item.customizations || [],
          })),
          summary: {
            subtotal: order.totalAmount ? Math.round((order.totalAmount / 1.1) * 100) / 100 : 0,
            total: order.totalAmount,
          },
          payment: {
            method: order.paymentMethod,
            status: order.paymentStatus,
            transactionId: order.transactionId,
            razorpayOrderId: order.razorpayOrderId,
          },
          status: statusMap[order.orderStatus] || "received",
          orderStatus: order.orderStatus,
          driver: order.driver && typeof order.driver === "object"
            ? {
                id: order.driver._id || order.driver.id,
                name: order.driver.name,
                vehicle: order.driver.vehicle,
                rating: order.driver.rating,
                phone: order.driver.phone,
              }
            : null,
        };
      });
    } catch (err) {
      console.error("[orderService.getAllOrders] Error fetching all system orders:", err);
      throw err;
    }
  },

  // Get Single Order
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      const order = response.data.order;

      if (!order) {
        throw new Error("No order payload returned from API.");
      }

      const statusMap = {
        Placed: "received",
        Received: "received",
        Preparing: "preparing",
        "Woodfire Oven": "in_oven",
        "Woodfire Baking": "in_oven",
        "In Oven": "in_oven",
        "Out for Delivery": "out_for_delivery",
        "Out For Delivery": "out_for_delivery",
        Delivered: "delivered",
        Cancelled: "cancelled",
      };

      const idStr = String(order._id || order.id);

      return {
        id: idStr,
        _id: idStr,
        createdAt: order.createdAt,
        estimatedDelivery: "25-35 mins",
        driver: order.driver && typeof order.driver === "object"
          ? {
              id: order.driver._id || order.driver.id,
              name: order.driver.name,
              vehicle: order.driver.vehicle,
              rating: order.driver.rating,
              phone: order.driver.phone,
            }
          : null,
        customer: {
          name: order.user?.name || "Customer",
          email: order.user?.email || "",
          phone: order.user?.phone || "",
          address: order.deliveryAddress,
        },
        items: (order.items || []).map((item) => ({
          ...item,
          name: item.name || item.product?.name || "Pizza Item",
          image: formatImageUrl(item.image || item.product?.image),
          price: item.price || item.product?.price || 0,
        })),
        summary: {
          subtotal: order.totalAmount ? Math.round((order.totalAmount / 1.1) * 100) / 100 : 0,
          total: order.totalAmount,
        },
        payment: {
          method: order.paymentMethod,
          status: order.paymentStatus,
          transactionId: order.transactionId,
          razorpayOrderId: order.razorpayOrderId,
        },
        status: statusMap[order.orderStatus] || "received",
        orderStatus: order.orderStatus,
        timeline: [
          {
            step: "received",
            time: order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now",
          },
          {
            step: "preparing",
            time:
              order.orderStatus === "Preparing"
                ? "In Progress"
                : order.orderStatus === "Delivered"
                ? "Completed"
                : "Pending",
          },
          {
            step: "in_oven",
            time:
              order.orderStatus === "Preparing" ||
              order.orderStatus === "Delivered"
                ? "Completed"
                : "Pending",
          },
          {
            step: "out_for_delivery",
            time:
              order.orderStatus === "Out for Delivery" ||
              order.orderStatus === "Delivered"
                ? "Completed"
                : "Pending",
          },
          {
            step: "delivered",
            time:
              order.orderStatus === "Delivered"
                ? "Completed"
                : "Pending",
          },
        ],
      };
    } catch (err) {
      console.error(`[orderService.getOrderById] Error fetching order ${orderId}:`, err);
      throw err;
    }
  },

  // Update Status
  async updateOrderStatus(orderId, newStatus) {
    try {
      const statusMap = {
        received: "Received",
        Received: "Received",
        preparing: "Preparing",
        Preparing: "Preparing",
        in_oven: "Woodfire Oven",
        "Woodfire Oven": "Woodfire Oven",
        "Woodfire Baking": "Woodfire Oven",
        "In Oven": "Woodfire Oven",
        out_for_delivery: "Out For Delivery",
        "Out For Delivery": "Out For Delivery",
        delivered: "Delivered",
        Delivered: "Delivered",
      };

      const response = await api.put(`/orders/${orderId}`, {
        orderStatus: statusMap[newStatus] || newStatus,
      });

      const order = response.data.order;
      const idStr = String(order._id || order.id);
      return {
        ...order,
        id: idStr,
        _id: idStr,
      };
    } catch (err) {
      console.error(`[orderService.updateOrderStatus] Error updating order ${orderId}:`, err);
      throw err;
    }
  },
};

export default orderService;