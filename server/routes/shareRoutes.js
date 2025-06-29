const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const DesignImage = require('../models/DesignImage');

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Requested ID:', id);

    let design;

    // Check if `id` is a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    if (isValidObjectId) {
      design = await DesignImage.findOne({ designId: id });
    }

    // If not found or not valid ObjectId, try by teamCode
    if (!design) {
      design = await DesignImage.findOne({ teamCode: id });
    }

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    res.json({
      imageUrl: design.imageUrl,
      title: design.title || 'My Design',
    });
  } catch (err) {
    console.error('Error fetching design:', err);
    res.status(500).json({ error: 'Error fetching design' });
  }
});

module.exports = router;
