const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

// Same DNS configuration used by your working backend
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const { initCronJobs } = require("../utils/cronJobs");

const connectDB = async () => {
  try {
    console.log(
      "Connecting to:",
      process.env.MONGO_URI.replace(/:[^:@]+@/, ":********@")
    );

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB connected: ${dbName}`);

    // Initialize cron jobs strictly after MongoDB connection is ready
    initCronJobs();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    setTimeout(connectDB, 3000);
  }
};

module.exports = connectDB;