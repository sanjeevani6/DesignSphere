const path = require('path');
const DesignImage = require('../models/DesignImage'); // Import DesignImage schema

// Handle image upload and return file path
const uploadDesignImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Construct the path for the uploaded file
        const filePath = path.join('uploads', 'designimage', req.file.filename);
        res.status(200).json({ url: filePath }); // Send file path to frontend
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
};

// Save design image information to the database
const saveDesignImage = async (req, res) => {
    const { designId, teamCode,imageUrl } = req.body;
   const finalDesignId=teamCode?teamCode:designId;
    try {
        // Check if design already exists to avoid duplicates
        const existingDesign = await DesignImage.findOne({ designId:finalDesignId });
        if (existingDesign) {
            return res.status(400).json({ error: 'Design image already saved' });
        }

        // Create a new design image record
        const newDesignImage = new DesignImage({ designId:finalDesignId, imageUrl:imageUrl });
        await newDesignImage.save();
        res.status(200).json({ message: 'Design image saved successfully', designImage: newDesignImage });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save design image' });
    }
};

module.exports = { uploadDesignImage, saveDesignImage };
