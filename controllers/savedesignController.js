// controllers/savedesignController.js
const Design = require('../models/Design'); 

// Update an existing design
const updateDesign = async (req, res) => {
    try {
        const { designId } = req.params;  // Get the design ID from the request parameters
        const { title, elements, backgroundColor } = req.body;  // Destructure data from request body

        // Find the design by ID and update it
        const updatedDesign = await Design.findByIdAndUpdate(
            designId,
            { title, elements, backgroundColor },
            { new: true, runValidators: true }  // Return the new version and run validators
        );

        // Check if the design was found and updated
        if (!updatedDesign) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.status(200).json(updatedDesign);  // Return the updated design
    } catch (error) {
        console.error('Error updating design:', error);
        res.status(500).json({ message: 'Failed to update design', error });
    }
};

// Save a new design
const saveDesign = async (req, res) => {
    console.log('Received data:', req.body);  // Log the incoming request body
    const { userId, title, elements, backgroundColor } = req.body;  // Destructure data

    // Validate required fields
    if (!title || !elements) {
        return res.status(400).json({ error: 'Title and elements are required' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Log incoming data
        console.log('Saving design:', { userId, title, elements, backgroundColor });

        // Create a new design instance
        const newDesign = new Design({
            userId,  // Associate the design with the user
            title,
            elements,
            backgroundColor,
        });

        // Save the design to the database
        await newDesign.save();
        res.status(201).json({ message: 'Design saved successfully', design: newDesign });  // Return success response
    } catch (error) {
        console.error('Failed to save design:', error);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to save design' });  // Return error response
    }
};

// Export the functions for use in routes
module.exports = {
    saveDesign,
    updateDesign
};
