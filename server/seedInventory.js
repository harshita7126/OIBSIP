const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const path = require("path");
const Inventory = require("./models/Inventory");

dotenv.config({ path: path.join(__dirname, ".env") });

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const sampleInventoryItems = [
  {
    name: "Organic Wheat Dough Balls",
    category: "Pizza Base",
    quantity: 180,
    threshold: 40,
    unit: "Units",
    supplier: "Golden Grain Co.",
  },
  {
    name: "Gluten-Free Cauliflower Crusts",
    category: "Pizza Base",
    quantity: 32,
    threshold: 10,
    unit: "Units",
    supplier: "PureBite Foods",
  },
  {
    name: "San Marzano Tomato Sauce",
    category: "Sauce",
    quantity: 45,
    threshold: 15,
    unit: "Liters",
    supplier: "Napoli Organics",
  },
  {
    name: "Spicy Calabrian Chili Sauce",
    category: "Sauce",
    quantity: 25,
    threshold: 8,
    unit: "Liters",
    supplier: "Calabria Direct",
  },
  {
    name: "Fresh Mozzarella Cheese",
    category: "Cheese",
    quantity: 50,
    threshold: 15,
    unit: "kg",
    supplier: "Lombardy Farms",
  },
  {
    name: "Quad Cheese Overload Blend",
    category: "Cheese",
    quantity: 30,
    threshold: 10,
    unit: "kg",
    supplier: "Lombardy Farms",
  },
  {
    name: "Cup & Char Pepperoni",
    category: "Meat",
    quantity: 28,
    threshold: 10,
    unit: "kg",
    supplier: "Salumi Artisans",
  },
  {
    name: "Wild Cremini Mushrooms",
    category: "Vegetable",
    quantity: 20,
    threshold: 8,
    unit: "kg",
    supplier: "Pacific Produce",
  },
  {
    name: "Fresh Bell Peppers & Olives",
    category: "Vegetable",
    quantity: 35,
    threshold: 12,
    unit: "kg",
    supplier: "Pacific Produce",
  },
  {
    name: "White Truffle Glaze",
    category: "Specialty",
    quantity: 15,
    threshold: 5,
    unit: "Bottles",
    supplier: "Piedmont Imports",
  },
];

const seedInventory = async () => {
  try {
    console.log("Connecting to MongoDB for inventory seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected!");

    const count = await Inventory.countDocuments();
    if (count === 0) {
      await Inventory.insertMany(sampleInventoryItems);
      console.log("🎉 Sample inventory items seeded successfully!");
    } else {
      console.log(`ℹ️ Inventory already populated (${count} items). Skipping seed.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Inventory Seeding Error:", error);
    process.exit(1);
  }
};

seedInventory();
