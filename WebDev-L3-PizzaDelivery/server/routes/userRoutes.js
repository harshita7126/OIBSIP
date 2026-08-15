const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const { getAllCustomers, updateProfile } = require("../controllers/userController");

router.get("/", getAllCustomers);
router.put("/profile", protect, updateProfile);
router.put("/", protect, updateProfile);

module.exports = router;