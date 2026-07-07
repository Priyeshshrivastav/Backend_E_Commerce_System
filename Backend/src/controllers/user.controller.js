const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function userRegister(req, res) {
    try {
        const { username, email, password, role } = req.body

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).send({ message: "required fields are missing" })
        }

        // check is already created this or not 
        const isAlreadyExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        // if user already exists
        if (isAlreadyExist) {
            return res.status(409).send({ message: "user already exists" })
        }

        // password encryption
        const hash = await bcrypt.hash(password, 10)     

        // create user
        const user = await userModel.create({
            username,
            email,
            password: hash,
            role: role || "customer"
        })

        console.log(user);

        // token create
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        // store token into cookie
        res.cookie("token", token, { httpOnly: true })

        // send response
        res.status(200).send({
            message: "user created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role
            }
        })
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).send({ message: "internal server error" })
    }
}

async function userLogin(req, res) {
    try {
        const { username, email, password } = req.body

        // Validate fields
        if ((!username && !email) || !password) {
            return res.status(400).send({ message: "required fields are missing" })
        }

        // query criteria
        const query = {};
        if (username) query.username = username;
        if (email) query.email = email;

        // check data from db
        const user = await userModel.findOne({
            $or: [
                { username: username || "" },
                { email: email || "" }
            ]
        })

        // check user exist or not
        if (!user) {
            return res.status(401).send({ message: "invalid credential" })
        }

        // password comparison 
        const isValidpassword = await bcrypt.compare(password, user.password)

        if (!isValidpassword) {
            return res.status(401).send({ message: "invalid credential" })
        }

        // token create 
        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET)

        res.cookie("token", token, { httpOnly: true })

        // send response
        res.status(200).send({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }) 
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).send({ message: "internal server error" })
    }
}

module.exports = { userRegister, userLogin }