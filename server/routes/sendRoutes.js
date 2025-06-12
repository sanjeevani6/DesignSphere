const express = require('express');
const router = express.Router();
const { printController } = require('../controllers/printController');
require('dotenv').config();

router.post('/send', printController);
module.exports = router;