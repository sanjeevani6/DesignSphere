// controllers/sidebarController.js
const SidebarItem = require('../models/SidebarItem');

exports.getSidebarItems = async (req, res) => {
    try {
        const items = await SidebarItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sidebar items', error });
    }
};

