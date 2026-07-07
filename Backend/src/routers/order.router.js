const express = require("express");
const OrderController = require("../controllers/Order.Controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Order APIs
router.post("/order", authMiddleware, OrderController.createOrder);
router.get("/orders/:userId", authMiddleware, OrderController.getUserOrders);

module.exports = router;
