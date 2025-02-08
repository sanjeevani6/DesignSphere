// routes/templatesRoutes.js
const express = require('express');
const router = express.Router();
const { getTemplates } = require('../controllers/templatesController');

router.get('/get-templates', getTemplates);

module.exports = router;
