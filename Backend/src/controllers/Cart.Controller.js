const cartModel = require("../models/Cart.models");
const productModel = require("../models/product.models");

// POST /cart - Add or update product quantity in user's cart
async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Product ID and a positive quantity are required" });
        }

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if enough stock exists
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items left.` });
        }

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = new cartModel({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Update quantity
            cart.items[itemIndex].quantity += Number(quantity);
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity: Number(quantity) });
        }

        // Automatically calculate totalPrice
        let totalPrice = 0;
        for (const item of cart.items) {
            const prod = await productModel.findById(item.product);
            if (prod) {
                totalPrice += prod.price * item.quantity;
            }
        }
        cart.totalPrice = totalPrice;

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            message: "Product added to cart successfully",
            cart
        });
    } catch (err) {
        console.error("addToCart error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /cart/:userId - Retrieve the user's cart with populated products
async function getCart(req, res) {
    try {
        const { userId } = req.params;

        // Security check: Customer can only access their own cart
        if (req.user.id !== userId && req.user.role !== "admin") {
            return res.status(401).json({ message: "Unauthorized access to this cart" });
        }

        const cart = await cartModel.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json({
            message: "Cart retrieved successfully",
            cart
        });
    } catch (err) {
        console.error("getCart error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /cart/:productId - Remove a product from the user's cart
async function removeFromCart(req, res) {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Automatically calculate totalPrice
        let totalPrice = 0;
        for (const item of cart.items) {
            const prod = await productModel.findById(item.product);
            if (prod) {
                totalPrice += prod.price * item.quantity;
            }
        }
        cart.totalPrice = totalPrice;

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });
    } catch (err) {
        console.error("removeFromCart error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};