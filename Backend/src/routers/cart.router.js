const express = require("express");
const CartController = require("../controllers/Cart.Controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Cart APIs
router.post("/", authMiddleware, CartController.addToCart);
router.get("/:userId", authMiddleware, CartController.getCart);
router.delete("/:productId", authMiddleware, CartController.removeFromCart);

module.exports = router;
