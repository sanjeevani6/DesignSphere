import React, { useEffect,useState, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Resizable } from 'react-resizable';
 
// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const CanvasItem = ({ item, onSelectItem, updateItemProperties }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ELEMENT',
        item: { id: item.id, type: item.type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: () => !isResizing, // Prevent dragging when resizing
    }));

    const handleTextClick = () => {
        setIsEditing(true); // Switch to edit mode
    };

    const handleBlur = () => {
        setIsEditing(false); // Exit edit mode when input loses focus
    };

    const handleResizeStart = (event) => {
        setIsResizing(true);
    event.stopPropagation(); // Prevent event from bubbling up
    };

    const handleResizeStop = () => {
        setIsResizing(false);
    };
    
   
    const handleResize = (event, { size }) => {
        console.log('Resizing to:', size);
        updateItemProperties(item.id, { size });

    };
  
    const renderContent = () => {
        switch (item.type) {
            case 'text':
                return isEditing ? (
                    <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => updateItemProperties(item.id, { name: e.target.value })}
                        onBlur={handleBlur} // Exit edit mode on blur
                        autoFocus
                        style={{
                            fontSize: item.fontSize || 16,
                            fontFamily: item.fontType || 'Arial',
                            width: item.size?.width || 'auto',
                            height: item.size?.height || 'auto',
                            color: item.color || '#000',
                            backgroundColor:' transparent',
                            border: 'none',
                            padding: '4px',
                            borderRadius: '4px',
                           // outline: 'none', // Remove the outline for a clean look
                        }}
                    />
                ):(
                    <span
                        onClick={handleTextClick}
                        style={{
                            fontSize: item.fontSize || 16,
                            backgroundColor: item.backgroundColor || '#fff', // Background color
                            color: item.color || '#000',
                            fontFamily: item.fontType || 'Arial',
                            cursor: 'text',
                            padding: '4px',
                            display: 'inline-block', // Ensures width adjusts based on content
                        }}
                    >
                        {item.name}
                    </span>
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
                    <Resizable
                    width={item.size?.width || 100}
                    height={item.size?.height || 100}
                    onResizeStart={handleResizeStart} // Prevent default on resize start
                    onResize={handleResize}
                    onResizeStop={handleResizeStop}
                    resizeHandles={['se']}
                    minConstraints={[50, 50]} // Add minimum constraints if necessary
                    handle={
                            <span className="resize-handle" style={{ backgroundColor: 'transparent', cursor: 'se-resize', position: 'absolute', right: 0, bottom: 0, width: '20px', height: '20px' }}>
                                +
                            </span>
                        }
                >
                    <div style={{ width: '100%', height: '100%' }}>
                        <img
                            src={item.imageUrl}
                            alt={item.name || 'Uploaded Image'}
                            style={{
                                width: item.size?.width || 'auto',
                                height: item.size?.height || 'auto',
                               
                                objectFit: 'cover',  // Keeps the image aspect ratio intact
                            }}
                        />
                    </div>
                </Resizable>
                
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
                border: isResizing ? '2px dashed #000' : 'none', // Optional visual indicator for resizing
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

const CanvasArea = ({ elements, setElements, selectedItem, setSelectedItem, updateItemProperties, backgroundColor,backgroundImage}) => {
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
       /* collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),*/
    }));

    drop(canvasRef);

    return (
        <div
            ref={canvasRef}
            style={{
                width: '100%',
                height: '500px',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '2px dashed #ccc',
                position: 'relative',
                backgroundColor: backgroundColor || '#fff', // Use the passed background color
                overflow:'hidden',
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






