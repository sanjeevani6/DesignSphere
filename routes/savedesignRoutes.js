const express = require('express');
const { saveDesign,updateDesign } = require('../controllers/savedesignController');
const router = express.Router();
const { getDesignsByUserId } = require('../controllers/getdesignController');
const { getDesignById } = require('../controllers/getdesignbyidController');
const Design = require('../models/Design');

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
//delete a design
router.delete('/delete/:id', async (req, res) => {
    try {
        const designId = req.params.id;
        await Design.findByIdAndDelete(designId);
        res.status(200).json({ message: 'Design deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete design' });
    }
});


module.exports = router;