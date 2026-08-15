const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const Inventory = require("../models/Inventory");

// Safe, non-blocking post-save inventory deduction with custom component mapping
const deductInventoryForOrder = async (items = []) => {
  try {
    const allInventory = await Inventory.find();
    if (!allInventory || allInventory.length === 0) return;

    for (const item of items) {
      const itemQty = item.quantity || 1;
      const itemName = (item.name || "").toLowerCase();
      const customizations = Array.isArray(item.customizations)
        ? item.customizations
        : [];
      const sizeStr = (item.size || "").toLowerCase();

      // 1. Deduct Pizza Base
      let baseItem = allInventory.find((i) => i.category === "Pizza Base");
      if (sizeStr.includes("cauliflower") || sizeStr.includes("gluten")) {
        const gfBase = allInventory.find(
          (i) =>
            i.name.toLowerCase().includes("gluten") ||
            i.name.toLowerCase().includes("cauliflower")
        );
        if (gfBase) baseItem = gfBase;
      }
      for (const cust of customizations) {
        const custLower = cust.toLowerCase();
        if (custLower.includes("base") || custLower.includes("crust")) {
          const match = allInventory.find(
            (i) =>
              i.category === "Pizza Base" &&
              custLower.includes(i.name.toLowerCase())
          );
          if (match) baseItem = match;
        }
      }
      if (baseItem && baseItem.quantity > 0) {
        baseItem.quantity = Math.max(0, baseItem.quantity - itemQty);
        await baseItem.save();
      }

      // 2. Deduct Sauce
      let sauceItem = allInventory.find((i) => i.category === "Sauce");
      for (const cust of customizations) {
        const custLower = cust.toLowerCase();
        if (custLower.includes("sauce")) {
          const match = allInventory.find(
            (i) =>
              i.category === "Sauce" &&
              (custLower.includes(i.name.toLowerCase()) ||
                i.name.toLowerCase().includes("sauce"))
          );
          if (match) sauceItem = match;
        }
      }
      if (sauceItem && sauceItem.quantity > 0) {
        sauceItem.quantity = Math.max(0, sauceItem.quantity - itemQty);
        await sauceItem.save();
      }

      // 3. Deduct Cheese
      let cheeseItem = allInventory.find((i) => i.category === "Cheese");
      for (const cust of customizations) {
        const custLower = cust.toLowerCase();
        if (custLower.includes("cheese")) {
          const match = allInventory.find(
            (i) =>
              i.category === "Cheese" &&
              (custLower.includes(i.name.toLowerCase()) ||
                i.name.toLowerCase().includes("cheese"))
          );
          if (match) cheeseItem = match;
        }
      }
      if (cheeseItem && cheeseItem.quantity > 0) {
        cheeseItem.quantity = Math.max(0, cheeseItem.quantity - itemQty);
        await cheeseItem.save();
      }

      // 4. Custom toppings deduction
      for (const cust of customizations) {
        const custLower = cust.toLowerCase();
        const toppingMatch = allInventory.find(
          (i) =>
            ["Vegetable", "Meat", "Specialty"].includes(i.category) &&
            custLower.includes(i.name.toLowerCase())
        );
        if (toppingMatch && toppingMatch.quantity > 0) {
          toppingMatch.quantity = Math.max(0, toppingMatch.quantity - itemQty);
          await toppingMatch.save();
        }
      }
    }
  } catch (err) {
    console.warn("[deductInventoryForOrder] Non-blocking error:", err.message);
  }
};

// Helper function to normalize order ID fields
const normalizeOrder = (orderDoc) => {
  if (!orderDoc) return null;
  const orderObj = orderDoc.toObject ? orderDoc.toObject() : orderDoc;
  return {
    ...orderObj,
    id: orderObj._id,
    _id: orderObj._id,
  };
};

