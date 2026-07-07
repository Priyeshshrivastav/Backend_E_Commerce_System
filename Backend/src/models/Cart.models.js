const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productschema",
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// define model
const cartModel = mongoose.model("cart", CartSchema);

module.exports = cartModel;