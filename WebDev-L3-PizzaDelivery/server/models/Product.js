const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Signature",
        "Veggie",
        "Meat Lovers",
        "Crust Specials",
        "Pizza",
        "Burger",
        "Pasta",
        "Drinks",
        "Desserts",
      ],
    },

    image: {
      type: String,
      required: true,
    },

    ingredients: [
      {
        type: String,
      },
    ],

    sizes: [
      {
        type: String,
        enum: ["Small", "Medium", "Large"],
      },
    ],

    isVeg: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;