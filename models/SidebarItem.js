// models/SidebarItem.js
const mongoose = require('mongoose');

const sidebarItemSchema = new mongoose.Schema({
    id:{
         type:Number,
         required:true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'shape', 'image','animatedText', 'sticker','campuselement'],
        required: true,
    },
    category: {
        type: String,
        enum: ['text', 'shape', 'image','animatedText', 'sticker','campuselement'],
        required: true,
    },
    shapeType: {
        type: String, // e.g., 'circle', 'square', 'triangle'
    },
    color: {
        type: String, // color code, e.g., '#ff7f50'
    },
    backgroundColor: {
         type:String,
    },
    imageUrl: {
        type: String, // URL for images and stickers
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
animationUrl: {
    type: String, // URL for animated text or GIFs if animated
},


}, { timestamps: true });

const SidebarItem = mongoose.model('SidebarItem', sidebarItemSchema);
module.exports = SidebarItem;
