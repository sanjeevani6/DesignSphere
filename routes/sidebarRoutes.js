// routes/sidebarItems.js
const express = require('express');
const { getSidebarItems } = require('../controllers/sidebarController');
const router = express.Router();

// GET /api/sidebar-items - fetch all sidebar items
router.get('/get-sidebar-items', getSidebarItems);

module.exports = router;
