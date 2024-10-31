import React, { useState, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';

// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const CanvasItem = ({ item, onSelectItem, updateItemProperties }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ELEMENT',
        item: { id: item.id, type: item.type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const renderContent = () => {
        switch (item.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => updateItemProperties(item.id, { name: e.target.value })}
                        style={{
                            fontSize: item.fontSize || 16,
                            width: item.size?.width || 'auto',
                            height: item.size?.height || 'auto',
                            color: item.color || '#000',
                            backgroundColor: item.backgroundColor || '#fff',
                            border: '1px solid #ddd',
                            padding: '4px',
                            borderRadius: '4px',
                        }}
                    />
                );
            case 'shape':
                const shapeStyle = {
                    width: item.size?.width || 50,
                    height: item.size?.height || 50,
                    backgroundColor: item.color,
                };
                if (item.shapeType === 'circle') shapeStyle.borderRadius = '50%';
                if (item.shapeType === 'triangle') {
                    return (
                        <div
                            style={{
                                width: '0px',
                                height: '0px',
                                borderLeft: `${item.size?.width / 2 || 25}px solid transparent`,
                                borderRight: `${item.size?.width / 2 || 25}px solid transparent`,
                                borderBottom: `${item.size?.height || 50}px solid ${item.color}`,
                            }}
                        />
                    );
                }
                return <div style={shapeStyle} />;
            case 'image':
                return (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                            width: item.size?.width || 50,
                            height: item.size?.height || 50,
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={drag}
            style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelectItem();
            }}
        >
            {renderContent()}
        </div>
    );
};

const CanvasArea = ({ elements, setElements, selectedItem, setSelectedItem, updateItemProperties }) => {
    const canvasRef = useRef(null);

    const handleSelectItem = (id) => {
        setSelectedItem(elements.find((item) => item.id === id));
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'ELEMENT',
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            if (!offset || !canvasRef.current) return;

            const canvasRect = canvasRef.current.getBoundingClientRect();
            const left = offset.x - canvasRect.left;
            const top = offset.y - canvasRect.top;

            setElements((prevItems) => {
                const existingItemIndex = prevItems.findIndex((el) => el.id === item.id);

                if (existingItemIndex > -1) {
                    // Update position if item already exists
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        left: Math.min(Math.max(0, left), canvasRect.width - 50),
                        top: Math.min(Math.max(0, top), canvasRect.height - 50),
                    };
                    return updatedItems;
                } else {
                    // Add new item if it doesn't exist
                    const newItem = {
                        ...item,
                        left: Math.min(Math.max(0, left), canvasRect.width - 50),
                        top: Math.min(Math.max(0, top), canvasRect.height - 50),
                        id: item.id || generateId(),
                    };
                    return [...prevItems, newItem];
                }
            });
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    drop(canvasRef);

    return (
        <div
            ref={canvasRef}
            style={{
                width: '100%',
                height: '500px',
                border: '2px dashed #ccc',
                position: 'relative',
                backgroundColor: isOver ? '#f0f8ff' : '#fff',
            }}
        >
            {elements.map((item) => (
                <CanvasItem
                    key={item.id}
                    item={item}
                    onSelectItem={() => handleSelectItem(item.id)}
                    updateItemProperties={updateItemProperties}
                />
            ))}
        </div>
    );
};

export default CanvasArea;






