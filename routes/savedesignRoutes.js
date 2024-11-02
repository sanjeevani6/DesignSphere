const express = require('express');
const { saveDesign } = require('../controllers/savedesignController');
const router = express.Router();

//post||save design
router.post('/save', saveDesign);

module.exports = router;