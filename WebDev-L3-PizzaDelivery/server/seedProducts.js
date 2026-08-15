const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Product = require("./models/Product");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const products = [
  {
    name: "Margherita Supreme",
    description: "Fresh mozzarella, basil, tomato sauce",
    price: 299,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    ingredients: ["Mozzarella", "Tomato Sauce", "Basil"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: true,
    rating: 4.8,
    stock: 50,
    isAvailable: true
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded with pepperoni and extra cheese",
    price: 449,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    ingredients: ["Pepperoni", "Cheese"],
    sizes: ["Small", "Medium", "Large"],
    isVeg: false,
    rating: 4.9,
    stock: 45,
    isAvailable: true
  },
  {
    name: "Farmhouse Veg",
    description: "Capsicum, onion, mushroom, tomato",
    price: 399,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c",
    ingredients: ["Capsicum","Onion","Tomato","Mushroom"],
    sizes: ["Small","Medium","Large"],
    isVeg: true,
    rating: 4.7,
    stock: 40,
    isAvailable: true
  },
  {
    name: "Paneer Tikka",
    description: "Indian style paneer tikka pizza",
    price: 429,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
    ingredients: ["Paneer","Onion","Capsicum"],
    sizes:["Small","Medium","Large"],
    isVeg:true,
    rating:4.9,
    stock:35,
    isAvailable:true
  },
  {
    name:"BBQ Chicken",
    description:"Smoky BBQ chicken with cheese",
    price:499,
    category:"Pizza",
    image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    ingredients:["Chicken","BBQ Sauce","Cheese"],
    sizes:["Small","Medium","Large"],
    isVeg:false,
    rating:4.8,
    stock:40,
    isAvailable:true
  },
  {
    name:"Cheese Burst",
    description:"Overflowing cheese explosion",
    price:449,
    category:"Pizza",
    image:"https://images.unsplash.com/photo-1513104890138-7c749659a591",
    ingredients:["Cheese"],
    sizes:["Small","Medium","Large"],
    isVeg:true,
    rating:4.8,
    stock:55,
    isAvailable:true
  },
  {
    name:"Mexican Green Wave",
    description:"Jalapenos, olives and crunchy veggies",
    price:389,
    category:"Pizza",
    image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    ingredients:["Jalapenos","Olives","Capsicum"],
    sizes:["Small","Medium","Large"],
    isVeg:true,
    rating:4.6,
    stock:42,
    isAvailable:true
  },
  {
    name:"Hawaiian",
    description:"Chicken and pineapple",
    price:469,
    category:"Pizza",
    image:"https://images.unsplash.com/photo-1513104890138-7c749659a591",
    ingredients:["Chicken","Pineapple"],
    sizes:["Small","Medium","Large"],
    isVeg:false,
    rating:4.4,
    stock:25,
    isAvailable:true
  },
  {
    name:"Four Cheese",
    description:"Blend of four premium cheeses",
    price:529,
    category:"Pizza",
    image:"https://images.unsplash.com/photo-1513104890138-7c749659a591",
    ingredients:["Mozzarella","Cheddar","Parmesan","Blue Cheese"],
    sizes:["Small","Medium","Large"],
    isVeg:true,
    rating:5.0,
    stock:20,
    isAvailable:true
  },
  {
    name:"Meat Lovers",
    description:"Pepperoni, chicken and sausage",
    price:599,
    category:"Pizza",
    image:"https://images.unsplash.com/photo-1513104890138-7c749659a591",
    ingredients:["Chicken","Pepperoni","Sausage"],
    sizes:["Small","Medium","Large"],
    isVeg:false,
    rating:4.9,
    stock:30,
    isAvailable:true
  }
];

async function seedProducts() {
  try {
    console.log("Connecting to MongoDB for Product Seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Product Seeding!");

    for (const product of products) {
      const updatedProduct = await Product.findOneAndUpdate(
        { name: product.name },
        { $set: product },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Upserted Product: "${updatedProduct.name}" (Price: $${updatedProduct.price}, Stock: ${updatedProduct.stock})`);
    }

    console.log("🎉 Products seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Product seeding error:", err);
    process.exit(1);
  }
}

seedProducts();