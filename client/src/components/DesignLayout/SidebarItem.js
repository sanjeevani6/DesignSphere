// SidebarItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

const SidebarItem = ({ item }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CANVAS_ITEM',
        item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    // Styles for shapes
    const shapeStyle = {
        width: '40px',
        height: '40px',
        backgroundColor: item.color,
        marginRight: '8px',
    };

    const renderShape = () => {
        switch (item.shapeType) {
            case 'circle':
                return { ...shapeStyle, borderRadius: '50%' };
            case 'triangle':
                return {
                    width: '0px',
                    height: '0px',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderBottom: `30px solid ${item.color}`,
                };
            case 'square':
            default:
                return shapeStyle;
        }
    };

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                padding: '8px',
                margin: '4px 0',
                backgroundColor: '#ddd',
                borderRadius: '4px',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                width:'100px',
            }}
        >
            {item.type === 'image' ? (
                <img src={item.imageUrl} alt={item.name} style={{ width: '70px', height: '60px', marginRight: '8px' }}/>
            ) : item.type === 'shape' ? (
                <div style={renderShape()} />
            ) : (
                <div style={{ width: '80px', height: '30px', backgroundColor: '#f4f4f4', marginRight: '8px' }}></div> // Placeholder for text box
            )}
            
        </div>
    );
};

export default SidebarItem;
