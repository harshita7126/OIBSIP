const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

(async () => {
  try {
    console.log("Connecting...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Full error:");
    console.error(err);
    process.exit(1);
  }
})();
