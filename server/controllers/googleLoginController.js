const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Google login controller
const googleLoginController = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new userModel({ name, email, password: googleId });
      await user.save();
    }

    // Generate Access Token (15 minutes)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate Refresh Token (7 days)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Set tokens as cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Respond to client
    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { googleLoginController };
