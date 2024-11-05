// controllers/savedesignController.js
const Design = require('../models/Design'); 

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
       res.status(500).json({ message: 'Failed to update design', error });
    }
 };

const saveDesign = async (req, res) => {
    console.log('Received data:', req.body); // Log the incoming request body
    const { userId,title, elements, backgroundColor,backgroundImage } = req.body;

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
            backgroundImage
        });

        await newDesign.save();
        res.status(201).json({ message: 'Design saved successfully', design: newDesign });
    } catch (error) {
        console.error('Failed to save design:', error);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to save design' });
    }
};
module.exports={saveDesign,updateDesign};