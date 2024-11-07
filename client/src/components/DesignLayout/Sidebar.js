// Sidebar.js
import React, { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import axios from 'axios';
 
//import { sidebarItems } from './itemData';
// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);


const Sidebar = ({ setElements }) => {
    const [sidebarItems, setSidebarItems] = useState([]);

    //handle image upload:
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            //const imageUrl = URL.createObjectURL(file);
           // console.log(imageUrl); // Check this in the console
            const formData = new FormData();
            formData.append('image', file);
    
            try {
                // Upload the image to the server and get the URL
                const response = await axios.post('/designpage/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("URL",response.data.url);
               const imageUrl = '/' + (response.data.url).replace(/\\/g, '/');// Adjust according to your response structure
               console.log("URL updated",imageUrl);
                const newImageItem = {
                    name:'uploaded image',
                    id: generateId(),
                    type: 'image',
                    category: 'image', 
                    imageUrl: imageUrl, // Use the permanent URL
                    size: { width: 100, height: 100 }, // Default size
                    top: 50,
                    left: 50,
                };
                // Instead of adding to sidebar, add directly to canvas
                setElements((prevItems) => [...prevItems, newImageItem]); // Add to canvas directly
            } catch (error) {
                console.error('Error uploading image:', error);
            }


          
   
        }
    };


    // Fetch sidebar items from the backend API
    useEffect(() => {
        const fetchSidebarItems = async () => {
            try {
                const response = await fetch('/designpage/get-sidebar-items'); // Adjust if your backend is on a different domain
                const data = await response.json();
                console.log('sidebar items',data)
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
    const artelementsItems = sidebarItems.filter(item => item.category === 'campuselement');
    const animatedTextItems = sidebarItems.filter(item => item.category === 'animatedText');
    const stickerItems = sidebarItems.filter(item => item.category === 'sticker');

    return (
        <div style={{ width: '200px', padding: '16px', backgroundColor: '#f4f4f4' }}>

         {/*  campus art element library Section */}
         <div className="sidebar-section">
                <h3>Campus Arts Element</h3>
                <div className="sidebar-list">
                {artelementsItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
                </div>
            </div>

            {/* Text Section */}
            <div className="sidebar-section">
                <h3>Add Text</h3>
                <div className="sidebar-list">
                {textItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
                </div>
            </div>

            {/* Shapes Section */}
            <div className="sidebar-section">
                <h3>Shapes</h3>
                <div className="sidebar-list">
                {shapeItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
                </div>
            </div>

         
          { /*animated section*/}
            <div className="sidebar-section">
            <h3>Animated Text</h3>
            <div className="sidebar-list">
                
                {animatedTextItems.map(item => <SidebarItem key={item.id} item={item} />)}
            </div>
            </div>


            <div className="sidebar-section">
            <h3>Stickers</h3>
            <div className="sidebar-list">
               
                {stickerItems.map(item => <SidebarItem key={item.id} item={item} />)}
            </div>
            </div>

             {/* Image upload section*/}
            <div className="sidebar-section">
                <h3>Upload Image</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

        </div>
    );
};

export default Sidebar;
