const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  getDashboardAnalytics,
} = require("../controllers/dashboardController");

// GET /api/dashboard (Owner, Manager only)
router.get("/", protect, authorizeRoles("owner", "manager"), getDashboardAnalytics);

module.exports = router;