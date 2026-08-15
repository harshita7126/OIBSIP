const mongoose = require("mongoose");

const builderOptionSchema = new mongoose.Schema(
  {
    baseCraftPrice: {
      type: Number,
      default: 249,
    },
    sizes: [
      {
        id: String,
        name: String,
        extraPrice: Number,
        multiplier: Number,
      },
    ],
    bases: [
      {
        id: String,
        name: String,
        price: Number,
        desc: String,
        tag: String,
        isAvailable: { type: Boolean, default: true },
      },
    ],
    sauces: [
      {
        id: String,
        name: String,
        price: Number,
        desc: String,
        color: String,
        isAvailable: { type: Boolean, default: true },
      },
    ],
    cheeses: [
      {
        id: String,
        name: String,
        price: Number,
        desc: String,
        isAvailable: { type: Boolean, default: true },
      },
    ],
    veggies: [
      {
        id: String,
        name: String,
        price: Number,
        color: String,
        category: String,
        isAvailable: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuilderOption", builderOptionSchema);
