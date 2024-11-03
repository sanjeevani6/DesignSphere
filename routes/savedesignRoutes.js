const express = require('express');
const { saveDesign } = require('../controllers/savedesignController');
const router = express.Router();
const { getDesignsByUserId } = require('../controllers/getdesignController');

// Route to get designs for a specific user
router.get('/:userId', (req, res) => {
    console.log("Fetching designs for user ID:", req.params.userId);
    getDesignsByUserId(req, res);
});

//post||save design
router.post('/save', saveDesign);

module.exports = router;