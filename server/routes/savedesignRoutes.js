const express = require('express');
const { saveDesign,updateDesign } = require('../controllers/savedesignController');
const router = express.Router();
const { getDesignsByUserId } = require('../controllers/getdesignController');
const { getDesignById } = require('../controllers/getdesignbyidController');
const Design = require('../models/Design');
const TeamDesign = require('../models/TeamDesign');
const Teams = require('../models/Team');
const teamDesignController=require('../controllers/teamDesignController')
const verifyToken = require('../middlewares/verifyToken');


// Route to get designs for a specific user
router.get('/user/:userId',verifyToken, (req, res) => {
    console.log("Fetching designs for user ID:", req.params.userId);
    if (!req.params.userId) {
      console.error("❌ Missing user ID in request.");
      return res.status(400).json({ message: "User ID is required." });
  }
    getDesignsByUserId(req, res);
});
//get||designbydesignId
router.get('/:designId', verifyToken,(req, res) => {
    console.log("Fetching design ID:", req.params.designId);
    // Your logic to fetch the design by ID
    getDesignById(req, res);
});

//for teams

// Route to fetch a team design by teamCode
router.get('/team-designs/:teamCode', verifyToken, teamDesignController.getTeamDesign);

// Route to update a team design by teamCode
router.put('/team-designs/:teamCode', verifyToken,  teamDesignController.updateTeamDesign);


//post||save design
router.post('/save', verifyToken,
  saveDesign);
//put|| save edited design
router.put('/:designId',verifyToken, updateDesign);
//delete a design
router.delete('/delete/:id', async (req, res) => {
    try {
        const designId = req.params.id;
        await Design.findByIdAndDelete(designId);
        res.status(200).json({ message: 'Design deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete design' });
    }
});
// Delete a team design by teamCode
router.delete('/delete/team/:teamCode/:userId', async (req, res) => {
    try {
      const {teamCode,userId} = req.params;
      console.log(`Deleting team design with TeamCode: ${teamCode}`);
    //   
    // Step 2: Update the Teams collection to remove the member
    const teamUpdateResult = await Teams.findOneAndUpdate(
        { teamCode }, // Locate the team using the teamCode
        { $pull: { members: userId } }, // Remove the userId from the members array
        { new: true } // Return the updated document
      );
  
      if (!teamUpdateResult) {
        return res.status(404).json({ error: 'Team not found or member not present.' });
      }
  
      res.status(200).json({
        message: 'Team design deleted and member removed successfully.',
        updatedTeam: teamUpdateResult, // Optional: Include the updated team details
      });
    } catch (error) {
      console.error('Error deleting team design or updating team members:', error);
      res.status(500).json({ error: 'Failed to delete team design or update members.' });
    }
  });

module.exports = router;