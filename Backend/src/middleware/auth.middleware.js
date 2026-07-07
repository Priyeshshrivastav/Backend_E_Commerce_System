const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    try {
        // Read token from cookie or Authorization header
        let token = req.cookies?.token;
        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization;
            }
        }
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required. Please login." });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id and role
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}

module.exports = authMiddleware;
