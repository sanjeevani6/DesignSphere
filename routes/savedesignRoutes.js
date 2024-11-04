const express = require('express');
const { saveDesign,updateDesign } = require('../controllers/savedesignController');
const router = express.Router();
const { getDesignsByUserId } = require('../controllers/getdesignController');
const { getDesignById } = require('../controllers/getdesignbyidController');

// Route to get designs for a specific user
router.get('/user/:userId', (req, res) => {
    console.log("Fetching designs for user ID:", req.params.userId);
    getDesignsByUserId(req, res);
});
//get||designbydesignId
router.get('/:designId', (req, res) => {
    console.log("Fetching design ID:", req.params.designId);
    // Your logic to fetch the design by ID
    getDesignById(req, res);
});

//post||save design
router.post('/save', saveDesign);
//put|| save edited design
router.put('/:designId', updateDesign);


module.exports = router;