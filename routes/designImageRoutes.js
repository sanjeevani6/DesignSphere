const multer = require('multer');
const path = require('path');
const fs = require('fs');

const express = require('express');

// Create a router instance
const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //const dir ='uploads/designimage'
        const dir =  'uploads/designimage';
       // const dir = path.resolve(process.cwd(), 'uploads', 'designimage');
       
        console.log('directory:',dir);
        
        console.log('file name',file.originalname);

        cb(null, dir);
      },
    filename: (req, file, cb) => {
        cb(null, `design-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// POST route to save uploaded images
router.post('/designimage', upload.single('file'), (req, res) => {
    try {
        res.status(200).json({ message: 'designImage saved successfully!', filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save designimage' });
    }
});


// POST /design-image/save - Save design metadata
//router.post('/save', saveDesignImage);

module.exports = router;
