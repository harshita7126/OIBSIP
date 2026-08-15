const Driver = require("../models/Driver");

// ===============================
// Get Available / All Drivers
// ===============================
const getAllDrivers = async (req, res) => {
  try {
    // Return all drivers so admin can view driver statuses, or filter available if requested
    const drivers = await Driver.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error("[GET /api/drivers] Error fetching drivers:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Create Driver
// ===============================
const createDriver = async (req, res) => {
  try {
    const { name, phone, vehicle, rating, available } = req.body;

    if (!name || !phone || !vehicle) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, and vehicle are required fields.",
      });
    }

    const driver = await Driver.create({
      name,
      phone,
      vehicle,
      rating: rating !== undefined ? rating : 5,
      available: available !== undefined ? available : true,
    });

    console.log(`[POST /api/drivers] Driver created: ${driver._id}`);

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      driver,
    });
  } catch (error) {
    console.error("[POST /api/drivers] Error creating driver:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Driver
// ===============================
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver details updated successfully",
      driver,
    });
  } catch (error) {
    console.error(`[PUT /api/drivers/${req.params.id}] Error updating driver:`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllDrivers,
  createDriver,
  updateDriver,
};
