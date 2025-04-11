import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import socket from '../../socket'; // Assuming socket.io instance is set up correctly
import { Resizable } from 'react-resizable';
import Lottie from 'lottie-react'; 

// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);
const { id: socketId } = socket||{}; // Get the socket's unique ID

const CanvasItem = ({ teamCode, item, onSelectItem, updateItemProperties,lockItem, 
    unlockItem  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [animationData, setAnimationData] = useState(null);
    const [updatedText,setUpdatedText] = useState(item.name);
    const [lockedItems, setLockedItems] = useState({});


    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ELEMENT',
        item: { id: item.id, type: item.type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: () => !isResizing && (!item.lockedBy || item.lockedBy === socket.id), // Prevent dragging when resizing
    }));

    useEffect(() => {
        if (item.type === 'animatedText' && item.animationUrl) {
          // Check if the URL is relative (doesn't start with 'http' or 'https')
          let url = item.animationUrl;
          if (!/^https?:\/\//.test(url)) {
            url = `/api/v1${url}`; // Prepend '/api/v1' to relative URLs
          }
      
          console.log("Fetching from URL:", url); // Log the full URL being fetched
      
          fetch(url)
            .then((response) => response.json())
            .then((data) => setAnimationData(data))
            .catch((error) => console.error('Error loading animation:', error));
        }
      }, [item.animationUrl, item.type]);
      

    

    const handleLockItem = () => {
        if (item.lockedBy === socketId) {
            updateItemProperties(item.id, { lockedBy: null });
            //socket.emit('updateDesign', { teamCode, updatedItem: { id: item.id, lockedBy: null } });
            socket.emit('unlockItem', { teamCode, itemId: item.id });
        } else  if (!item.lockedBy)  {
            updateItemProperties(item.id, { lockedBy: socketId });
          //  socket.emit('updateDesign', { teamCode, updatedItem: { id: item.id, lockedBy: socketId } });
          socket.emit('lockItem', { teamCode, itemId: item.id, lockedBy: socketId });
        } else {
            console.warn('Item is already locked by another user.');
        }
    };

    const handleLockToggle = () => {
        if (!item.lockedBy) {
            lockItem(item.id); // Lock the item if it's not already locked
            socket.emit('lockItem',{ teamCode, itemId: item.id, lockedBy: socketId })
        } else if (item.lockedBy === socket.id) {
            unlockItem(item.id); // Unlock it if locked by this client
            socket.emit('unlockItem',{ teamCode, itemId: item.id })
        } else {
            alert('Item is locked by another user.');
        }
    };

    

    const handleTextClick = () => {
       // e.stopPropagation();
        setIsEditing(true); // Switch to edit mode
        lockItem(item.id);
        const updatedItem = { ...item, lockedBy: socket.id };
    updateItemProperties(item.id, { lockedBy: socket.id });
    socket.emit('updateDesign', { teamCode, updatedItem });

    }
    const handleBlur = () => {
        setIsEditing(false); // Exit edit mode
        //Emit the updated text item to the server after editing
     
    if (item.name !== updatedText) {
        const updatedItem = { ...item,lockedBy:null, name: updatedText }; // Ensure the text is updated correctly
        updateItemProperties(item.id, {lockedBy: null ,name: updatedText} ); // Update local state
        socket.emit('updateDesign', { teamCode, updatedItem }); // Emit the updated item to other clients
        unlockItem(item.id);
    }
};