// ===============================
// Create Order
// ===============================
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      summary,
      totalAmount,
      total,
      payment,
      paymentMethod,
      paymentStatus,
      transactionId,
      razorpayOrderId,
      orderStatus,
      deliveryAddress,
    } = req.body;

    // 1. Extract customer & user info
    let authUserId = req.user?._id || req.user?.id;
    if (!authUserId && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "cravecrust_secret_key");
        if (decoded?.id) authUserId = decoded.id;
      } catch (e) {}
    }

    const customerEmail = customer?.email || req.user?.email || "customer@cravecrust.com";
    const customerName = customer?.name || req.user?.name || "Pizza Enthusiast";
    const customerPhone = customer?.phone || req.user?.phone || "";
    const addressStr = customer?.address || deliveryAddress || req.body.address || "Address provided at checkout";

    let user = null;
    if (authUserId) {
      user = await User.findById(authUserId);
    }
    if (!user && customerEmail) {
      user = await User.findOne({ email: customerEmail.toLowerCase().trim() });
    }
    if (!user) {
      const hashedPassword = await bcrypt.hash("temp123456", 10);
      user = await User.create({
        name: customerName,
        email: customerEmail.toLowerCase().trim(),
        phone: customerPhone,
        password: hashedPassword,
        isVerified: true,
      });
    }

    // Save/update user details if missing
    if (user) {
      let updatedUser = false;
      if (!user.address && addressStr && addressStr !== "Address provided at checkout") {
        user.address = addressStr;
        updatedUser = true;
      }
      if (!user.phone && customerPhone) {
        user.phone = customerPhone;
        updatedUser = true;
      }
      if (updatedUser) {
        await user.save();
      }
    }

    // 2. Extract payment info safely
    const rawMethod = String(paymentMethod || payment?.method || "");
    const rawStatus = String(paymentStatus || payment?.status || "");
    const rawTxId = transactionId || payment?.transactionId || null;
    const rawRazorpayOrderId = razorpayOrderId || payment?.razorpayOrderId || null;

    let finalPaymentMethod = "COD";
    if (rawMethod.toLowerCase().includes("razorpay") || (rawTxId && String(rawTxId).startsWith("pay_"))) {
      finalPaymentMethod = "Razorpay";
    } else if (rawMethod.toUpperCase().includes("UPI")) {
      finalPaymentMethod = "UPI";
    } else if (rawMethod.toLowerCase().includes("card")) {
      finalPaymentMethod = "Card";
    } else if (rawMethod.toUpperCase().includes("COD")) {
      finalPaymentMethod = "COD";
    }

    let finalPaymentStatus = "Pending";
    if (rawStatus === "Paid" || paymentStatus === "Paid" || payment?.status === "Paid" || (finalPaymentMethod === "Razorpay" && rawTxId)) {
      finalPaymentStatus = "Paid";
    }

    const finalTotalAmount = Number(summary?.total || totalAmount || total || 0);

    // 3. Format items
    const formattedItems = (items || []).map((item) => ({
      product: mongoose.Types.ObjectId.isValid(item.product || item.id || item._id)
        ? (item.product || item.id || item._id)
        : undefined,
      name: item.name || "Pizza Crave Item",
      image: item.image || item.product?.image || "",
      quantity: Number(item.quantity || 1),
      size: item.size || item.selectedSize?.name || "Medium",
      price: Number(item.price || 0),
      customizations: Array.isArray(item.customizations) ? item.customizations : [],
    }));

    // 4. Validate product availability for items
    for (const item of formattedItems) {
      let dbProd = null;
      let prodId = item.product;
      if (typeof prodId === "object" && prodId !== null) {
        prodId = prodId._id || prodId.id;
      }
      if (prodId && mongoose.Types.ObjectId.isValid(prodId)) {
        dbProd = await Product.findById(prodId);
      }
      if (!dbProd && item.name) {
        const escapedName = item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        dbProd = await Product.findOne({
          name: new RegExp(`^${escapedName}$`, "i"),
        });
      }
      if (dbProd && dbProd.isAvailable === false) {
        return res.status(400).json({
          success: false,
          message: `Sorry, '${dbProd.name}' is currently unavailable`,
        });
      }
    }

    // 5. Create Order in MongoDB
    const order = await Order.create({
      user: user._id,
      items: formattedItems,
      totalAmount: finalTotalAmount,
      paymentMethod: finalPaymentMethod,
      paymentStatus: finalPaymentStatus,
      transactionId: rawTxId,
      razorpayOrderId: rawRazorpayOrderId,
      deliveryAddress: addressStr,
      orderStatus: orderStatus || "Received",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name image price");

    console.log(`[POST /api/orders] Created new order ${order._id} for ${customerEmail} (Payment: ${finalPaymentStatus}, Method: ${finalPaymentMethod})`);

    // Asynchronously deduct inventory AFTER order creation success without blocking
    deductInventoryForOrder(items).catch((invErr) => {
      console.warn(`[POST /api/orders] Post-order inventory deduction warning:`, invErr.message);
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: normalizeOrder(populatedOrder),
    });
  } catch (error) {
    console.error("[POST /api/orders] Error creating order:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to save order to database",
    });
  }
};

