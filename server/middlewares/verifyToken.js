const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("Headers received:", req.headers);
    console.log("✅ JWT_SECRET:", process.env.JWT_SECRET);

    const token = req.headers.authorization;
    console.log("Headers received:", req.headers); // Check headers
    if (!token) {
        return res.status(403).send("Access denied. No token provided.");
    }
    
    try {
        // Remove "Bearer " prefix from token
        const jwtToken = token.split(' ')[1];
        console.log(jwtToken)
        const decoded = jwt.decode(token);
    console.log("🔍 Decoded Token Without Verification:", decoded);

        // Verify the token
        const verified = jwt.verify(jwtToken, process.env.JWT_SECRET);
        console.log("Decoded User:", verified); // Debugging (remove in production)

        // Attach user details to request object
        req.user = verified;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        res.status(400).send("Invalid or expired token");
    }
};

module.exports = verifyToken;
