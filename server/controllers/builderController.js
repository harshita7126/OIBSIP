const BuilderOption = require("../models/BuilderOption");
const Inventory = require("../models/Inventory");

const DEFAULT_BUILDER_DATA = {
  baseCraftPrice: 249,
  sizes: [
    { id: "size-1", name: 'Personal (8")', extraPrice: 0, multiplier: 0.8 },
    { id: "size-2", name: 'Medium (12")', extraPrice: 50, multiplier: 1.0 },
    { id: "size-3", name: 'Large (16")', extraPrice: 100, multiplier: 1.35 },
  ],
  bases: [
    { id: "base-1", name: "Classic Woodfire Hand-Tossed", price: 0, desc: "Golden airy crust with crisp bottom bubbles", tag: "Standard", isAvailable: true },
    { id: "base-2", name: "Neapolitan Artisan Thin Crust", price: 40, desc: "Ultra-thin, light, charred leopard spots", tag: "Crispy", isAvailable: true },
    { id: "base-3", name: "Triple Cheese Stuffed Crust", price: 80, desc: "Stuffed rim with molten mozzarella & cheddar", tag: "Bestseller", isAvailable: true },
    { id: "base-4", name: "72-Hour Fermented Sourdough", price: 60, desc: "Rich tangy sourdough crust fermented naturally", tag: "Chef Choice", isAvailable: true },
    { id: "base-5", name: "Gluten-Free Cauliflower Crust", price: 70, desc: "Low-carb, crispy gluten-friendly crust", tag: "Gluten Free", isAvailable: true },
  ],
  sauces: [
    { id: "sauce-1", name: "San Marzano Herb Tomato", price: 0, desc: "Sweet Italian plum tomatoes with basil & oregano", color: "#DC2626", isAvailable: true },
    { id: "sauce-2", name: "Spicy Calabrian Chili Tomato", price: 20, desc: "Kick of heat infused with garlic and red pepper", color: "#991B1B", isAvailable: true },
    { id: "sauce-3", name: "Creamy Roasted Garlic Parmesan", price: 30, desc: "Decadent white garlic cream sauce", color: "#FEF3C7", isAvailable: true },
    { id: "sauce-4", name: "Kentucky Bourbon Smoky BBQ", price: 30, desc: "Rich tangy barbecue glaze with molasses", color: "#78350F", isAvailable: true },
    { id: "sauce-5", name: "Genovese Pine Nut Pesto", price: 40, desc: "Vibrant fresh basil pesto base", color: "#15803D", isAvailable: true },
  ],
  cheeses: [
    { id: "cheese-1", name: "Fresh Mozzarella Fior di Latte", price: 0, desc: "Melt-in-mouth creamy fresh mozzarella", isAvailable: true },
    { id: "cheese-2", name: "Aged Wisconsin Sharp Cheddar", price: 25, desc: "Bold sharp cheddar for depth", isAvailable: true },
    { id: "cheese-3", name: "Smoked Dutch Gouda", price: 35, desc: "Rich nutty flavor with subtle woodsmoke", isAvailable: true },
    { id: "cheese-4", name: "Quad Cheese Overload Blend", price: 60, desc: "Mozzarella, Cheddar, Gouda & Parmesan", isAvailable: true },
    { id: "cheese-5", name: "Plant-Based Almond Mozzarella", price: 50, desc: "100% dairy-free vegan melting cheese", isAvailable: true },
  ],
  veggies: [
    { id: "veg-1", name: "Charred Bell Peppers", price: 20, color: "#EF4444", category: "Vegetable", isAvailable: true },
    { id: "veg-2", name: "Wild Cremini Mushrooms", price: 25, color: "#A16207", category: "Vegetable", isAvailable: true },
    { id: "veg-3", name: "Pickled Jalapeño Rings", price: 15, color: "#166534", category: "Vegetable", isAvailable: true },
    { id: "veg-4", name: "Kalamata Olives", price: 20, color: "#1F2937", category: "Vegetable", isAvailable: true },
    { id: "veg-5", name: "Caramelized Red Onions", price: 15, color: "#831843", category: "Vegetable", isAvailable: true },
    { id: "veg-6", name: "Sweet Golden Corn", price: 15, color: "#EAB308", category: "Vegetable", isAvailable: true },
    { id: "veg-7", name: "Sun-Dried Tomatoes", price: 25, color: "#991B1B", category: "Vegetable", isAvailable: true },
    { id: "veg-8", name: "Fresh Baby Spinach", price: 20, color: "#15803D", category: "Vegetable", isAvailable: true },
  ],
};

// Robust check matching builder option name against out-of-stock inventory items
const checkOptionAvailability = (optionName, outOfStockItems) => {
  if (!outOfStockItems || outOfStockItems.length === 0 || !optionName) return true;

  const optLower = optionName.toLowerCase();

  for (const invItem of outOfStockItems) {
    const invLower = (invItem.name || "").toLowerCase();

    // 1. Direct substring in either direction
    if (optLower.includes(invLower) || invLower.includes(optLower)) {
      return false;
    }

    // 2. Common key ingredient cross-reference
    const keyIngredients = [
      "olives", "pepperoni", "chicken", "jalapeno", "jalapeño", "mushroom", "mushrooms",
      "corn", "peppers", "onion", "onions", "tomato", "tomatoes", "mozzarella", "paneer",
      "basil", "cauliflower", "spinach", "dough"
    ];

    for (const key of keyIngredients) {
      if (optLower.includes(key) && invLower.includes(key)) {
        return false;
      }
    }
  }

  return true;
};

// GET /api/builder/options
const getBuilderOptions = async (req, res) => {
  try {
    let options = await BuilderOption.findOne();

    // Auto-seed default builder options if collection is empty
    if (!options) {
      options = await BuilderOption.create(DEFAULT_BUILDER_DATA);
      console.log("✅ Seeded default Pizza Builder options into MongoDB cravecrust.builderoptions");
    }

    const optsObj = options.toObject ? options.toObject() : options;

    // Cross-reference with inventory stock status if present
    try {
      const inventoryItems = await Inventory.find();
      if (inventoryItems && inventoryItems.length > 0) {
        const outOfStockItems = inventoryItems.filter(
          (i) => i.quantity <= 0 || i.status === "out_of_stock"
        );

        ["bases", "sauces", "cheeses", "veggies"].forEach((categoryKey) => {
          if (Array.isArray(optsObj[categoryKey])) {
            optsObj[categoryKey] = optsObj[categoryKey].map((item) => ({
              ...item,
              isAvailable:
                item.isAvailable === false
                  ? false
                  : checkOptionAvailability(item.name, outOfStockItems),
            }));
          }
        });
      }
    } catch (e) {
      console.warn("[getBuilderOptions] Cross-reference warning:", e.message);
    }

    res.status(200).json({
      success: true,
      options: optsObj,
    });
  } catch (error) {
    console.error("[GET /api/builder/options] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/builder/options (Owner & Store Manager)
const updateBuilderOptions = async (req, res) => {
  try {
    const updated = await BuilderOption.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Pizza Builder configuration updated in MongoDB",
      options: updated,
    });
  } catch (error) {
    console.error("[PUT /api/builder/options] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBuilderOptions,
  updateBuilderOptions,
};
