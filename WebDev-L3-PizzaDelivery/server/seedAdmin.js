const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const dns = require("dns");
const User = require("./models/User");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const seedAdmins = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Admin Seeding!");

    const admins = [
      {
        name: "Store Owner",
        email: "owner@cravecrust.com",
        password: await bcrypt.hash("owner123", 10),
        phone: "+1 (555) 999-0001",
        role: "owner",
        isVerified: true,
      },
      {
        name: "Store Manager",
        email: "manager@cravecrust.com",
        password: await bcrypt.hash("manager123", 10),
        phone: "+1 (555) 999-0002",
        role: "manager",
        isVerified: true,
      },
      {
        name: "Kitchen Staff",
        email: "kitchen@cravecrust.com",
        password: await bcrypt.hash("kitchen123", 10),
        phone: "+1 (555) 999-0003",
        role: "kitchen",
        isVerified: true,
      },
      {
        name: "Customer Support",
        email: "support@cravecrust.com",
        password: await bcrypt.hash("support123", 10),
        phone: "+1 (555) 999-0004",
        role: "support",
        isVerified: true,
      },
    ];

    for (const admin of admins) {
      const updatedUser = await User.findOneAndUpdate(
        { email: admin.email },
        { $set: admin },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Upserted Admin [${admin.role}]: ${updatedUser.email} (isVerified: ${updatedUser.isVerified})`);
    }

    console.log("🎉 Admin seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Admin seeding error:", err);
    process.exit(1);
  }
};

seedAdmins();