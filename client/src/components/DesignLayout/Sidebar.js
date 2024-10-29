// Sidebar.js
import React from 'react';
import SidebarItem from './SidebarItem';
import { sidebarItems } from './itemData';

const Sidebar = () => {
    const textItems = sidebarItems.filter(item => item.category === 'text');
    const shapeItems = sidebarItems.filter(item => item.category === 'shape');
    const imageItems = sidebarItems.filter(item => item.category === 'image');

    return (
        <div style={{ width: '200px', padding: '16px', backgroundColor: '#f4f4f4' }}>
            {/* Text Section */}
            <div>
                <h3>Add Text</h3>
                {textItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>

            {/* Shapes Section */}
            <div>
                <h3>Shapes</h3>
                {shapeItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>

            {/* Images Section */}
            <div>
                <h3>Images</h3>
                {imageItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
