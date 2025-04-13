const mongoose = require('mongoose');

// Define the schema for each element within a design
const elementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'shape', 'image', 'animatedText', 'sticker'], 
        required: true,
    },
    category: {
        type: String,
        enum: ['text', 'shape', 'image', 'animatedText', 'sticker'], 
        required: true,
    },
    shapeType: {
        type: String, // e.g., 'circle', 'square', 'triangle'
    },
    color: {
        type: String, // color code, e.g., '#ff7f50'
    },
    backgroundColor: {
        type: String,
    },
    imageUrl: {
        type: String, // URL for images or stickers
    },
    animationUrl: {
        type: String, // URL for animated text or GIFs if animated
    },
    size: {
        width: { type: Number, default: 50 },
        height: { type: Number, default: 50 },
    },
    fontSize: {
        type: Number, // for text items
    },
    fontType: {
        type: String, // e.g., 'Arial', 'Times New Roman'
    },
    top: {
        type: Number,
        default: 0, // Position on the canvas
    },
    left: {
        type: Number,
        default: 0, // Position on the canvas
    },
});

// Define the schema for the collaborative team design
const teamDesignSchema = new mongoose.Schema({
    
    teamCode: { 
        type: String, 
        required: true, 
        unique: true // Ensures one design per team
    },
    title: { 
        type: String, 
        required: true 
    },
    elements: [elementSchema], // Array of design elements
    backgroundColor: { 
        type: String, 
        default: '#fff' 
    },
    backgroundImage: { 
        type: String, 
        default: '' 
    }, // URL for background image
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, // References the user who created the design
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }, // Last updated timestamp
}, { timestamps: true });

module.exports = mongoose.model('TeamDesign', teamDesignSchema);
