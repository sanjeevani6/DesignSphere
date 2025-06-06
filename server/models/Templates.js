const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    title: String,
    description: String,
    filePath: String, 
});

module.exports = mongoose.model('templates', templateSchema);
