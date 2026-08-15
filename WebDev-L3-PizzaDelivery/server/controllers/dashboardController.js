const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardAnalytics = async (req, res) => {
  try {
    const orders = (await Order.find().populate("items.product").lean()) || [];
    const users = (await User.find().lean()) || [];

    // ======================
    // KPIs & Metrics
    // ======================

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const activeOrders = orders.filter(
      (o) =>
        o.orderStatus !== "Delivered" &&
        o.orderStatus !== "Cancelled"
    ).length;

    const totalCustomers = users.filter(
      (u) => u.role === "customer"
    ).length;

    // ======================
    // Top Selling Products
    // ======================

    const pizzaSales = {};

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const itemName = item.name || item.product?.name || "Custom Crave";
        pizzaSales[itemName] =
          (pizzaSales[itemName] || 0) + (item.quantity || 1);
      });
    });

    const totalSold = Object.values(pizzaSales).reduce(
      (a, b) => a + b,
      0
    );

    const topPizzas = Object.entries(pizzaSales)
      .map(([name, qty]) => ({
        name,
        sales: qty,
        percentage:
          totalSold === 0
            ? 0
            : Math.round((qty / totalSold) * 100),
      }))
      .sort((a, b) => b.sales - a.sales);

    // ======================
    // Last 7 Days Revenue
    // ======================

    const salesHistory = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const start = new Date(day);
      start.setHours(0, 0, 0, 0);

      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter(
        (o) =>
          new Date(o.createdAt) >= start &&
          new Date(o.createdAt) <= end
      );

      salesHistory.push({
        day: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        revenue: dayOrders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0
        ),
        orders: dayOrders.length,
      });
    }

    // ======================
    // Hourly Peak Heatmap
    // ======================

    const hourlyCounts = Array(12).fill(0);
    const peakHoursLabels = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

    orders.forEach((order) => {
      if (order.createdAt) {
        const hour = new Date(order.createdAt).getHours();
        if (hour >= 12 && hour <= 23) {
          hourlyCounts[hour - 12] += 1;
        }
      }
    });

    const maxHourlyOrders = Math.max(...hourlyCounts, 1);

    const hourlyPeak = peakHoursLabels.map((hourLabel, idx) => ({
      hour: hourLabel,
      orders: hourlyCounts[idx],
      max: maxHourlyOrders,
    }));

    res.status(200).json({
      success: true,

      // Requested standardized response structure
      revenue: {
        total: totalRevenue,
        history: salesHistory,
      },
      orders: {
        total: totalOrders,
        active: activeOrders,
      },
      customers: totalCustomers,
      topSelling: topPizzas,
      satisfactionRate: "98.6%",
      averageDeliveryTime: "22 min",

      // Legacy/Component compatibility fields
      kpis: {
        totalRevenue,
        revenueGrowth: "+0%",
        activeOrders,
        avgDeliveryTime: "22 min",
        satisfactionRate: "98.6%",
        totalCustomers,
      },
      salesHistory,
      topPizzas,
      hourlyPeak,
    });
  } catch (err) {
    console.error("[GET /api/dashboard] Error:", err);
    res.status(200).json({
      success: false,
      message: err.message,
      revenue: { total: 0, history: [] },
      orders: { total: 0, active: 0 },
      customers: 0,
      topSelling: [],
      satisfactionRate: 0,
      averageDeliveryTime: 0,
      kpis: {
        totalRevenue: 0,
        revenueGrowth: "+0%",
        activeOrders: 0,
        avgDeliveryTime: "0 min",
        satisfactionRate: "0%",
        totalCustomers: 0,
      },
      salesHistory: [],
      topPizzas: [],
      hourlyPeak: [],
    });
  }
};

module.exports = {
  getDashboardAnalytics,
};