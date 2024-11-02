// Sidebar.js
import React, { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
//import { sidebarItems } from './itemData';
// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);


const Sidebar = ({ onImageUpload }) => {
    const [sidebarItems, setSidebarItems] = useState([]);

    //handle image upload:
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            console.log(imageUrl); // Check this in the console

            const newImageItem = {
                id: generateId(),
                type: 'image',
                imageUrl:imageUrl,
                size: { width: 100, height: 100 }, // default size
                top: 50,
                left: 50,
            };
            onImageUpload(newImageItem); // Call the handler to add the image to the canvas
        }
    };


    // Fetch sidebar items from the backend API
    useEffect(() => {
        const fetchSidebarItems = async () => {
            try {
                const response = await fetch('/designpage/get-sidebar-items'); // Adjust if your backend is on a different domain
                const data = await response.json();
                setSidebarItems(data);
            } catch (error) {
                console.error('Error fetching sidebar items:', error);
            }
        };

        fetchSidebarItems();
    }, []);

    // Separate items by category
    const textItems = sidebarItems.filter(item => item.category === 'text');
    const shapeItems = sidebarItems.filter(item => item.category === 'shape');
    const imageItems = sidebarItems.filter(item => item.category === 'image');

    return (
        <div style={{ width: '200px', padding: '16px', backgroundColor: '#f4f4f4' }}>
            {/* Text Section */}
            <div>
                <h3>Add Text</h3>
                {textItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>

            {/* Shapes Section */}
            <div>
                <h3>Shapes</h3>
                {shapeItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>

            {/* Images Section */}
            <div>
                <h3>Images</h3>
                {imageItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>
             {/* Image upload section*/}
            <div>
                <h3>Upload Image</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

        </div>
    );
};

export default Sidebar;
