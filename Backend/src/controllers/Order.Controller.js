const orderModel = require("../models/Order.models");
const cartModel = require("../models/Cart.models");
const productModel = require("../models/product.models");

// POST /order - Place an order from the user's cart
async function createOrder(req, res) {
    try {
        const userId = req.user.id;

        // 1. Read cart
        const cart = await cartModel.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Cannot place order." });
        }

        // 2. Validate products and stock
        const orderItems = [];
        let totalPrice = 0;

        for (const item of cart.items) {
            const product = await productModel.findById(item.product._id);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product.name || item.product._id} no longer exists.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity
            });

            totalPrice += product.price * item.quantity;
        }

        // 3. Deduct stock from products
        for (const item of cart.items) {
            await productModel.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // 4. Create order
        const order = await orderModel.create({
            user: userId,
            items: orderItems,
            totalPrice,
            status: "Pending"
        });

        // 5. Empty cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        await order.populate("items.product");

        return res.status(200).json({
            message: "Order placed successfully",
            order
        });
    } catch (err) {
        console.error("createOrder error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /orders/:userId - Retrieve all orders placed by the user
async function getUserOrders(req, res) {
    try {
        const { userId } = req.params;

        // Security check: Customers can only access their own orders
        if (req.user.id !== userId && req.user.role !== "admin") {
            return res.status(401).json({ message: "Unauthorized access to these orders" });
        }

        const orders = await orderModel.find({ user: userId }).populate("items.product");
        return res.status(200).json({
            message: "Orders retrieved successfully",
            orders
        });
    } catch (err) {
        console.error("getUserOrders error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createOrder,
    getUserOrders
};
