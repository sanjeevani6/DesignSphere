// models/Template.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    filePath: { type: String, required: true }, // path to the template file
    createdAt: { type: Date, default: Date.now },
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
