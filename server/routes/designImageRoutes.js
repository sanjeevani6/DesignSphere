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
         if (!designId && !teamCode) {
            return res.status(400).json({ error: 'Either designId or teamCode is required.' });
        }

          const dIdType = teamCode ? 'teamCode' : 'designId';
        const dIdValue = teamCode || designId;
         console.log("design id",dIdValue, dIdType);
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
        // Prepare query & update objects
     const query = { [dIdType]: dIdValue };
        const update = {
            imageName: fileName,
            imageUrl: imageUrl
        };



       
        const existing = await DesignImage.findOne(query);
        if (existing) {
            await DesignImage.updateOne(query, { $set: update });
            console.log('Design image updated in DB');
        } else {
            const newEntry = new DesignImage({
                ...query,
                ...update
            });
            await newEntry.save();
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
