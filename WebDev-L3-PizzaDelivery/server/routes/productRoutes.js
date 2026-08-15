const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Get All Products (Public)
router.get("/", getAllProducts);

// Get Single Product (Public)
router.get("/:id", getProductById);

// Create Product (Owner / Manager only)
router.post("/", protect, authorizeRoles("owner", "manager"), createProduct);

// Update Product (Owner / Manager only)
router.put("/:id", protect, authorizeRoles("owner", "manager"), updateProduct);

// Delete Product (Owner / Manager only)
router.delete("/:id", protect, authorizeRoles("owner", "manager"), deleteProduct);

module.exports = router;