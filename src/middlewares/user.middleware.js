const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token
const authenticateUserJWT = (req, res, next) => {
    // Get the token from the request header (usually 'Authorization' header)
    const token =
        req.header("Authorization") &&
        req.header("Authorization").split(" ")[1];

    if (!token) {
        return res.status(403).json({
            status: "ERROR",
            message: "Access Denied: No token provided",
        });
    }

    try {
        // Verify the token with the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified.role !== "admin" && verified.role !== "user") {
            return res.status(403).json({
                status: "ERROR",
                message:
                    "Access Denied: Only Registered Users and Admins have the Access",
            });
        }

        req.user = verified;

        next();
    } catch (error) {
        res.status(401).json({ status: "ERROR", message: "Invalid token" });
    }
};

module.exports = authenticateUserJWT;
