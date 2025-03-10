

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token; 
    console.log(`token: ${token}`)
    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }
    
    // Verify token using JWT_SECRET from .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return refreshAccessToken(req, res, next);
            }
            return res.status(403).json({ message: "Invalid token" });
        }
    req.user = { userId: decoded.userId };
    console.log("Decoded token:", JSON.stringify(decoded, null, 2));

   
    next();
    })
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
const refreshAccessToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token missing" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
            expiresIn: "15m", // New short-lived access token
        });

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        req.user = { userId: decoded.userId };// Attach user data
        next(); // Proceed with the request after refreshing token
    });
};


module.exports = verifyToken;
