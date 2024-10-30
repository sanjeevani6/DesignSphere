// PropertiesPanel.js
import React from 'react';

const PropertiesPanel = ({ selectedItem, updateItemProperties }) => {
    if (!selectedItem) {
        return <div className="empty-properties-panel">Select an item to view properties</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Check if width or height is being changed
        if (name === 'width' || name === 'height') {
            // Update the size property directly
            updateItemProperties(selectedItem.id, {
                size: { ...selectedItem.size, [name]: parseInt(value) }
            });
        } else {
            // Update other properties
            updateItemProperties(selectedItem.id, { [name]: value });
        }
    };

    return (
        <div className='properties-pane'>
            <h3>Properties Panel</h3>

            {selectedItem.type === 'text' && (
                <div>
                    <label>Text:</label>
                    <input
                        type="text"
                        name="name"
                        value={selectedItem.name}
                        onChange={handleChange}
                    />
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
                    <label>Width:</label>
                    <input
                        type="number"
                        name="width"
                        value={selectedItem.size?.width || 100}
                        onChange={handleChange}
                    />
                    <label>Height:</label>
                    <input
                        type="number"
                        name="height"
                        value={selectedItem.size?.height || 30}
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
        </div>
    );
};

export default PropertiesPanel;

