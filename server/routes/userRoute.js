const express=require('express')
const { logincontroller, registercontroller, logoutController } = require('../controllers/userController')
const { googleLoginController } = require('../controllers/googleLoginController');
const {verifyToken} = require('../middlewares/verifyToken');
const { refreshToken } = require("../controllers/refreshToken");
const User= require("../models/userModel")
//router object
const router =express.Router();

//routers





router.get('/test', (req, res) => {
    console.log("test route worked");
    res.send('Test route works');
});
//post||google-login
router.post('/google-login', googleLoginController);


//post||login

router.post('/login',logincontroller);

//post||register user
router.post('/register',registercontroller);

router.post('/logout', logoutController);


router.get('/me', verifyToken, async(req, res) => {
    //console.log("current user: ", req.user);
    try {
      res.setHeader("Cache-Control", "no-store"); // ⛔ disable caching
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.json({ user });
      } catch (err) {
        res.status(500).json({ message: "Server error" });
      }
  });

router.post("/refresh-token", refreshToken);
module.exports=router;