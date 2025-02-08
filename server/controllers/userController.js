const userModel = require('../models/userModel')



//login controller
const logincontroller = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email, password })
        if (!user) {
           return  res.status(404).send("User not found")
        }
        return  res.status(200).json({
            success: true,
            user,
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
        const newuser = new userModel(req.body);
        await newuser.save();
       res.status(201).json({
            success: true,
            newuser,
        });

    }
    catch (error) {
      res.status(400).json({
            success: false,
            error:error.message,
        })
    }
};

module.exports = { logincontroller, registercontroller };
