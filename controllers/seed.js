// backend/seed.js
const mongoose = require('mongoose');
const Template = require('../models/Template');
const path = require('path');
const fs = require('fs');
const connectDB =require('../config/connectDb');



const seedTemplates = async () => {
    const templateDir = path.join(__dirname, '..','client','Templates'); // Adjust this path
    const categories = fs.readdirSync(templateDir); // Read categories

    for (const category of categories) {
        const categoryPath = path.join(templateDir, category);
        const files = fs.readdirSync(categoryPath); // Read files in each category

        for (const file of files) {
            const filePath = path.join(categoryPath, file);
            const template = new Template({
                title: file, // Or you can set a more descriptive title
                description: `Template for ${category}`, // Add a description
                category: category,
                filePath: filePath, // Path to the template file
            });

            await template.save();
            console.log(`Saved template: ${file}`);
        }
    }
};

const run = async () => {
    try {
        await connectDB(); // Connect to the database
        await seedTemplates(); // Seed the templates
    } catch (error) {
        console.error("Error running the seed script:", error);
    } finally {
        mongoose.connection.close(); // Ensure the connection is closed
    }
};

run();
