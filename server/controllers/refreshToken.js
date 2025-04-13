const jwt = require("jsonwebtoken");

exports.refreshToken = (req, res) => {
    console.log("Cookies:", req.cookies); // Debugging
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: process.env.NODE_ENV === "production"?"None":"Lax",
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({ message: "Token refreshed", accessToken: newAccessToken });
    });
};
