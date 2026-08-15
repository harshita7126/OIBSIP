const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Driver = require("./models/Driver");

const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

// DNS fix as used in db.js
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const sampleDrivers = [
  {
    name: "Marco Rossi",
    phone: "+1 (555) 912-4011",
    vehicle: "Black Vespa Scooter (CA 892-XP)",
    rating: 4.9,
    available: true,
  },
  {
    name: "Marcus Vance",
    phone: "+1 (555) 304-8812",
    vehicle: "Red Honda EV Bike (CA 104-EV)",
    rating: 4.8,
    available: true,
  },
  {
    name: "Elena Rostova",
    phone: "+1 (555) 881-2299",
    vehicle: "White Electric Scooter (CA 710-EV)",
    rating: 5.0,
    available: true,
  },
  {
    name: "Devon Miles",
    phone: "+1 (555) 412-9900",
    vehicle: "Blue Yamaha Bike (CA 331-YB)",
    rating: 4.7,
    available: true,
  },
];

const seedDrivers = async () => {
  try {
    console.log("Connecting to MongoDB for driver seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB Connected to database: ${dbName}`);

    // Check if test collection exists and copy or insert sample drivers
    const existingCount = await Driver.countDocuments();
    if (existingCount === 0) {
      await Driver.insertMany(sampleDrivers);
      console.log("🎉 Sample drivers seeded successfully into cravecrust.drivers!");
    } else {
      // Ensure all existing drivers have available: true if unassigned
      await Driver.updateMany({ available: { $exists: false } }, { $set: { available: true } });
      console.log(`ℹ️ Drivers already exist (${existingCount} drivers in collection). Updated availability flags.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Driver Seeding Error:", error);
    process.exit(1);
  }
};

seedDrivers();
