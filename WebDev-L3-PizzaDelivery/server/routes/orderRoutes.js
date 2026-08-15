const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  assignDriverToOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Create Order
router.post("/", createOrder);

// Get Authenticated Customer Orders
router.get("/my-orders", protect, getMyOrders);

// Get All Orders (Admin or Customer Filtered)
router.get("/", getAllOrders);

// Get Single Order
router.get("/:id", getOrderById);

// Update Order
router.put("/:id", updateOrderStatus);

// Assign Driver to Order
router.put("/:orderId/assign-driver", assignDriverToOrder);

// Delete Order
router.delete("/:id", deleteOrder);

module.exports = router;