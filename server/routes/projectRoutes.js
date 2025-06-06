const express = require('express');
const { createTeam, joinTeam } = require('../controllers/teamController');
const router = express.Router();

router.post('/create-team', createTeam);
router.post('/join-team', joinTeam);

module.exports = router;

