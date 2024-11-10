const Design = require('../models/Design');
const TeamDesign = require('../models/Team');

// Controller to get designs by user ID
const getDesignsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId)
    const designs = await Design.find({ userId }).select('title createdAt'); // Only select title and createdAt
    const TeamDesigns = await TeamDesign.find({ members:userId}).select('teamName teamCode createdAt');
     // Only select title and createdAt
    console.log("team design",TeamDesigns);
    res.json({designs,TeamDesigns});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching designs', error });
  }
};


module.exports = { getDesignsByUserId };
