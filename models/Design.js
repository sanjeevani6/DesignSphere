// models/Design.js
const mongoose = require('mongoose');

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
        enum: ['text', 'shape', 'image'],
        required: true,
    },
    category: {
        type: String,
        enum: ['text', 'shape', 'image'],
        required: true,
    },
    shapeType: {
        type: String, // e.g., 'circle', 'square', 'triangle'
    },
    color: {
        type: String, // color code, e.g., '#ff7f50'
    },
    imageUrl: {
        type: String, // URL for images
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

const designSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',  // Reference to the User model
        required: true 
    },
    title: { type: String, required: true },
    elements: [elementSchema], // Array of elements in the design
    backgroundColor:{ type:String,default:'#fff'},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Design', designSchema);
