// SidebarItem.js
import React ,{useEffect,useState}from 'react';
import { useDrag } from 'react-dnd';
import Lottie from 'lottie-react';
import socket from '../../socket'
import { useParams } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SidebarItem = ({ item }) => { 
    const teamCode=useParams()
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ELEMENT',
        item,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        if (item.type === 'animatedText') {
          let url = item.animationUrl; // The URL you want to fetch
      
          // Check if the URL is relative (doesn't start with 'http' or 'https')
          if (!/^https?:\/\//.test(url)) {
            url = `${BASE_URL}${url}`; // Prepend '/api/v1' to relative URLs
          }
      
          console.log("Fetching from URL:", url); // Log the full URL being fetched
      
          fetch(url)
            .then((response) => {
              console.log("response received:", response);
              return response.json();
            })
            .then((data) => {
              setAnimationData(data);
              console.log('animation data parsed:', data);
            })
            .catch((error) => console.error('❌ Error loading animation:', error));
        }
      }, [item.animationUrl, item.type]);
      
      

    // Dynamic styles based on item properties
    const baseStyle = {
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px 0',
        backgroundColor: '#ddd',
        borderRadius: '4px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        width: '100px',
    };

    const shapeStyle = {
        width: `${item.size.width || 40}px`,
        height: `${item.size.height || 40}px`,
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
                    borderLeft: `${(item.size.width || 40) / 2}px solid transparent`,
                    borderRight: `${(item.size.width || 40) / 2}px solid transparent`,
                    borderBottom: `${item.size.height || 40}px solid ${item.color}`,
                    marginRight: '8px',
                };
            case 'square':
            default:
                return shapeStyle;
        }
    };
     
    useEffect(() => {
        socket.on('itemDragged', (draggedItem) => {
            if (draggedItem.teamCode === teamCode && draggedItem.item.id !== item.id) {
                // Update item state (or canvas) for other users
                // You can modify this to update the canvas or trigger any other collaborative action
                console.log('Item dragged by another user:', draggedItem.item);
            }
        });

        // Clean up event listener on unmount
        return () => {
            socket.off('itemDragged');
        };
    }, [teamCode, item.id]);

    return (
        <div ref={drag} style={baseStyle}>

               {item.type === 'animatedText' && animationData ? (
                <Lottie
                    animationData={animationData}
                    style={{
                        width: `${item.size.width}px`,
                        height: `${item.size.height}px`,
                    }}
                    loop
                    autoplay
                />
            ):
                item.type === 'image' ? (
                <img
                    src={item.imageUrl}
                    alt={item.name||'uploaded image'}
                    style={{
                        width: `${item.size.width}px`,
                        height: `${item.size.height}px`,
                        marginRight: '8px',
                    }}
                />
        
            ):
            item.type === 'shape' ? (
                <div style={renderShape()} />
            ) : item.type === 'sticker' ? (
                <img
                    src={item.imageUrl}
                    alt={item.name || 'sticker'}
                    style={{
                        width: `${item.size?.width || 100}px`,
                        height: `${item.size?.height || 100}px`,
                        marginRight: '8px',
                        backgroundColor: 'transparent',
                    }}
                    
                />
               
           
     

            ):(
                <div
                    style={{
                        width: `${item.size.width || 80}px`,
                         height: `${item.size.height || 30}px`,
                        color: item.color,
                        backgroundColor: item.backgroundColor || '#f4f4f4',
                        marginRight: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                    }}
                >
                 
                </div>
            )}
        </div>
    );
};

export default SidebarItem;
