const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    title: String,
    description: String,
    filePath: String, // Relative path, e.g., '/uploads/templates/template1.png'
});

module.exports = mongoose.model('templates', templateSchema);
