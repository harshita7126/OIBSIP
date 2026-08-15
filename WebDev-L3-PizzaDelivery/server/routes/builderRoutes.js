const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getBuilderOptions,
  updateBuilderOptions,
} = require("../controllers/builderController");

const router = express.Router();

// GET /api/builder/options
router.get("/options", getBuilderOptions);

// PUT /api/builder/options (Owner, Manager only)
router.put("/options", protect, authorizeRoles("owner", "manager"), updateBuilderOptions);

module.exports = router;
