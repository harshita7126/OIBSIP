const User = require("../models/User");
const Order = require("../models/Order");

const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find();

    const customers = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });

        const totalSpent = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          joined: user.createdAt,
          ordersCount: orders.length,
          totalSpent,
          status: totalSpent >= 1000 ? "VIP Member" : "Active",
        };
      })
    );

    res.json({
      success: true,
      customers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only update allowed fields (name, phone, address)
    // Strictly prevent modifying password, role, email, or _id
    if (req.body.name !== undefined) {
      user.name = String(req.body.name).trim();
    }
    if (req.body.phone !== undefined) {
      user.phone = String(req.body.phone).trim();
    }
    if (req.body.address !== undefined) {
      user.address = String(req.body.address).trim();
    }
    if (req.body.avatar !== undefined) {
      user.avatar = String(req.body.avatar).trim();
      user.profilePhoto = String(req.body.avatar).trim();
    }
    if (req.body.profilePhoto !== undefined) {
      user.avatar = String(req.body.profilePhoto).trim();
      user.profilePhoto = String(req.body.profilePhoto).trim();
    }

    const updatedUser = await user.save();

    const roleTitleMap = {
      owner: "Store Owner",
      manager: "Store Manager",
      kitchen: "Kitchen Staff",
      support: "Customer Support",
      customer: "Customer",
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        avatar: updatedUser.avatar || updatedUser.profilePhoto || "",
        profilePhoto: updatedUser.avatar || updatedUser.profilePhoto || "",
        role: updatedUser.role,
        roleTitle: roleTitleMap[updatedUser.role] || "Customer",
        isVerified: updatedUser.isVerified !== false,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (err) {
    console.error("[updateProfile] Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};

module.exports = {
  getAllCustomers,
  updateProfile,
};