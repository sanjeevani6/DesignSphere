import React, { useState, useRef, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';

// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const CanvasItem = ({ item, onDropItem }) => {
    const [text, setText] = useState(item.name);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ELEMENT',
        item: { id: item.id, name: text, type: item.type },
        end: (droppedItem, monitor) => {
            if (monitor.didDrop()) {
                const offset = monitor.getClientOffset();
                if (offset) {
                    onDropItem(item.id, offset);
                }
            }
        },
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
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{
                            border: '1px solid #ddd',
                            padding: '4px',
                            borderRadius: '4px',
                        }}
                    />
                );
            case 'shape':
                const shapeStyle = {
                    width: '50px',
                    height: '50px',
                    backgroundColor: item.color,
                };
                if (item.shapeType === 'circle') shapeStyle.borderRadius = '50%';
                if (item.shapeType === 'triangle') {
                    return (
                        <div
                            style={{
                                width: '0px',
                                height: '0px',
                                borderLeft: '25px solid transparent',
                                borderRight: '25px solid transparent',
                                borderBottom: `50px solid ${item.color}`,
                            }}
                        />
                    );
                }
                return <div style={shapeStyle} />;
            case 'image':
                return <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px' }} />;
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
        >
            {renderContent()}
        </div>
    );
};

const CanvasArea = () => {
    const [canvasItems, setCanvasItems] = useState([]);
    const canvasRef = useRef(null);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ['ELEMENT', 'CANVAS_ITEM'],
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            if (!offset) return;

            const canvasRect = canvasRef.current.getBoundingClientRect();
            const left = offset.x - canvasRect.left;
            const top = offset.y - canvasRect.top;

            const existingItemIndex = canvasItems.findIndex((canvasItem) => canvasItem.id === item.id);

            if (existingItemIndex > -1) {
                setCanvasItems((prevItems) => {
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        left: Math.min(Math.max(0, left), canvasRect.width - 50),
                        top: Math.min(Math.max(0, top), canvasRect.height - 50),
                    };
                    return updatedItems;
                });
            } else {
                const newItem = {
                    ...item,
                    left: Math.min(Math.max(0, left), canvasRect.width - 50),
                    top: Math.min(Math.max(0, top), canvasRect.height - 50),
                    id: item.id || generateId(),
                };

                setCanvasItems((prevItems) => [...prevItems, newItem]);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    useEffect(() => {
        if (canvasRef.current) {
            drop(canvasRef);
        }
    }, [drop]);

    const handleDropItem = (id, offset) => {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const left = offset.x - canvasRect.left;
        const top = offset.y - canvasRect.top;

        setCanvasItems((prevItems) => {
            return prevItems.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          left: Math.min(Math.max(0, left), canvasRect.width - 50),
                          top: Math.min(Math.max(0, top), canvasRect.height - 50),
                      }
                    : item
            );
        });
    };

    return (
        <div
            ref={(node) => {
                canvasRef.current = node;
                drop(node);
            }}
            style={{
                width: '100%',
                height: '500px',
                border: '2px dashed #ccc',
                position: 'relative',
                backgroundColor: isOver ? '#f0f8ff' : '#fff',
            }}
        >
            {canvasItems.map((item) => (
                <CanvasItem key={item.id} item={item} onDropItem={handleDropItem} />
            ))}
        </div>
    );
};

export default CanvasArea;





