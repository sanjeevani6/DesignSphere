// Sidebar.js
import React ,{useState,useEffect}from 'react';
import SidebarItem from './SidebarItem';
//import { sidebarItems } from './itemData';

const Sidebar = () => {
    const [sidebarItems, setSidebarItems] = useState([]);

    // Fetch sidebar items from the backend API
    useEffect(() => {
        const fetchSidebarItems = async () => {
            try {
                const response = await fetch('/designpage/get-sidebar-items'); // Adjust if your backend is on a different domain
                const data = await response.json();
                setSidebarItems(data);
            } catch (error) {
                console.error('Error fetching sidebar items:', error);
            }
        };

        fetchSidebarItems();
    }, []);

    // Separate items by category
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
