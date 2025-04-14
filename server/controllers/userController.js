const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//login controller
const logincontroller = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email})
        console.log(user)
        if (!user) {
           return  res.status(404).send("User not found")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Generate Refresh Token (7 days expiry)
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        // ✅ Send token as HTTP-Only Cookie
        res.cookie("refreshToken",refreshToken, {
          httpOnly: true,   // JavaScript can't access
          secure: process.env.NODE_ENV === "production", // Secure in production
          sameSite:process.env.NODE_ENV === "production"?"None":"Lax", // Prevents CSRF
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure:process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production"?"None":"Lax",
          maxAge: 15 * 60 * 1000, // 15 minutes
      });
       
    
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          user: { userId: user._id, name: user.name, email: user.email },
        });
    }
    catch (error) {
        return  res.status(400).json({
            success: false,
            error,
        });
    }
};


//register callback
const registercontroller = async (req, res) => {
    try {
      const { name, email, password } = req.body;
    console.log("at registerController")
    console.log(req.body)
  // Validate data
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
   console.log(hashedPassword)
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword, // Store hashed password
    });
    console.log("🆕 Saving User to Database:", newUser);

    // Save user to database
    await newUser.save();

    console.log("✅ User saved successfully:", newUser);
       
        // Generate a newJWT token
        // Generate Access Token
        const accessToken = jwt.sign(
          { userId: newUser._id, email: newUser.email },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
      );
      console.log(`Access token ${accessToken}`);
     console.log( process.env.JWT_REFRESH_SECRET);
      // Generate Refresh Token
      const refreshToken = jwt.sign(
          { userId: newUser._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
      );
      console.log(`refresh token ${refreshToken}`);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production"?"None":"Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production"?"None":"Lax",
          maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(201).json({
          message: "User registered successfully",
          accessToken, // Send access token to frontend
          user: { userId: newUser._id, name: newUser.name, email: newUser.email },
      });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    };
    

    const logoutController=async(req,res)=>{
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      
      console.log("cookie cleared");
      res.status(200).json({ success: true, message: "Logged out successfully" });
    
    }
module.exports = { logincontroller, registercontroller, logoutController };



