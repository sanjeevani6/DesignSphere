// controllers/savedesignController.js
const Design = require('../models/Design'); 
// Adjust path and model name as necessary


// Update an existing design
const updateDesign = async (req, res) => {
    try {
       const { designId } = req.params;
       const { title, elements, backgroundColor,backgroundImage } = req.body;
 
       const updatedDesign = await Design.findByIdAndUpdate(
          designId,
          { title, elements, backgroundColor,backgroundImage },
          { new: true }
       );
       res.status(200).json(updatedDesign);
    } catch (error) {
        console.error('Error updating design:', error);
        res.status(500).json({ message: 'Failed to update design', error });
    }
};

// Save a new design
const saveDesign = async (req, res) => {
    console.log('Received data:', req.body); // Log the incoming request body
    const { userId,title, elements, backgroundColor,backgroundImage } = req.body;

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
            backgroundImage
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