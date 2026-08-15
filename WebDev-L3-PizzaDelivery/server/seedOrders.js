const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

dotenv.config();

// DNS Fix
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const seedOrders = async () => {
  try {
    console.log("Connecting...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected!");

    const customer = await User.findOne({ role: "customer" });

    if (!customer) {
      console.log("❌ Customer not found.");
      process.exit();
    }

    const products = await Product.find();

    if (products.length < 3) {
      console.log("❌ Need at least 3 products.");
      process.exit();
    }

    await Order.deleteMany();

    await Order.insertMany([
      {
        user: customer._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            image: products[0].image,
            quantity: 2,
            size: "Large",
            price: products[0].price,
          },
        ],
        totalAmount: products[0].price * 2,
        paymentMethod: "COD",
        paymentStatus: "Pending",
        orderStatus: "Placed",
        deliveryAddress: "Sheela Nagar, Visakhapatnam",
      },

      {
        user: customer._id,
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            image: products[1].image,
            quantity: 1,
            size: "Medium",
            price: products[1].price,
          },
        ],
        totalAmount: products[1].price,
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        orderStatus: "Preparing",
        deliveryAddress: "Sheela Nagar, Visakhapatnam",
      },

      {
        user: customer._id,
        items: [
          {
            product: products[2]._id,
            name: products[2].name,
            image: products[2].image,
            quantity: 3,
            size: "Small",
            price: products[2].price,
          },
        ],
        totalAmount: products[2].price * 3,
        paymentMethod: "Card",
        paymentStatus: "Paid",
        orderStatus: "Delivered",
        deliveryAddress: "Sheela Nagar, Visakhapatnam",
      },
    ]);

    console.log("🎉 Orders seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedOrders();