const express = require("express");
const {
  getAllDrivers,
  createDriver,
  updateDriver,
} = require("../controllers/driverController");

const router = express.Router();

// GET /api/drivers - Return all drivers
router.get("/", getAllDrivers);

// POST /api/drivers - Create a new driver
router.post("/", createDriver);

// PUT /api/drivers/:id - Update driver details
router.put("/:id", updateDriver);

module.exports = router;