// ===============================
// Get Authenticated Customer's Orders
// ===============================
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const orders = await Order.find({ user: userId })
      .populate("user", "name email phone")
      .populate("items.product", "name image price")
      .populate("driver")
      .sort({ createdAt: -1 })
      .lean();

    const normalizedOrders = orders.map(normalizeOrder);

    res.status(200).json({
      success: true,
      count: normalizedOrders.length,
      orders: normalizedOrders,
    });
  } catch (error) {
    console.error("[GET /api/orders/my-orders] Error fetching customer orders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// ===============================
// Get All Orders (Admin or Customer Filtered)
// ===============================
const getAllOrders = async (req, res) => {
  try {
    let filter = {};

    let reqUser = req.user;
    if (!reqUser && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "cravecrust_secret_key");
        if (decoded?.id) {
          reqUser = await User.findById(decoded.id);
        }
      } catch (e) {}
    }

    // If authenticated user is a regular customer, filter by their own user._id
    if (reqUser && (reqUser.role === "customer" || !reqUser.role)) {
      filter.user = reqUser._id;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.product", "name image price")
      .populate("driver")
      .sort({ createdAt: -1 })
      .lean();

    const normalizedOrders = orders.map(normalizeOrder);

    res.status(200).json({
      success: true,
      count: normalizedOrders.length,
      orders: normalizedOrders,
    });
  } catch (error) {
    console.error("[GET /api/orders] Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Single Order
// ===============================
const getOrderById = async (req, res) => {
  const { id } = req.params;
  console.log(`[GET /api/orders/${id}] Fetching order details...`);

  try {
    // Check if valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`[GET /api/orders/${id}] Invalid ObjectId format provided.`);
      return res.status(400).json({
        success: false,
        message: `Invalid order ID format: "${id}"`,
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("items.product", "name image price")
      .populate("driver");

    if (!order) {
      console.warn(`[GET /api/orders/${id}] Order not found in database.`);
      return res.status(404).json({
        success: false,
        message: `Order not found for ID: ${id}`,
      });
    }

    // Inspect requester token to enforce customer order ownership
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "cravecrust_secret_key");
        const reqUser = await User.findById(decoded.id);

        if (reqUser && (reqUser.role === "customer" || !reqUser.role)) {
          const orderUserId = String(order.user?._id || order.user);
          if (orderUserId !== String(reqUser._id)) {
            return res.status(403).json({
              success: false,
              message: "Access forbidden. You do not have permission to view this order.",
            });
          }
        }
      } catch (e) {}
    }

    console.log(`[GET /api/orders/${id}] Successfully fetched order.`);

    res.status(200).json({
      success: true,
      order: normalizeOrder(order),
    });
  } catch (error) {
    console.error(`[GET /api/orders/${id}] Error fetching order:`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Status
// ===============================
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order ID format: "${id}"`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email phone")
      .populate("items.product", "name image price")
      .populate("driver");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: normalizeOrder(order),
    });
  } catch (error) {
    console.error(`[PUT /api/orders/${id}] Error updating order:`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Assign Driver to Order
// ===============================
const assignDriverToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { driverId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid orderId or driverId format.",
      });
    }

    const Driver = require("../models/Driver");
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { driver: driverId },
      { new: true }
    )
      .populate("user", "name email phone")
      .populate("items.product", "name image price")
      .populate("driver");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Set driver availability to false upon assignment
    driver.available = false;
    await driver.save();

    console.log(`[PUT /api/orders/${orderId}/assign-driver] Assigned driver ${driver.name} to order ${orderId}`);

    res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      order: normalizeOrder(order),
    });
  } catch (error) {
    console.error(`[PUT /api/orders/${orderId}/assign-driver] Error:`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete
// ===============================
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order ID format: "${id}"`,
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(`[DELETE /api/orders/${id}] Error deleting order:`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  assignDriverToOrder,
  deleteOrder,
};