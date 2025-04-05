const express=require('express')
const { logincontroller, registercontroller, logoutController } = require('../controllers/userController')
const { googleLoginController } = require('../controllers/googleLoginController');
const verifyToken = require('../middlewares/verifyToken');
const { refreshToken } = require("../controllers/refreshToken");
//router object
const router =express.Router();

//routers





router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({ user: req.user }); // { userId: ... }
  });
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




router.post("/refresh-token", refreshToken);
module.exports=router;