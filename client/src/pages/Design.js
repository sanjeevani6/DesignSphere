import React, { useState,useEffect,useContext,useRef  } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import Sidebar from '../components/DesignLayout/Sidebar';
import CanvasArea from '../components/DesignLayout/CanvasArea';
import PropertiesPanel from '../components/DesignLayout/PropertiesPanel';
import axios from 'axios';
import Header from '../components/Layouts/Header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { UserContext } from '../context/UserContext'; 
import {  exportToShare } from '../utils/exportUtils';
import socket from '../socket'
import { message } from 'antd';
import { Variants } from 'antd/es/config-provider';

  
const Design = () => {
    const { designId,teamCode } = useParams();
    const [elements, setElements] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#fff'); // Default background color
    const [backgroundImage, setBackgroundImage] = useState(''); 
    const [title, setTitle] = useState('');
   
    const socketJoinedRooms = useRef(new Set());
    const location = useLocation();
    const templateUrl = location.state?.templateUrl || ''; 
    var { currentUser } = useContext(UserContext); 

    if(! currentUser)

    currentUser = JSON.parse(localStorage.getItem('user'));
   
    useEffect(() => {
        if (templateUrl) {
            console.log('template URL selected:',templateUrl);
            // const updatedImageUrl = templateUrl 
            // ? `${templateUrl.replace(/\\/g, '/')}`  // Ensuring leading slash and replace backslashes in url
            // : undefined; 
            setBackgroundImage(templateUrl);
            if (teamCode) {
                //socket.emit('updateDesignProperties', { teamCode, properties: { backgroundImage: templateUrl } });
                // Emit the template selection event to the server
                 const payload = { teamCode, properties: { backgroundImage: templateUrl } ,updatedBy: socket.id };
                 console.log('Emitting updateDesignProperties:', payload);
                 socket.emit('updateDesignProperties', payload);

            
                }
                setBackgroundImage(templateUrl);
        }
    }, [templateUrl,teamCode]);

    useEffect(() => {
        const fetchDesign = async () => {
             
              console.log(teamCode)
              console.log(designId)
           if (currentUser) { // Loading design for editing if ID exists
              try {
                let response;
                if (teamCode) {
                    console.log("getting team design")
                  response = await axios.get(`/designs/team-designs/${teamCode}`);
                } else if (designId) {
                    console.log("getting design")
                    response = await axios.get(`/designs/${designId}`);
                }
                else {
                    console.log("Neither teamCode nor designId is provided.");
                    return;
                }
                if (response?.data) {
                    const { backgroundImage } = response.data;
    
                    // Use the templateUrl as a fallback for backgroundImage
                    setBackgroundImage(backgroundImage || templateUrl || '');
                }
               console.log("Fetching design response:", response.data);
                 
                  
                 console.log("response",response.data);
                 if(response){
                 const { title, elements, backgroundColor, backgroundImage} = response.data;
                 console.log('oldelements',elements)
                 const updatedElements = elements.map(element => {
                    //  modifying imageUrl if it exists and the element is an image
                    const updatedImageUrl = element.imageUrl 
                        ? `${element.imageUrl.replace(/\\/g, '/')}`  // Ensuring leading slash and replace backslashes in url
                        : undefined;  // Keeping as undefined if not an image element
                
                    return {
                        ...element,
                        imageUrl: updatedImageUrl  ,
                        lockedBy: element.lockedBy || null, // Initialize lockedBy if not already present
                };
                });
                
              
                
                
                console.log("updated elements",updatedElements);

                 setTitle(title);
                 setElements(updatedElements||[]);
                 setBackgroundColor(backgroundColor);
                // setBackgroundImage(backgroundImage); 
            }
              } catch (error) {
                 console.error('Error loading design:', error);
              }
           }
        };
        
        fetchDesign();
     }, [designId,teamCode,currentUser,templateUrl]);
     
    //  const lockItem = (itemId) => {
    //     if (!teamCode || !itemId) return;
    
    //     console.log("Locking item:", itemId);
    //     socket.emit('lockItem', { teamCode, itemId, lockedBy: socket.id });
    // };
    
     
     useEffect(() => {
        
         if (teamCode  && !socketJoinedRooms.current.has(teamCode)) {
            console.log(`Joining room: ${teamCode}`)
                socket.emit('joinRoom', {teamCode, callback:(response) => {
                    if (response.status === 'success') {
                        console.log(`Joined room successfully: ${response.room}`);
                        socketJoinedRooms.add(teamCode);
                    } else {
                        console.error(`Failed to join room: ${response.message}`);
                    }
            }});
            
            // Listen for design updates from the socket
        socket.on('receiveDesignUpdate', (updatedData) => {
            console.log("received data on frontend:",updatedData.backgroundImage)
            // Handle deleted items
            if (updatedData.deletedItemId) {
                setElements((prevElements) =>
                    prevElements.filter((item) => item.id !== updatedData.deletedItemId)
                );
                console.log("Deleted item with ID:", updatedData.deletedItemId);
            }
             // Skip processing if this client already performed the update
            //  if (updatedData.updatedBy === socket.id) {
            //     console.log('Skipping update for performing client.');
            //     return;
            // }
           
            // Update background properties if they are part of the update
            if (updatedData.backgroundColor) setBackgroundColor(updatedData.backgroundColor);
            if (updatedData.backgroundImage) setBackgroundImage(updatedData.backgroundImage);
    
            if (  Array.isArray(updatedData.elements)) {
                console.log("Received updated elements:", updatedData.elements);
                // Merge updated elements with existing ones
             setElements((prevElements) => {
            const updatedIds = new Set(updatedData.elements.map(item => item.id));
            const nonUpdatedElements = prevElements.filter(item => !updatedIds.has(item.id));
            return [...nonUpdatedElements, ...updatedData.elements];
        });
            } else {
                console.error("Received invalid elements:", updatedData.elements);
            }
            console.log(updatedData)

        });

        // Listen for unlockItem event
    socket.on('unlockItem', ({ teamCode,itemId }) => {
        console.log(`Item ${itemId} unlocked`);
        setElements((prevElements) =>
            prevElements.map((item) =>
                item.id === itemId ? { ...item, lockedBy: null } : item
            )
        );
    });
    
        socket.on('lockItem', ({ teamCode,itemId, lockedBy }) => {
        console.log(`Item ${itemId} locked by ${lockedBy}`);
        setElements((prevElements) =>
            prevElements.map((item) =>
                item.id === itemId ? { ...item, lockedBy } : item
            )
        );
    });
    
        }
        return () => {
            if (teamCode ) {
                console.log(`Leaving room: ${teamCode}`);
                socket.emit('leaveRoom', teamCode);
                socket.off('receiveDesignUpdate');
                socketJoinedRooms.current.delete(teamCode);
                socket.off('lockItem');
               
       
            }
        };
    }, [teamCode,socket]);
    const saveDesign = async () => {
        let  saveResponse;
       
            const inputTitle = prompt("Please enter a title for your design:",title?title:' ');
            if (!inputTitle) return alert("Design not saved. Title is required.");
       
         
         try {
            if (!currentUser) {
                return alert("User must be logged in to save a design.");
            }
            console.log('Current title before saving:', title);
            
            const payload = {
               userId: currentUser?._id,
               title: inputTitle,
               elements,
               backgroundColor,
               backgroundImage: backgroundImage,            
            };
            console.log(elements)
            console.log('Payload to be sent:', payload)
            if (teamCode) {
                console.log("saving")
                await axios.put(`/designs/team-designs/${teamCode}`, payload);
                socket.emit('updateDesign', { teamCode, ...payload });
                message.success('Team design updated successfully');
                console.log('New design saved:', payload);
            } else {
                if (designId) {
                    await axios.put(`/designs/${designId}`, payload);
                    message.success('Design updated successfully');
                    await exportToShare(elements, backgroundColor, backgroundImage,designId);
                } else {
                    saveResponse=await axios.post('/designs/save', payload);
                    message.success('New design saved successfully');
                    const designId = saveResponse.data.designId;
                    console.log("designid",designId )
                    console.log('New design saved:', payload);
                    await exportToShare(elements, backgroundColor, backgroundImage,designId);
                }
            }
            setTitle(inputTitle);
        } catch (error) {
            console.error('Failed to save design:', error);
            message.error('Failed to save design');
        }
    };
    
    const deleteItem = (id) => {
        setElements((prevItems) => prevItems.filter(item => item.id !== id));
        
        setSelectedItem(null); // Optionally clear the selected item
        if (teamCode) {
            console.log("Deleting item using socket");
            socket.emit('deleteItem', { teamCode, itemId: id });
        }
    };
    const updateItemProperties = (id, updatedProperties) => {
        if(teamCode){
        const item = elements.find((item) => item.id === id);
        if (item.lockedBy && item.lockedBy !== socket.id) {
            alert("This item is being edited by another user.");
           
          return;
        }
    }
        setElements((prevElements) =>
            prevElements.map((item) =>
                item.id === id ? { ...item, ...updatedProperties } : item
            )
        );
        
        if (selectedItem && selectedItem.id === id) {
            setSelectedItem((prev) => ({ ...prev, ...updatedProperties }));
        }
        if (teamCode) {
            
            console.log("updating using socket")
            socket.emit('updateItem', { teamCode, updatedItem: { id, ...updatedProperties } });
        }
    };
    const handleBackgroundColorChange = (color) => {
        setBackgroundColor(color);
        if (teamCode) {
            updateDesignProperties(teamCode, { backgroundColor: color });
        }
    };
    

    const updateDesignProperties = (teamCode, properties) => {
        socket.emit('updateDesignProperties', { teamCode, properties });
    };
    
    useEffect(() => {
        console.log('Parent elements state:', elements);
    }, [elements]);
    
 
 

    return (
        <DndProvider backend={HTML5Backend}>
        <>
            <Header/>
            <div className="editor-container">
   <div className="sidebar  "> <Sidebar setElements={setElements} /></div>
    <div className="main-content">
       <div  className="properties-panel" ><PropertiesPanel 
       teamCode={teamCode}
                               selectedItem={selectedItem}
                               updateItemProperties={updateItemProperties}
                               onBackgroundColorChange={handleBackgroundColorChange}
                               deleteItem={deleteItem}
       />

       </div> 
        <div className="canvas-container">
            <button onClick={saveDesign} className="save-button">Save Design</button>
            <CanvasArea teamCode={teamCode}
                        socket={socket}
                        elements={elements} 
                        setElements={setElements}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        updateItemProperties={updateItemProperties}
                        backgroundColor={backgroundColor}
                        backgroundImage={backgroundImage} 
                        className="canvas-area" />
        </div>
    </div>
</div>

        </>
        </DndProvider>
    );
};


export default Design;  
   
  
                    
            
              
               
       
      