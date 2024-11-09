
// const express = require('express');
// const router = express.Router();
// const Project = require('../models/collaborativeProjects');
// const { v4: uuidv4 } = require('uuid'); 
// const mongoose = require('mongoose');

/*router.post('/create-team', async (req, res) => {
    const teamCode = uuidv4();
    console.log(req);
    const { userId } = req.body;

    console.log("Received request to create team with userId:", userId);
    
    if (!userId) {
        console.error('No userId provided');
        return res.status(400).json({ error: 'No userId provided' });
    }

    try {
        const newProject = new Project({
            users: [{ id: new mongoose.Types.ObjectId(userId)}],
            //users: [{ id: userId }], 
            teamCode,
            //title:'',
            elements: [],
            backgroundColor: '#fff',
            backgroundImage: '',
            updatedAt: new Date(),
        });

        console.log("Saving new project to database:", newProject);
        await newProject.save();
        res.json({ teamCode });
    } catch (error) {
        console.error('Error creating team:', error.message); 
        res.status(500).json({ error: 'Error creating team', details: error.message });
    }
})


// Route to join a team by team code
router.post('/join-team', async (req, res) => {
    const { teamCode, userId } = req.body;

    try {
        const project = await Project.findOne({ teamCode });
        console.log(project);

        if (project) {
            // Check if the user is already in the team
            const isUserInTeam = project.users.some(user => user.id === userId);
            if (!isUserInTeam) {
                // Add user to the team if not already present
                project.users.push({ id: userId });
                await project.save();
            }

            res.json({
                success: true,
                teamCode,
                title:project.title,
                elements: project.elements,
                backgroundColor: project.backgroundColor,
                backgroundImage: project.backgroundImage
            });
        } else {
            res.status(404).json({ success: false, message: 'Team not found' });
        }
    } catch (error) {
        console.error('Error joining team:', error);
        res.status(500).json({ error: 'Error joining team' });
    }
});

module.exports = router;*/


const express = require('express');
const { createTeam, joinTeam } = require('../controllers/teamController');
const router = express.Router();

router.post('/create-team', createTeam);
router.post('/join-team', joinTeam);

module.exports = router;

