const Team = require('../models/Team');
const TeamDesign = require('../models/TeamDesign');


// Controller to get a team design by teamCode
const getTeamDesign = async (req, res) => {
    try {
        const { teamCode } = req.params;
        
        // Find the team design associated with the given teamCode
        const teamDesign = await TeamDesign.findOne({ teamCode });
        console.log("fetching")
        
        if (!teamDesign) {
            return res.status(404).json({ message: 'Team design not found' });
        }
        
        res.status(200).json(teamDesign);
    } catch (error) {
        console.error('Error fetching team design:', error);
        res.status(500).json({ message: 'Failed to fetch team design' });
    }
};

// Controller to update a team design by teamCode
const updateTeamDesign = async (req, res) => {
    try {
        const { teamCode } = req.params;
        const { elements, backgroundColor, backgroundImage, title } = req.body;

        // Update the team design with new design data
        // Update the team design if it exists; otherwise, create a new one
        const updatedTeamDesign = await TeamDesign.findOneAndUpdate(
            { teamCode },
            {
                elements,
                backgroundColor,
                backgroundImage,
                title,
                // createdBy,
                updatedAt: Date.now(),
            },
            { new: true, upsert: true } // Upsert option to create if not exists
        );
        console.log("after changes", updatedTeamDesign);

        res.status(200).json(updatedTeamDesign);
    } catch (error) {
        console.error('Error updating team design:', error);
        res.status(500).json({ message: 'Failed to update team design' });
    }
};
module.exports={getTeamDesign,updateTeamDesign};


        