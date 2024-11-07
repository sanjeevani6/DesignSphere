// controllers/templatesController.js
const path = require('path');
const fs = require('fs');
const Templates = require('../models/Templates');

const getTemplates =async (req, res) => {
    try{
    const templates = await Templates.find();
        res.json({ templates });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates', error });
    }
};

module.exports = { getTemplates };
