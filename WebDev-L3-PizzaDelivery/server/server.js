const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const driverRoutes = require("./routes/driverRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const builderRoutes = require("./routes/builderRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/builder", builderRoutes);

app.get("/", (req, res) => {
  res.send("🚀 CraveCrust Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Trigger nodemon restart: 1786283065