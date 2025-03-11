// controllers/sidebarController.js
const path = require('path');
const fs = require('fs');
const SidebarItem = require('../models/SidebarItem');

const getSidebarItems = async (req, res) => {
    try {
        const items = await SidebarItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sidebar items', error });
    }
};

 const imageupload=(req,res)=>{
    console.log(req.file)
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get file path and set up a public URL
        const filePath = path.join('uploads','images', req.file.filename); // Adjust path as needed
        
        // Here you may want to save the file path or move it to a permanent location
        console.log("filepath",filePath)
        res.status(200).json({ url: filePath });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
    
    
}

module.exports={getSidebarItems,imageupload};
