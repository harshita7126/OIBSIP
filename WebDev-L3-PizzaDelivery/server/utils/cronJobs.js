const cron = require("node-cron");
const { checkStockAndNotify } = require("../services/stockAlertService");

let cronScheduled = false;

const initCronJobs = () => {
  if (cronScheduled) {
    console.log("ℹ️ Cron jobs already initialized. Skipping duplicate startup.");
    return;
  }

  try {
    console.log("⏰ Initializing Low-Stock Cron Scheduler (Runs every 15 minutes)...");

    // Cron expression: runs every 15 minutes ('*/15 * * * *')
    cron.schedule("*/15 * * * *", async () => {
      console.log("⏰ [CRON JOB] Running scheduled inventory low-stock check...");
      try {
        await checkStockAndNotify();
      } catch (err) {
        console.error("❌ [CRON JOB ERROR] Handled safely without crashing server:", err.message);
      }
    });

    cronScheduled = true;
    console.log("✅ Low-Stock Cron Scheduler initialized successfully.");

    // Run an initial quick check on startup in background
    setTimeout(async () => {
      try {
        console.log("⏰ [INITIAL STARTUP CHECK] Running initial low-stock inspection...");
        await checkStockAndNotify();
      } catch (err) {
        console.error("❌ [INITIAL STARTUP CHECK ERROR]:", err.message);
      }
    }, 3000);
  } catch (error) {
    console.error("❌ Failed to schedule cron jobs:", error.message);
  }
};

module.exports = {
  initCronJobs,
};
