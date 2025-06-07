// routes/sidebarItems.js
const express = require('express');
const { getSidebarItems,imageupload } = require('../controllers/sidebarController');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'images'); // Adjust depending on folder structure
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure folder exists
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Set the filename
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });


// GET /designpage/sidebar-items - fetch all sidebar items
router.get('/get-sidebar-items', getSidebarItems);
//Post/designpage//upload-image
router.post('/upload-image',upload.single('image'), imageupload);

module.exports = router;
