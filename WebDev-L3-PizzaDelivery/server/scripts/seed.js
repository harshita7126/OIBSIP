const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const dns = require("dns");
const path = require("path");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

const inventoryItems = [
  { name: "Pizza Dough", category: "Pizza Base", quantity: 100, threshold: 20, unit: "Units", supplier: "CraveCrust Artisan Bakery" },
  { name: "Mozzarella Cheese", category: "Cheese", quantity: 45, threshold: 10, unit: "kg", supplier: "Dairy Gold Direct" },
  { name: "Tomatoes", category: "Sauce", quantity: 50, threshold: 12, unit: "kg", supplier: "Valley Fresh Farm" },
  { name: "Bell Peppers", category: "Vegetable", quantity: 25, threshold: 5, unit: "kg", supplier: "Organic Farms Co." },
  { name: "Mushrooms", category: "Vegetable", quantity: 18, threshold: 5, unit: "kg", supplier: "Organic Farms Co." },
  { name: "Olives", category: "Specialty", quantity: 15, threshold: 4, unit: "kg", supplier: "Mediterranean Imports" },
  { name: "Onions", category: "Vegetable", quantity: 40, threshold: 10, unit: "kg", supplier: "Valley Fresh Farm" },
  { name: "Paneer", category: "Specialty", quantity: 20, threshold: 5, unit: "kg", supplier: "Dairy Gold Direct" },
  { name: "Chicken", category: "Meat", quantity: 35, threshold: 8, unit: "kg", supplier: "Prime Meats Supply" },
  { name: "Pepperoni", category: "Meat", quantity: 28, threshold: 6, unit: "kg", supplier: "Prime Meats Supply" },
  { name: "Basil", category: "Vegetable", quantity: 12, threshold: 3, unit: "Bunches", supplier: "Green Leaf Herbs" },
  { name: "Jalapeno", category: "Vegetable", quantity: 15, threshold: 4, unit: "kg", supplier: "Valley Fresh Farm" },
  { name: "Corn", category: "Vegetable", quantity: 22, threshold: 5, unit: "kg", supplier: "Organic Farms Co." },
];

const products = [
  {
    name: "Margherita Classic",
    description: "Classic Italian pizza with fresh mozzarella, basil, and tomato sauce",
    price: 299,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    ingredients: ["Mozzarella", "Tomato Sauce", "Basil"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.8,
    stock: 50,
    isAvailable: true,
  },
  {
    name: "Farmhouse Delight",
    description: "Crispy bell peppers, onions, juicy tomatoes, and fresh mushrooms",
    price: 399,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c",
    ingredients: ["Capsicum", "Onion", "Tomato", "Mushroom"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.7,
    stock: 40,
    isAvailable: true,
  },
  {
    name: "Paneer Tikka Pizza",
    description: "Spiced Indian paneer tikka with green capsicum, red onions, and mozzarella",
    price: 429,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
    ingredients: ["Paneer Tikka", "Onion", "Capsicum"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.9,
    stock: 35,
    isAvailable: true,
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Tender grilled chicken pieces coated in smoky BBQ sauce with melted cheese",
    price: 499,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    ingredients: ["Chicken", "BBQ Sauce", "Cheese"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: false,
    rating: 4.8,
    stock: 40,
    isAvailable: true,
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded generously with premium crispy pepperoni and extra mozzarella",
    price: 449,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    ingredients: ["Pepperoni", "Cheese", "Tomato Sauce"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: false,
    rating: 4.9,
    stock: 45,
    isAvailable: true,
  },
  {
    name: "Four Cheese Overload",
    description: "Decadent blend of mozzarella, cheddar, parmesan, and creamy blue cheese",
    price: 529,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    ingredients: ["Mozzarella", "Cheddar", "Parmesan", "Blue Cheese"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 5.0,
    stock: 20,
    isAvailable: true,
  },
  {
    name: "Spicy Mexican Pizza",
    description: "Fiery jalapenos, black olives, sweet corn, and crunchy peppers",
    price: 389,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
    ingredients: ["Jalapenos", "Olives", "Capsicum", "Corn"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.6,
    stock: 42,
    isAvailable: true,
  },
  {
    name: "Veg Supreme",
    description: "The ultimate garden pizza topped with every favorite vegetable",
    price: 419,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47",
    ingredients: ["Olives", "Mushroom", "Capsicum", "Onion", "Corn"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.7,
    stock: 38,
    isAvailable: true,
  },
  {
    name: "Truffle Mushroom Pizza",
    description: "Wild sauteed mushrooms infused with aromatic black truffle oil",
    price: 549,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    ingredients: ["Wild Mushroom", "Truffle Oil", "Mozzarella", "Thyme"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.9,
    stock: 25,
    isAvailable: true,
  },
  {
    name: "Mediterranean Pizza",
    description: "Sun-dried tomatoes, kalamata olives, feta cheese, and fresh oregano",
    price: 469,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    ingredients: ["Feta Cheese", "Kalamata Olives", "Sun-dried Tomato", "Oregano"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.8,
    stock: 30,
    isAvailable: true,
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    const dbName = mongoose.connection.name;
    console.log(`✅ Connected to database: ${dbName}`);

    console.log("\n--- Seeding Demo Admin Accounts ---");
    const adminAccounts = [
      {
        name: "Store Owner",
        email: "owner@cravecrust.com",
        rawPassword: "owner123",
        role: "owner",
        phone: "+1 (555) 999-0001",
      },
      {
        name: "Store Manager",
        email: "manager@cravecrust.com",
        rawPassword: "manager123",
        role: "manager",
        phone: "+1 (555) 999-0002",
      },
      {
        name: "Kitchen Staff",
        email: "kitchen@cravecrust.com",
        rawPassword: "kitchen123",
        role: "kitchen",
        phone: "+1 (555) 999-0003",
      },
      {
        name: "Customer Support",
        email: "support@cravecrust.com",
        rawPassword: "support123",
        role: "support",
        phone: "+1 (555) 999-0004",
      },
    ];

    for (const admin of adminAccounts) {
      const hashedPassword = await bcrypt.hash(admin.rawPassword, 10);
      const user = await User.findOneAndUpdate(
        { email: admin.email },
        {
          $set: {
            name: admin.name,
            email: admin.email,
            password: hashedPassword,
            role: admin.role,
            phone: admin.phone,
            isVerified: true,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
      console.log(`✅ Upserted Admin [${admin.role}]: ${user.email} (Pass: ${admin.rawPassword})`);
    }

    console.log("\n--- Seeding CraveCrust Pizza Products ---");
    for (const product of products) {
      const p = await Product.findOneAndUpdate(
        { name: product.name },
        { $set: product },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
      console.log(`✅ Upserted Product: "${p.name}" (Price: $${p.price})`);
    }

    console.log("\n--- Seeding CraveCrust Kitchen Inventory ---");
    for (const item of inventoryItems) {
      const inv = await Inventory.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
      console.log(`✅ Upserted Inventory: "${inv.name}" (Stock: ${inv.quantity} ${inv.unit})`);
    }

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalInventory = await Inventory.countDocuments();
    console.log(`\n🎉 Seeding Complete! Database "${dbName}" now has ${totalUsers} users, ${totalProducts} products, and ${totalInventory} inventory items.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}

seedDatabase();
