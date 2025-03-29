import React,{ useState, useEffect} from 'react';
import socket from '../../socket';
import {
   
    Typography
  } from '@mui/material';
const manualFonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New']; // Fallback fonts


const PropertiesPanel = ({ teamCode,selectedItem, updateItemProperties, onBackgroundColorChange, deleteItem }) => {
    const [fontSize, setFontSize] = useState(selectedItem?.fontSize || 16);
    // const [width, setWidth] = useState(selectedItem?.width || 16);
    const [color, setColor] = useState(selectedItem?.color || '#000000');
    const [backgroundColor, setBackgroundColor] = useState(selectedItem?.backgroundColor || '#ffffff');
    const [fontFamily, setFontFamily] = useState(selectedItem?.fontType || 'Arial');
    const [fonts, setFonts] = useState([...manualFonts]);// Initialize with manual fonts


    // Fetch Google Fonts dynamically 
    useEffect(() => {
        const API_KEY =  process.env.REACT_APP_API_KEY;
        console.log("API Key:", process.env.REACT_APP_API_KEY);
 
        if (!API_KEY) {
            console.error("Google Fonts API key is missing in .env file");
            return;
        }
        const API_URL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`;

        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                if (data.items) {
                    setFonts([...manualFonts, ...data.items.map(font => font.family)]);
                } else {
                    console.warn("No fonts found in Google Fonts API response");
                }
            })
            .catch((error) => console.error("Error fetching fonts:", error));
    }, []);

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



    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setColor(newColor);
        handlePropertyChange('color', newColor);
    };
    
    const handleFontFamilyChange = (e) => {
        const newFontFamily = e.target.value;
        setFontFamily(newFontFamily);
        handlePropertyChange("fontType", newFontFamily);

        // Dynamically load the selected font from Google Fonts
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${newFontFamily.replace(/ /g, "+")}&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
    };
  
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
            <Typography 
                variant="h4" 
                sx={{ 
                    paddingTop: "20px", 
                    textAlign:'center',
                    flexGrow: 1,
                    fontWeight: "bold",
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > PropertiesPanel
            </Typography>
            {/* Background color option for canvas */}
            <div className="canvas-background">
                <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography 
                variant="h6" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > CanvasBackgroundColor :
            </Typography>
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
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   paddingRight:"5px",
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            >Text:
            </Typography></label>
                            <input
                                type="text"
                                name="name"
                                value={selectedItem.name}
                                onChange={handleChange}
                                style={{ width: "150px" }}
                                /*If you wrote onChange={handleChange()}, it would immediately call handleChange() when the component renders rather than waiting for an onChange even*/
                            />
                            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > Font Type:
            </Typography></label>
                            <select name="fontType" value={fontFamily} onChange={handleFontFamilyChange}>
                                {fonts.map(font => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                ))}
                            </select>
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > Font Size:
            </Typography></label>
                            <input
                                type="number"
                                name="fontSize"
                                value={selectedItem.fontSize || 16}
                                onChange={handleFontSizeChange}
                                min={1}
                            />
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > Text Color:
            </Typography></label>
            <div style={{ width: "50px",height:"25px", overflow: "hidden",borderRadius:"4px" }}>
    <input
        type="color"
        name="color"
        value={selectedItem.color || '#000000'}
        onChange={handleColorChange}
      
    />
</div>

                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > Background Color:
            </Typography></label>
            <div style={{ width: "50px",height:"25px", overflow: "hidden",borderRadius:"4px" }}>
            <input
                                type="color"
                                name="backgroundColor"
                                value={selectedItem.backgroundColor || '#ffffff'}
                                onChange={handleBackgroundColorChange}
                            />
</div>

                        
                        </div>
                    )}

                    {selectedItem.type === 'shape' && (
                        <div className="property-row">
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            >Color:
            </Typography></label>
            <div style={{ width: "50px",height:"25px", overflow: "hidden",borderRadius:"4px" }}>
            <input
                                type="color"
                                name="color"
                                value={selectedItem.color}
                               // onChange={handleChange}
                                onChange={(e) => handlePropertyChange('color', e.target.value)}
                            />
</div>
                           
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > Width:
            </Typography></label>
                            <input
                                type="number"
                                name="width"
                                value={selectedItem.size?.width || 50}
                                onChange={handleChangeWidth}
                                min={1}
                            />
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > Height:
            </Typography></label>
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
                          
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            > Width:
            </Typography></label>
                            <input
                                type="number"
                                name="width"
                                value={selectedItem.size?.width || 50}
                                onChange={handleChangeWidth}
                                min={1}
                            />
                            <label><Typography 
                variant="h7" 
                sx={{ 
                    paddingTop: "1px", 
                   
                   
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "#593125",
                   
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  
                }}
            >Height:
            </Typography></label>
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
                       
                       ><Typography 
                       variant="h6" 
                       sx={{ 
                           paddingTop: "1px", 
                          
                          
                           fontFamily: "'Chewy', cursive",
                           letterSpacing: "2px",
                           color: "#593125",
                          
                           textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                         
                       }}
                   > Delete Item
                   </Typography></button>
                </>
            ) : (
                <div className="empty-properties-panel">Select an item to view properties</div>
            )}
        </div>
    );
};

export default PropertiesPanel;


