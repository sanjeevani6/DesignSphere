// controllers/sidebarController.js
const path = require('path');
const fs = require('fs');
const SidebarItem = require('../models/SidebarItem');
const cloudinary = require('../config/cloudinary'); 

const getSidebarItems = async (req, res) => {
    try {

        const items = await SidebarItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sidebar items', error });
    }
};

 const imageupload=async(req,res)=>{
    console.log("file path in server",req.file);
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'designsphere/uploads' // Cloudinary folder
        });

        // Delete local file after upload
        fs.unlinkSync(req.file.path);
          // Send back Cloudinary URL
          res.status(200).json({ url: result.secure_url });

        console.log("Cloudinary URL:", result.secure_url);
       
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
    
    
}

module.exports={getSidebarItems,imageupload};
