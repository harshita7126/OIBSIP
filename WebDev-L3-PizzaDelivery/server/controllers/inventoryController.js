const Inventory = require("../models/Inventory");

// Helper function to calculate stock status
const calculateStatus = (quantity, threshold) => {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= threshold) return "low_stock";
  return "in_stock";
};

// Helper function for low stock alerts (placeholder for node-cron + email integration)
const checkLowStockAlerts = (items) => {
  const lowStockItems = items.filter(
    (item) => item.quantity <= item.threshold
  );
  if (lowStockItems.length > 0) {
    console.log(
      `[INVENTORY ALERT] ${lowStockItems.length} item(s) below threshold:`,
      lowStockItems.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(", ")
    );
  }
};

// ===============================
// Get All Inventory Items
// ===============================
const getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });

    const formattedItems = items.map((item) => ({
      id: item._id,
      _id: item._id,
      item: item.name,
      name: item.name,
      category: item.category,
      stock: item.quantity,
      quantity: item.quantity,
      minThreshold: item.threshold,
      threshold: item.threshold,
      unit: item.unit,
      supplier: item.supplier,
      status: calculateStatus(item.quantity, item.threshold),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    checkLowStockAlerts(items);

    res.status(200).json({
      success: true,
      count: formattedItems.length,
      inventory: formattedItems,
    });
  } catch (error) {
    console.error("[GET /api/inventory] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Create Inventory Item
// ===============================
const createInventoryItem = async (req, res) => {
  try {
    const { name, category, quantity, threshold, unit, supplier } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Item name is required",
      });
    }

    const item = await Inventory.create({
      name,
      category: category || "Pizza Base",
      quantity: quantity !== undefined ? Number(quantity) : 0,
      threshold: threshold !== undefined ? Number(threshold) : 10,
      unit: unit || "Units",
      supplier: supplier || "CraveCrust Kitchen Direct",
    });

    console.log(`[POST /api/inventory] Item created: ${item._id}`);

    res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      item: {
        id: item._id,
        _id: item._id,
        item: item.name,
        name: item.name,
        category: item.category,
        stock: item.quantity,
        quantity: item.quantity,
        minThreshold: item.threshold,
        threshold: item.threshold,
        unit: item.unit,
        supplier: item.supplier,
        status: calculateStatus(item.quantity, item.threshold),
      },
    });
  } catch (error) {
    console.error("[POST /api/inventory] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Inventory Item / Stock
// ===============================
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { delta, quantity, stock, threshold, name, category, unit, supplier } = req.body;

    const existingItem = await Inventory.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    let newQuantity = existingItem.quantity;

    if (delta !== undefined) {
      newQuantity = Math.max(0, existingItem.quantity + Number(delta));
    } else if (quantity !== undefined) {
      newQuantity = Math.max(0, Number(quantity));
    } else if (stock !== undefined) {
      newQuantity = Math.max(0, Number(stock));
    }

    existingItem.quantity = newQuantity;
    if (threshold !== undefined) existingItem.threshold = Number(threshold);
    if (name !== undefined) existingItem.name = name;
    if (category !== undefined) existingItem.category = category;
    if (unit !== undefined) existingItem.unit = unit;
    if (supplier !== undefined) existingItem.supplier = supplier;

    await existingItem.save();

    console.log(`[PUT /api/inventory/${id}] Updated stock to ${existingItem.quantity}`);

    const formattedItem = {
      id: existingItem._id,
      _id: existingItem._id,
      item: existingItem.name,
      name: existingItem.name,
      category: existingItem.category,
      stock: existingItem.quantity,
      quantity: existingItem.quantity,
      minThreshold: existingItem.threshold,
      threshold: existingItem.threshold,
      unit: existingItem.unit,
      supplier: existingItem.supplier,
      status: calculateStatus(existingItem.quantity, existingItem.threshold),
    };

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      item: formattedItem,
    });
  } catch (error) {
    console.error(`[PUT /api/inventory/${req.params.id}] Error:`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Inventory Item
// ===============================
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error(`[DELETE /api/inventory/${req.params.id}] Error:`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  checkLowStockAlerts,
};
