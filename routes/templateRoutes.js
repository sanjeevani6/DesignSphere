// routes/templateRoutes.js
const express = require('express');
const Template = require('../models/Template');

const router = express.Router();

// Get templates by category
router.get('/:category', async (req, res) => {
    const { category } = req.params;

    try {
        const templates = await Template.find({ category });
         res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates' });
    }
});

// Get all templates
router.get('/', async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates' });
    }
});

module.exports = router;
