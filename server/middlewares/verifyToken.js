const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies?.token;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  // Try verifying access token
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // If access token expired, try refresh token
      if (err.name === "TokenExpiredError" && refreshToken) {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (refreshErr, refreshDecoded) => {
          if (refreshErr) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
          }

          // Create and set new access token
          const newAccessToken = jwt.sign(
            { userId: refreshDecoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );

          res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 15 * 60 * 1000,
          });

          req.user = { userId: refreshDecoded.userId }; // Attach refreshed user to req
          next();
        });
      } else {
        console.error("Token error:", err.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
      }
    } else {
      req.user = decoded; // Valid access token
      next();
    }
  });
};

module.exports = { verifyToken };