const handleTextChange = (e) => {
    const updatedText = e.target.value;
    setUpdatedText(updatedText); // Update the local state for the text box
};

    const handleResizeStart = (event) => {
        
        setIsResizing(true);
        event.stopPropagation(); // Prevent event from bubbling up
    };

    const handleResizeStop = () => setIsResizing(false);

    const handleResize = (event, { size }) => {
        console.log('Resizing to:', size);
        if (item.lockedBy && item.lockedBy !== socket.id) return; // Prevent resize by unauthorized users
        updateItemProperties(item.id, { size });
         // Emit the resize change to the server
         socket.emit('itemResize', { teamCode, itemId: item.id, size });

    };
    
    console.log("item.lockedBy",item.lockedBy)

   

    const renderContent = () => {
        switch (item.type) {
            case 'text':
                return isEditing ? (
                    <input
                        type="text"
                        value={updatedText || ""}
                        onChange={(e) => setUpdatedText(e.target.value)}
                        //onChange={(e) => updateItemProperties(item.id, { name: e.target.value })}
                       // onChange={handleTextChange} // Update the local text
                        onBlur={handleBlur}
                        autoFocus
                        onFocus={() => lockItem(item.id)}
                        style={{
                            fontSize: item.fontSize || 16,
                            fontFamily: item.fontType || 'Arial',
                            width: item.size?.width || 'auto',
                            height: item.size?.height || 'auto',
                            color: item.color || '#000',
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '4px',
                            borderRadius: '4px',
                        }}
                    />
                ) : (
                    <span
                       // onClick={handleTextClick}
                       onClick={() => setIsEditing(true)}
                        style={{
                            fontSize: item.fontSize || 16,
                           // onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))};
                            backgroundColor: item.backgroundColor || '#fff',
                            color: item.color || '#000',
                            fontFamily: item.fontType || 'Arial',
                            cursor: 'text',
                            padding: '4px',
                            display: 'inline-block',
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
                  
                    case 'sticker':
                        // Example handling for a sticker
                        return (
                            <img
                                src={item.imageUrl}  // URL or path to the sticker image
                                alt="Sticker"
                                style={{
                                    width: item.size?.width || 100,
                                    height: item.size?.height || 100,
                                    objectFit: 'contain',
                                }}
                            />
                        );
            
            case 'animatedText':
                return animationData ? (
                    <Lottie
                        animationData={animationData}
                        loop
                        autoplay
                        style={{
                            width: item.size?.width || 100,
                            height: item.size?.height || 100,
                        }}
                    />
                ) : (
                    <div>Loading...</div>
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
                opacity: isDragging || item.lockedBy ? 0.5 : 1,
              //  cursor: 'move',
                //border: isResizing ? '2px dashed #000' : 'none',
                cursor: item.lockedBy && item.lockedBy !== socket.id ? 'not-allowed':'move',
                border: item.lockedBy ? '2px solid red' : isResizing ? '2px dashed #000' : 'none',
            }}
        //     onClick={(e) => {
        //         if (item.lockedBy && item.lockedBy !== socketId) {
        //     alert('This item is locked by another user.');
        //     return;
        // } 
        onClick={(e) => {
                if (!item.lockedBy || item.lockedBy === socket.id) {
                    onSelectItem();
                } else {
                    alert('This item is locked by another user.');
                }
            }
            }

   // onDoubleClick={() => handleLockItem(item)}
        >
            {/* {item.lockedBy && item.lockedBy !== socketId && <span>🔒 Locked by another user</span>} */}
            {/* {item.lockedBy && (
                <span style={{ fontSize: 10, color: 'red' }}>
                    {item.lockedBy === socket.id ? '🔒 Locked by you' : '🔒 Locked'}
                </span>
            )}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent interfering with parent click
                    handleLockToggle();
                }}
                style={{
                    position: 'absolute',
                    top: -20,
                    right: 0,
                    background: item.lockedBy ? 'red' : 'green',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                {item.lockedBy ? 'Unlock' : 'Lock'}
            </button> */}
            {renderContent()}
        
     </div>   
    );
};

const CanvasArea = ({ teamCode, socket, elements = [], setElements, selectedItem, setSelectedItem, updateItemProperties, backgroundColor, backgroundImage }) => {
    const canvasRef = useRef(null);
    const [lockedItems, setLockedItems] = useState({});

    // Lock item function
    const lockItem = (teamCode,itemId) => {
        if(!teamCode)return;
        console.log("Locking item:", itemId);
        socket.emit('lockItem', { teamCode, itemId, lockedBy: socket.id }); // Emit lock event
        setElements((prevElements) =>
            prevElements.map((item) =>
                item.id === itemId ? { ...item, lockedBy: socket.id } : item
            )
        );
    };

    // Unlock item function
    const unlockItem = (itemId) => {
        if (!teamCode || !itemId) return;
        console.log("Unlocking item:", itemId);
    socket.emit('unlockItem', { teamCode, itemId }); // Emit unlock event
    setElements((prevElements) =>
        prevElements.map((item) =>
            item.id === itemId ? { ...item, lockedBy: null } : item
        )
    );
    };

    const updateElements = useCallback((updatedItem) => {
        setElements((prevElements) => {
            const itemIndex = prevElements.findIndex((item) => item.id === updatedItem.id);
            if (itemIndex > -1) {
                return prevElements.map((item) =>
                    item.id === updatedItem.id ? { ...item, ...updatedItem } : item
                );
            } else {
                return [...prevElements, updatedItem];
            }
        });
    }, [setElements]);

    useEffect(() => {
        if (!socketId) {
            console.error("Socket ID is undefined!");
            return;
        }

        // Listen for lockItem event
        socket.on('itemLocked', ({ teamCode,itemId, lockedBy }) => {
            console.log("locking item",itemId )
            console.log(`Item ${itemId} locked by ${lockedBy}`);
            setLockedItems((prev) => ({
                ...prev,
                [itemId]: lockedBy,
            }));
        });

        // Listen for unlockItem event
        socket.on('itemUnlocked', ({ teamCode,itemId }) => {
            console.log("unlocking item",itemId )
            console.log(`Item ${itemId} unlocked`);
            setLockedItems((prev) => {
                const updated = { ...prev };
                delete updated[itemId];
                return updated;
            });
        });

        return () => {
            socket.off('itemLocked');
            socket.off('itemUnlocked');
        };
    }, []);
    

    const updateSize = useCallback((itemId, size) => {
        setElements((prevElements) => {
            return prevElements.map((item) =>
                item.id === itemId ? { ...item, size } : item
            );
        });
    }, [setElements]);

    useEffect(() => {
        if (!teamCode) {
            console.error('teamCode is undefined or invalid:', teamCode);
            return;
        }

        socket.on('updateDesign', ({ teamCode, updatedItem }) => {
            if (updatedItem) {
                updateElements(updatedItem);
            }
        });

        socket.on('itemResize', ({ teamCode, itemId, size }) => {
            if (itemId && size) {
                updateSize(itemId, size);
            }
        });

        return () => {
            socket.off('updateDesign');
            socket.off('itemResize');
        };
    }, [socket, teamCode, updateElements, updateSize]);

    const handleSelectItem = (id) => {
        const item = elements.find((item) => item.id === id);
    if(teamCode){
        console.log("item.lockedBy",item.lockedBy)

        if (item.lockedBy && item.lockedBy !== socket.id) {
            alert('This item is locked by another user.');
            return; // Prevent selection if locked by someone else
        }
        else {
            setSelectedItem({...item,lockedBy: socket.id})
            console.log(item)
        }
     }
        setSelectedItem(item);
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
                console.log("Elements in CanvasArea:", elements);
                console.log('Before update:', prevItems);

                //if (Array.isArray(prevItems)) {
                const existingItemIndex = prevItems?.findIndex((el) => el.id === item.id)??-1;
                if (existingItemIndex > -1) {
                    if (item.lockedBy && item.lockedBy !== socketId) {
                        console.warn('Cannot move: Item is locked by another user.');
                        return; // Prevent modification of locked items
                    }
                    
                    const updatedItems=[...prevItems];
                    const updatedItem = {
                        ...updatedItems[existingItemIndex],
                        left: Math.min(Math.max(0, left), canvasRect.width - 50),
                        top: Math.min(Math.max(0, top), canvasRect.height - 50),
                        // lockedBy: socketId, // Add locking
                    };
                    updatedItems[existingItemIndex] = updatedItem;
                    // Emit item position update to other users
                    console.log(updatedItems)
                    socket.emit('updateDesign',{teamCode,updatedItem})
                    console.log("Emitted updateItem for existing item:", updatedItem);
                    
                    
                    return updatedItems;
                } else {
                    const newItem = {
                        ...item,
                        left: Math.min(Math.max(0, left), canvasRect.width - 50),
                        top: Math.min(Math.max(0, top), canvasRect.height - 50),
                        id:  generateId(),
                        lockedBy: null,
                        imageUrl: item.imageUrl || null, // Preserve image URL for image items
                        size: item.size || { width: 100, height: 100 }, // Default size for new items
                    };
                    console.log('New Items:', [...prevItems, newItem]);
                   socket.emit('updateDesign',{teamCode,updatedItem:newItem})
                   
                   console.log("Emitted updateItem for new item:", newItem);
                   return [...prevItems, newItem];
               
                }
            });
            console.log(elements)
                
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));
    useEffect(() => {
        console.log('Current elements:', elements);
    }, [elements]);
    

    drop(canvasRef);

    return (
        <div
            ref={canvasRef}
            style={{
                width: '100%',
                height: '500px',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                border: '2px dashed #ccc',
                position: 'relative',
                backgroundColor: backgroundColor || '#fff',
                overflow: 'hidden',
            }}
        >
            {Array.isArray(elements) ? (
                elements.map((item) => (
                    <CanvasItem
                        teamCode={teamCode}
                        key={item.id}
                        item={item}
                       
                        onSelectItem={() => handleSelectItem(item.id)}
                        updateItemProperties={(id, properties) => {
                            updateItemProperties(id, properties);
                            socket.emit('updateDesign', { teamCode, updatedItem: { id, ...properties } });
                        }}
                    lockItem={lockItem} // Pass lockItem to CanvasItem
                    unlockItem={unlockItem} // Pass unlockItem to CanvasItem
                    />
                ))
            ) : (
                <p>No elements</p>
            )}
        </div>
    );
};

export default CanvasArea; 
 