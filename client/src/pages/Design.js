// Design.js
import React, { useState,useContext } from 'react';
import Sidebar from '../components/DesignLayout/Sidebar';
import CanvasArea from '../components/DesignLayout/CanvasArea';
import PropertiesPanel from '../components/DesignLayout/PropertiesPanel';
import axios from 'axios';
import Header from '../components/Layouts/Header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { UserContext } from '../context/UserContext'; 
 
const Design = () => {
    const [elements, setElements] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#fff'); // Default background color
    const { currentUser } = useContext(UserContext); // Get current user from context
    console.log('Current User:', currentUser);
    //const currentUserId = currentUser ? currentUser.id : null; 
   
    const saveDesign = async () => {
        const title = prompt("Please enter a title for your design:");
    
        // Check if the user provided a title
        if (title) {
            try {
                

                // Sending the title, elements, and background color to the server
                await axios.post('designs/save', {
                    userId: currentUser?._id, 
                    title,
                    elements,
                    backgroundColor
                });
                console.log('Design saved:', { title, elements, backgroundColor });
            } catch (error) {
                console.error('Failed to save design', error);
            }
        } else {
            alert("Design not saved. Please provide a title");
        }
       
    };
    
    const deleteItem = (id) => {
        setElements((prevItems) => prevItems.filter(item => item.id !== id));
        setSelectedItem(null); // Optionally clear the selected item
    };
    const updateItemProperties = (id, updatedProperties) => {
        setElements((prevElements) =>
            prevElements.map((item) =>
                item.id === id ? { ...item, ...updatedProperties } : item
            )
        );
        if (selectedItem && selectedItem.id === id) {
            setSelectedItem((prev) => ({ ...prev, ...updatedProperties }));
        }
    };
    const handleBackgroundColorChange = (color) => {
        setBackgroundColor(color);
    };

    // Function to handle the image upload from Sidebar
    const handleImageUpload = (newImageItem) => {
        setElements((prevItems) => [...prevItems, newImageItem]);
    };
 

    return (
        <DndProvider backend={HTML5Backend}>
        <>
            <Header/>
            <div className="editor-container">
   <div className="sidebar"> <Sidebar setElements={setElements} /></div>
    <div className="main-content">
       <div  className="properties-panel" ><PropertiesPanel 
                               selectedItem={selectedItem}
                               updateItemProperties={updateItemProperties}
                               onBackgroundColorChange={handleBackgroundColorChange}
                               deleteItem={deleteItem}
       />

       </div> 
        <div className="canvas-container">
            <button onClick={saveDesign} className="save-button">Save Design</button>
            <CanvasArea elements={elements} 
                        setElements={setElements}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        updateItemProperties={updateItemProperties}
                        backgroundColor={backgroundColor}
                       
                        className="canvas-area" />
        </div>
    </div>
</div>

        </>
        </DndProvider>
    );
};


export default Design;