const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },

        name: String,
        image: String,
        quantity: {
          type: Number,
          default: 1,
        },

        size: String,

        price: Number,

        customizations: [String],
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI", "Razorpay"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    transactionId: {
      type: String,
      default: null,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Received",
        "Preparing",
        "In Oven",
        "Woodfire Oven",
        "Woodfire Baking",
        "Out for Delivery",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Received",
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);