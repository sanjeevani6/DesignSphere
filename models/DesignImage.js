const mongoose = require('mongoose');

const designImageSchema = new mongoose.Schema({
    // This field will hold either a design ID or a team code
    designId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Design',  // Reference to the Design model
        required: function() {
            return !this.teamCode;  // Only required if teamCode is not present
        }
    },
    teamCode: {
        type: String,  // Team code for team projects
        required: function() {
            return !this.designId;  // Only required if designId is not present
        }
    },
    imageName: {
        type: String,
        required: true, // Name of the image (e.g., 'designId.png')
    },
    imageUrl: {
        type: String,   // Path to the saved image file
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.models.designimage || mongoose.model('designimage', designImageSchema);
