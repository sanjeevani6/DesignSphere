const mongoose = require('mongoose');

const designImageSchema = new mongoose.Schema({
    designId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Design',  // Reference to the Design model
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',   // Reference to the User model
        required: true 
    },
    title: {
        type: String,
        required: true
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

module.exports = mongoose.model('designimage', designImageSchema);
