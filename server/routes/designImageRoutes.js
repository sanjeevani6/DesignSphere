 const multer = require('multer');
const path = require('path');
const fs=require('fs');

const express = require('express');
const DesignImage = require('../models/DesignImage');
const cloudinary = require('../config/cloudinary');
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
router.post('/designimage', upload.single('file'), async (req, res) => {
    try {
        const { designId, teamCode } = req.body;
        const dId = teamCode || designId;
         console.log("design id",dId);
        const localPath = req.file.path;

        // Upload to Cloudinary
        const cloudinaryRes = await cloudinary.uploader.upload(localPath, {
            folder: 'designimage'
        });
        console.log("file uploaded in cloudinary");
        

        // Clean up local file
        fs.unlinkSync(localPath);

        const imageUrl = cloudinaryRes.secure_url;
        const fileName = req.file.filename;
        console.log("IMAGE URL FROM CLOUDINARY",imageUrl);

        const existingDesignImage = await DesignImage.findOne({ designId: dId });
        if (existingDesignImage) {
            await DesignImage.updateOne(
                { designId: dId },
                {
                    $set: {
                        imageName: fileName,
                        imageUrl: imageUrl  // Cloudinary URL
                    }
                }
            );
            console.log('Design image updated in DB');
        } else {
            const designImage = new DesignImage({
                designId: dId,
                imageName: fileName,
                imageUrl: imageUrl
            });
            await designImage.save();
            console.log('Design image saved in DB');
        }

        res.status(200).json({
            message: 'Design image uploaded and saved successfully!',
            cloudinaryUrl: imageUrl
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});



module.exports = router; 
