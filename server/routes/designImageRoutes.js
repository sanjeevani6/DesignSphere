 const multer = require('multer');
const path = require('path');


const express = require('express');
const DesignImage = require('../models/DesignImage');

// Create a router instance
const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        const dir =  path.join(__dirname,'..', 'uploads', 'designimage');
      
       console.log('file',file)
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
router.post('/designimage', upload.single('file'), async(req, res) => {
    try {
        const { designId,teamCode } = req.body;
        const dId=teamCode?teamCode:designId
       // const filePath = req.file.path;
       const filePath = `/uploads/designimage/${req.file.filename}`;  // Relative Path

        const fileName = req.file.filename;
        console.log('File uploaded:', fileName, 'Path:', filePath);
        const existingDesignImage = await DesignImage.findOne({ designId: dId });
        if (existingDesignImage) {
            await DesignImage.updateOne(
                { designId: dId }, 
                {
                    $set: {
                        imageName: fileName,  
                        imageUrl: filePath    
                    }
                }
            );
            console.log('designimage updated');
        }
        else{
        const designImage = new DesignImage({
            designId: dId,
            imageName: fileName,
            imageUrl: filePath // Relative path to the uploaded image
        });


        // Save the image metadata
        await designImage.save();
    }

        res.status(200).json({ message: 'designImage saved successfully!', filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save designimage' });
    }
});



module.exports = router;
