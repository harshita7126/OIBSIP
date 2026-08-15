const Inventory = require("../models/Inventory");
const { sendLowStockAlert } = require("../utils/emailService");

/**
 * Checks all inventory items in MongoDB for low stock levels.
 * Triggers low stock email alerts and persists alert state to prevent duplicate emails.
 */
const checkStockAndNotify = async () => {
  try {
    const items = await Inventory.find();
    if (!items || items.length === 0) return;

    let alertsSent = 0;
    let duplicatesSkipped = 0;

    for (const item of items) {
      const isLowStock = item.quantity <= item.threshold;

      if (isLowStock) {
        // DUPLICATE PREVENTION:
        // Only send an email if lastNotifiedQuantity is null or different from current quantity
        if (item.lastNotifiedQuantity !== item.quantity) {
          console.log(
            `[STOCK ALERT TRIGGERED] "${item.name}" has ${item.quantity} ${item.unit} remaining (Threshold: ${item.threshold}). Sending alert...`
          );

          await sendLowStockAlert({
            item: item.name,
            quantity: item.quantity,
            threshold: item.threshold,
            unit: item.unit,
            supplier: item.supplier,
          });

          // Persist alert tracking state in MongoDB to block duplicate emails on next cron runs
          item.lastNotifiedQuantity = item.quantity;
          item.lastNotifiedAt = new Date();
          await item.save();

          alertsSent++;
        } else {
          duplicatesSkipped++;
        }
      } else {
        // STOCK REPLENISHMENT RESET:
        // If stock was refilled above threshold, reset notification state
        if (item.lastNotifiedQuantity !== null) {
          console.log(`[STOCK REPLENISHED] "${item.name}" stock refilled to ${item.quantity} ${item.unit}. Resetting alert tracker.`);
          item.lastNotifiedQuantity = null;
          item.lastNotifiedAt = null;
          await item.save();
        }
      }
    }

    if (alertsSent > 0 || duplicatesSkipped > 0) {
      console.log(`[STOCK MONITOR SUMMARY] Alerts Sent: ${alertsSent}, Duplicates Prevented: ${duplicatesSkipped}`);
    }
  } catch (error) {
    console.error("❌ [stockAlertService Error]:", error.message);
    // Non-blocking error handling
  }
};

module.exports = {
  checkStockAndNotify,
};
