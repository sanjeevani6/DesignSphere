const userModel = require('../models/userModel');

// Google login controller
const googleLoginController = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    // Check if user already exists
    let user = await userModel.findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      user = new userModel({ name, email, password: googleId });
      await user.save();
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Export the controller
module.exports = { googleLoginController };
