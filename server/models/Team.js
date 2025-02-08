const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamCode: { type: String, unique: true, required: true },
    teamName: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // References to the User model
    designId: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamDesign' }, // Reference to shared design
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Team', teamSchema);
