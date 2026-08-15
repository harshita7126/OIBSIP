const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Pizza Base", "Sauce", "Cheese", "Vegetable", "Meat", "Specialty"],
      default: "Pizza Base",
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    threshold: {
      type: Number,
      required: true,
      default: 10,
    },
    unit: {
      type: String,
      default: "Units",
    },
    supplier: {
      type: String,
      default: "CraveCrust Kitchen Direct",
    },
    lastNotifiedQuantity: {
      type: Number,
      default: null,
    },
    lastNotifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
