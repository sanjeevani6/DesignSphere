const mongoose = require('mongoose');

const designImageSchema = new mongoose.Schema({
    teamCode: { 
        type: String, 
        ref: 'Design,TeamDesign',  // Reference to the Design model
        required: true 
    },
    imageName: {
        type: String,
        required: true, // Name of the image (e.g., 'designId.png')
    },
    imageUrl: {
        type: String,   // url of this design image
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.models.designimage || mongoose.model('TeamDesignimage', TeamdesignImageSchema);
