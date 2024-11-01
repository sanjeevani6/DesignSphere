import React from 'react';

const PropertiesPanel = ({ selectedItem, updateItemProperties, onBackgroundColorChange, deleteItem }) => {
    const handleColorChange = (e) => {
        onBackgroundColorChange(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

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

    return (
        <div className='properties-pane'>
            <h3>Properties Panel</h3>
            {/* Background color option for canvas */}
            <div>
                <label>
                    Canvas Background Color:
                    <input
                        type="color"
                        onChange={handleColorChange}
                        defaultValue="#ffffff" // You might want to set this dynamically
                    />
                </label>
            </div>

            {/* Check if there's a selected item to display its properties */}
            {selectedItem ? (
                <>
                    {selectedItem.type === 'text' && (
                        <div>
                            <label>Text:</label>
                            <input
                                type="text"
                                name="name"
                                value={selectedItem.name}
                                onChange={handleChange}
                            />
                            <label>Font Type:</label>
                            <select
                                name="fontType"
                                value={selectedItem.fontType || 'Arial'}
                                onChange={handleChange}
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
                                onChange={handleChange}
                            />
                            <label>Text Color:</label>
                            <input
                                type="color"
                                name="color"
                                value={selectedItem.color || '#000000'}
                                onChange={handleChange}
                            />
                            <label>Background Color:</label>
                            <input
                                type="color"
                                name="backgroundColor"
                                value={selectedItem.backgroundColor || '#ffffff'}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {selectedItem.type === 'shape' && (
                        <div>
                            <label>Color:</label>
                            <input
                                type="color"
                                name="color"
                                value={selectedItem.color}
                                onChange={handleChange}
                            />
                            <label>Width:</label>
                            <input
                                type="number"
                                name="width"
                                value={selectedItem.size?.width || 50}
                                onChange={handleChange}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                name="height"
                                value={selectedItem.size?.height || 50}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {selectedItem.type === 'image' && (
                        <div>
                            <label>Image URL:</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={selectedItem.imageUrl}
                                onChange={handleChange}
                            />
                            <label>Width:</label>
                            <input
                                type="number"
                                name="width"
                                value={selectedItem.size?.width || 50}
                                onChange={handleChange}
                            />
                            <label>Height:</label>
                            <input
                                type="number"
                                name="height"
                                value={selectedItem.size?.height || 50}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                      {/* Delete button for the selected item */}
            <button onClick={() => deleteItem(selectedItem.id)}>Delete Item</button>
                </>
            ) : (
                <div className="empty-properties-panel">Select an item to view properties</div>
            )}
        </div>
    );
};

export default PropertiesPanel;


