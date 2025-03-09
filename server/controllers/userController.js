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
        const token = jwt.sign(
            { userId: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Secret key (store this in your .env file)
            { expiresIn: '7d' } // Expiry time of the token (1 hour)
        );
        return  res.status(200).json({
            success: true,
            user,
            token,
        })
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
    console.log(newUser);

    await newUser.save();
    console.log("User saved successfully:", newUser);
       
        // Generate a JWT token
        const token = jwt.sign(
          { userId: newUser._id, email: newUser.email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }  // Token expiration time
        );
        console.log(token);
    
        res.status(201).json({
          success: true,
          token,  // Send the token in the response
          user: newUser,  // Send the user data
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    };
    

module.exports = { logincontroller, registercontroller };
