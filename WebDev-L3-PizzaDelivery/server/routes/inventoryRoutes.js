const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/inventoryController");

const router = express.Router();

// GET /api/inventory
router.get("/", getAllInventory);

// POST /api/inventory (Owner, Manager, Kitchen)
router.post("/", protect, authorizeRoles("owner", "manager", "kitchen"), createInventoryItem);

// PUT /api/inventory/:id (Owner, Manager, Kitchen)
router.put("/:id", protect, authorizeRoles("owner", "manager", "kitchen"), updateInventoryItem);

// DELETE /api/inventory/:id (Owner, Manager only)
router.delete("/:id", protect, authorizeRoles("owner", "manager"), deleteInventoryItem);

module.exports = router;
