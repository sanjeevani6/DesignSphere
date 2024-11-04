// Assuming you're using Mongoose and have a Design model

const Design = require('../models/Design'); // Adjust the path as needed

// Controller function to get a design by ID
const getDesignById = async (req, res) => {
    const { designId } = req.params;

    try {
        const design = await Design.findById(designId); // Query the database for the design

        if (!design) {
            // If no design is found, respond with a 404 status
            return res.status(404).json({ message: 'Design not found' });
        }

        // Respond with the design data if found
        console.log('design data:',design);
        res.json(design);
    } catch (error) {
        console.error('Error fetching design by ID:', error);
        // Respond with a 500 status for any server errors
        res.status(500).json({ message: 'Server error fetching design' });
    }
};

module.exports = { getDesignById };
