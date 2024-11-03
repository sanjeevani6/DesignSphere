// controllers/savedesignController.js
const Design = require('../models/Design'); 

exports.saveDesign = async (req, res) => {
    console.log('Received data:', req.body); // Log the incoming request body
    const { userId,title, elements, backgroundColor } = req.body;

    if (!title || !elements) {
        return res.status(400).json({ error: 'Title and elements are required' });
    }
    if (!userId) {
        return res.status(400).send({ message: 'User ID is required' });
    }

    try {
        //log incoming data
        console.log('Saving design:', { userId,title, elements, backgroundColor });
        // Save design details to the database
        const newDesign = new Design({
            userId, // Associate the design with the user
            title,
            elements,
            backgroundColor,
        });

        await newDesign.save();
        res.status(201).json({ message: 'Design saved successfully', design: newDesign });
    } catch (error) {
        console.error('Failed to save design:', error);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to save design' });
    }
};