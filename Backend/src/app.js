const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/user.router");
const productRouter = require("./routers/product.router");
const cartRouter = require("./routers/cart.router");
const orderRouter = require("./routers/order.router");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// auth api's
app.use("/auth/user", authRouter);

// product api's
app.use("/user", productRouter);

// cart api's
app.use("/cart", cartRouter);

// order api's
app.use("/", orderRouter);

module.exports = app;