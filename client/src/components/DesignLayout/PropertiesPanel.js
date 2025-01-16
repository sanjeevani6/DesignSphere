import React ,{useState,useEffect}from 'react';

import socket from '../../socket';

const PropertiesPanel = ({ teamCode,selectedItem, updateItemProperties, onBackgroundColorChange, deleteItem }) => {
    const [fontSize, setFontSize] = useState(selectedItem?.fontSize || 16);
    // const [width, setWidth] = useState(selectedItem?.width || 16);
    const [color, setColor] = useState(selectedItem?.color || '#000000');
    const [backgroundColor, setBackgroundColor] = useState(selectedItem?.backgroundColor || '#ffffff');
    const [fontFamily, setFontFamily] = useState(selectedItem?.fontType || 'Arial');



    // Update properties in socket event
    const handlePropertyChange = (name, value) => {
        if (selectedItem) {
            socket.emit('updateDesignProperties', {
                teamCode,
                properties: {
                    elements: [
                        {
                            ...selectedItem,
                            [name]: value,
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                },
            });

            updateItemProperties(selectedItem.id, { [name]: value });
        }
    };


    // Handle background color change specifically for the canvas
    const handleCanvasBackgroundColorChange = (e) => {
        const newCanvasBackgroundColor = e.target.value;
        setBackgroundColor(newCanvasBackgroundColor);
        if (onBackgroundColorChange) {
            onBackgroundColorChange(newCanvasBackgroundColor);
        }

        // Emit socket event specifically for canvas background update
        socket.emit('updateDesignProperties', {
            teamCode,
            properties: {
                backgroundColor: newCanvasBackgroundColor,
            },
        });
    };



    const handleFontSizeChange = (e) => {
        const newFontSize = parseInt(e.target.value, 10);
        setFontSize(newFontSize);
        handlePropertyChange('fontSize', newFontSize);
    };

    const handleFontFamilyChange = (e) => {
        const newFontFamily = e.target.value;
        setFontFamily(newFontFamily);
        handlePropertyChange('fontType', newFontFamily);
    };


    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setColor(newColor);
        handlePropertyChange('color', newColor);
    };
    
    
    // const handleChangeWidth = (e) => {
    //     const newWidth = parseInt(e.target.value, 10);
    //     // if (selectedItem) {
    //     //     updateItemProperties(selectedItem.id, { size: { ...selectedItem.size, width: newWidth } });
    //     // }
    //     setWidth(newWidth);
    //     handlePropertyChange('width', newWidth);
    
    // };
    const handleChangeWidth = (e) => {
        const newWidth = parseInt(e.target.value, 10);
        if (selectedItem && selectedItem.size) {
            const updatedSize = { ...selectedItem.size, width: newWidth };
    
            // Update locally
            updateItemProperties(selectedItem.id, { size: updatedSize });
    
            // Emit socket update
            socket.emit('updateDesignProperties', {
                teamCode,
                properties: {
                    elements: [
                        {
                            ...selectedItem,
                            size: updatedSize,
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                }
                });
            
    
            console.log('Width updated:', updatedSize);
        }
    };


    const handleBackgroundColorChange = (e) => {
        const newItemBackgroundColor = e.target.value;
        if (selectedItem) {
            handlePropertyChange('backgroundColor', newItemBackgroundColor);
        }
    };

    const handleChangeHeight = (e) => {
        const newHeight = parseInt(e.target.value, 10);
        if (selectedItem && selectedItem.size) {
            const updatedSize = { ...selectedItem.size, height: newHeight };
    
            // Update locally
            updateItemProperties(selectedItem.id, { size: updatedSize });
    
            // Emit socket update
            socket.emit('updateDesignProperties', {
                teamCode,
                properties: {
                    elements: [
                        {
                            ...selectedItem,
                            size: updatedSize,
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                }
            });
         
            
    
            console.log('Height updated:', updatedSize);
        }
    };
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!selectedItem) return;
        
        // Check if width or height is being changed
        if (name === 'width' || name === 'height') {
            // Update the size property directly
            updateItemProperties(selectedItem.id, {
                size: { ...selectedItem.size, [name]: parseInt(value) }
            });
        } else if (name === 'fontSize') {
            // Update fontSize property directly
            updateItemProperties(selectedItem.id, { fontSize: parseInt(value) });
        } else {
            // Update other properties
            updateItemProperties(selectedItem.id, { [name]: value });
        }
       
    };

    useEffect(() => {
        // Sync properties with the selected item when it changes
        if (selectedItem) {
            setFontSize(selectedItem.fontSize || 16);
            setColor(selectedItem.color || '#000000');
           
            setBackgroundColor(selectedItem.backgroundColor || '#ffffff');
            setFontFamily(selectedItem.fontType || 'Arial');
        }
    }, [selectedItem]);

    return (
        <div className='properties-pane'>
            <h3>Properties Panel</h3>
            {/* Background color option for canvas */}
            <div className="canvas-background">
                <label>
                    Canvas Background Color:
                    <input
                        type="color"
                        onChange={handleCanvasBackgroundColorChange}
                        value={backgroundColor}
                        defaultValue="#ffffff" // You might want to set this dynamically
                    />
                </label>
            </div>

            {/* Check if there's a selected item to display its properties */}
            {selectedItem ? (
                <>
                    {selectedItem.type === 'text' && (
                        <div className="property-row">
                            <label>Text:</label>
                            <input
                                type="text"
                                name="name"
                                value={selectedItem.name}
                                onChange={handleChange}
                                /*If you wrote onChange={handleChange()}, it would immediately call handleChange() when the component renders rather than waiting for an onChange even*/
                            />
                            <label>Font Type:</label>
                            <select
                                name="fontType"
                                value={selectedItem.fontType || 'Arial'}
                                onChange={handleFontFamilyChange}
                            >
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Tahoma">Tahoma</option>
                                <option value="Impact">Impact</option>
                                <option value="Comic Sans MS">Comic Sans MS</option>
                                <option value="Palatino">Palatino</option>
                                <option value="Garamond">Garamond</option>
                                <option value="Bookman">Bookman</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                                <option value="Lucida Sans">Lucida Sans</option>
                                <option value="Brush Script MT">Brush Script MT</option>
                                <option value="Century Gothic">Century Gothic</option>
                                <option value="Lucida Handwriting">Lucida Handwriting</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Bodoni MT">Bodoni MT</option>
                                <option value="Didot">Didot</option>
                                <option value="Rockwell">Rockwell</option>
                                <option value="Copperplate">Copperplate</option>
                                <option value="Futura">Futura</option>
                                <option value="Gill Sans">Gill Sans</option>
                            </select>
                            <label>Font Size:</label>
                            <input
                                type="number"
                                name="fontSize"
                                value={selectedItem.fontSize || 16}
                                onChange={handleFontSizeChange}
                                min={1}
                            />
                            <label>Text Color:</label>
                            <input
                                type="color"
                                name="color"
                                value={selectedItem.color || '#000000'}
                                onChange={handleColorChange}
                            />
                            <label>Background Color:</label>
                            <input
                                type="color"
                                name="backgroundColor"
                                value={selectedItem.backgroundColor || '#ffffff'}
                                onChange={handleBackgroundColorChange}
                            />
                        </div>
                    )}

                    {selectedItem.type === 'shape' && (
                        <div className="property-row">
                            <label>Color:</label>
                            <input
                                type="color"
                                name="color"
                                value={selectedItem.color}
                               // onChange={handleChange}
                                onChange={(e) => handlePropertyChange('color', e.target.value)}
                            />
                            <label>Width:</label>
                            <input
                                type="number"
                                name="width"
                                value={selectedItem.size?.width || 50}
                                onChange={handleChangeWidth}
                                min={1}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                name="height"
                                value={selectedItem.size?.height || 50}
                                onChange={handleChangeHeight}
                                min={1}
                            />
                        </div>
                    )}

                    {selectedItem.type === 'image' && (
                        <div className="property-row">
                          
                            <label>Width:</label>
                            <input
                                type="number"
                                name="width"
                                value={selectedItem.size?.width || 50}
                                onChange={handleChangeWidth}
                                min={1}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                name="height"
                                value={selectedItem.size?.height || 50}
                                onChange={handleChangeHeight}
                                min={1}
                            />
                        </div>
                    )}
                      {/* Delete button for the selected item */}
            <button  className="delete-button" onClick={() => deleteItem(selectedItem.id)} 
                       
                       >Delete Item</button>
                </>
            ) : (
                <div className="empty-properties-panel">Select an item to view properties</div>
            )}
        </div>
    );
};

export default PropertiesPanel;


