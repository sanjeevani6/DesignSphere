const express = require('express');
const router = express.Router();
const DesignImage = require('../models/DesignImage');

router.get('/:designId', async (req, res) => {
  try {
    const design = await DesignImage.findOne({ designId: req.params.designId });
    console.log("design found",design);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json({
      imageUrl: design.imageUrl,
      title: design.title || 'My Design'
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching design' });
  }
});

module.exports = router;

