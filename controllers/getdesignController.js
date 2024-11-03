const Design = require('../models/Design');

// Controller to get designs by user ID
const getDesignsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const designs = await Design.find({ userId }).select('title createdAt'); // Only select title and createdAt
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching designs', error });
  }
};

module.exports = { getDesignsByUserId };
