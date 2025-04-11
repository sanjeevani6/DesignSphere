

const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token; // Access token from cookie
console.log(token)
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     console.log("decoded user", decoded);
  

    req.user = decoded; // attach to req for further use
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
