// models/SidebarItem.js
const mongoose = require('mongoose');

const sidebarItemSchema = new mongoose.Schema({
    id:{
         type: String,
         required:true,
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

}, { timestamps: true });

const SidebarItem = mongoose.model('SidebarItem', sidebarItemSchema);
module.exports = SidebarItem;
