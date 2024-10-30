// Design.js
import React, { useState } from 'react';
import Sidebar from '../components/DesignLayout/Sidebar';
import CanvasArea from '../components/DesignLayout/CanvasArea';
import PropertiesPanel from '../components/DesignLayout/PropertiesPanel';
import axios from 'axios';
import Header from '../components/Layouts/Header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Design = () => {
    const [elements, setElements] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const saveDesign = async () => {
      /*  try {
            await axios.post('/api/designs/save', { elements });
        } catch (error) {
            console.error('Failed to save design', error);
        }*/
       console.log('Design saved:', elements);
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

    return (
        <DndProvider backend={HTML5Backend}>
        <>
            <Header/>
            <div className="editor-container">
   <div className="sidebar"> <Sidebar/></div>
    <div className="main-content">
       <div  className="properties-panel" ><PropertiesPanel 
                               selectedItem={selectedItem}
                               updateItemProperties={updateItemProperties}
       />

       </div> 
        <div className="canvas-container">
            <button onClick={saveDesign} className="save-button">Save Design</button>
            <CanvasArea elements={elements} 
                        setElements={setElements}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        updateItemProperties={updateItemProperties}
                        className="canvas-area" />
        </div>
    </div>
</div>

        </>
        </DndProvider>
    );
};


export default Design;