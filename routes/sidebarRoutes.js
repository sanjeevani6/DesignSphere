// routes/sidebarItems.js
const express = require('express');
const { getSidebarItems,imageupload } = require('../controllers/sidebarController');
const router = express.Router();

const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the folder where you want to store the files
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
