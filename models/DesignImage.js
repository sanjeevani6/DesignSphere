const mongoose = require('mongoose');

const designImageSchema = new mongoose.Schema({
    designId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Design,TeamDesign',  // Reference to the Design model
        required: true 
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
