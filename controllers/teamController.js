const Team = require('../models/Team');
const TeamDesign = require('../models/TeamDesign');
const User = require('../models/userModel'); // Assuming you have a User model for user references


// Create a new team and a new design associated with it
exports.createTeam = async (req, res) => {
    console.log("creating team")
    const { teamName, userId } = req.body;
    

    if (!teamName || !userId) {
        return res.status(400).json({ error: 'Team name and user ID are required.' });
    }

    
      
    try {
        // Create a new team
        const team = new Team({
            teamCode,
            teamName,
            members: [userId], // Add the creator as the first member
        });

        // Create an empty design for the team
        const design = new TeamDesign({
            teamCode,
            title: `${teamName} Design`,
            elements:[],
            backgroundImage:'',
            backgroundColor:'#fff',
            createdAt:Date.now(),

            createdBy: userId,
        });
       

        // Save the team and design
        await team.save();
        await design.save();

        // Link the design to the team
        team.designId = design._id;
        await team.save();

        res.status(201).json({ message: 'Team created successfully', teamCode });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Failed to create team' });
    }
};

// Join an existing team
exports.joinTeam = async (req, res) => {
    const { teamCode, userId } = req.body;
    console.log("finding team")
    
    
    if (!teamCode || !userId) {
        return res.status(400).json({ error: 'Team code and user ID are required.' });
    }

    try {
        // Find the team by code
        console.log("reaching")
        const team = await Team.findOne({ teamCode });
        if (!team) {
            return res.status(404).json({ error: 'Team not found.' });
        }

        // Check if the user is already a member
        // if (team.members.includes(userId)) {
        //     console.log("showing")
        //     return res.status(400).json({ error: 'User is already a team member.' });
        // }

        // Add the user to the team
        if (!team.members.includes(userId)) {
           team.members.push(userId);
        await team.save();
        }

        res.status(200).json({ message: 'Joined team successfully', team });
    } catch (error) {
        console.error('Error joining team:', error);
        res.status(500).json({ error: 'Failed to join team' });
    }
};

// Get the current team design
exports.getTeamDesign = async (req, res) => {
    const { teamCode } = req.params;

    try {
        // Find the team design by team code
        const design = await TeamDesign.findOne({ teamCode });
        if (!design) {
            return res.status(404).json({ error: 'Design not found.' });
        }

        res.status(200).json(design);
    } catch (error) {
        console.error('Error fetching team design:', error);
        res.status(500).json({ error: 'Failed to fetch team design' });
    }
};

// Update the team design
exports.updateTeamDesign = async (req, res) => {
    const { teamCode } = req.params;
    const { elements, backgroundColor, backgroundImage, userId } = req.body;

    if (!teamCode || !elements || !userId) {
        return res.status(400).json({ error: 'Team code, user ID, and elements are required.' });
    }

    try {
        // Find the team design by team code
        const design = await TeamDesign.findOne({ teamCode });
        if (!design) {
            return res.status(404).json({ error: 'Design not found.' });
        }

        // Update the design fields
        design.elements = elements;
        design.backgroundColor = backgroundColor || design.backgroundColor;
        design.backgroundImage = backgroundImage || design.backgroundImage;
        design.updatedAt = new Date();

        // Save the updated design
        await design.save();

        // Notify clients about the update (if using a real-time tool like Socket.io)
        // io.emit(`design-updated-${teamCode}`, design);

        res.status(200).json({ message: 'Design updated successfully', design });
    } catch (error) {
        console.error('Error updating team design:', error);
        res.status(500).json({ error: 'Failed to update team design' });
    }
};




// Controller to fetch design by teamCode
exports.getTeamDesignByTeamCode = async (req, res) => {
    const { teamCode } = req.params;

    try {
        // Fetch design using teamCode
        const design = await TeamDesign.findOne({ teamCode });
        
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        res.status(200).json(design);
    } catch (error) {
        console.error('Error fetching design by teamCode:', error);
        res.status(500).json({ message: 'Failed to fetch design' });
    }
};


