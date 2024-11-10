// Design.js
// Design.js
import React, { useState,useEffect,useContext } from 'react';
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
   
    
   
   
    const location = useLocation();
    const templateUrl = location.state?.templateUrl || ''; 
    var { currentUser } = useContext(UserContext); 

    if(! currentUser)

    currentUser = JSON.parse(localStorage.getItem('user'));
   
    useEffect(() => {
        if (templateUrl) {
            console.log('templateurl',templateUrl);
            setBackgroundImage(templateUrl);
        }
    }, [templateUrl]);

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
                        imageUrl: updatedImageUrl  
                    };
                });
                
              
                
                
                console.log("updated elements",updatedElements);

                 setTitle(title);
                 setElements(updatedElements);
                 setBackgroundColor(backgroundColor);
                 setBackgroundImage(backgroundImage); 
            }
              } catch (error) {
                 console.error('Error loading design:', error);
              }
           }
        };
        
        fetchDesign();
     }, [designId,teamCode]);
     useEffect(() => {
        if (teamCode) {
            socket.emit('joinRoom', teamCode);

            socket.on('receiveDesignUpdate', (updatedData) => {
                setElements(updatedData.elements);
                setBackgroundColor(updatedData.backgroundColor);
                setBackgroundImage(updatedData.backgroundImage);
            });
        }
        return () => {
            if (teamCode) {
                socket.emit('leaveRoom', teamCode);
                socket.off('receiveDesignUpdate');
            }
        };
    }, [teamCode]);
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
                socket.emit('sendDesignUpdate', { teamCode, ...payload });
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
    };
    const updateItemProperties = (id, updatedProperties) => {
        setElements((prevElements) =>
            prevElements.map((item) =>
                item.id === id ? { ...item, ...updatedProperties } : item
            )
        );
        
        if (selectedItem && selectedItem.id === id) {
            setSelectedItem((prev) => ({ ...prev, ...updatedProperties }));
        }
        if (teamCode) {
            socket.emit('sendDesignUpdate', {
                teamCode,
                elements,
                backgroundColor,
                backgroundImage,
                title,
            });
        }
    };
    const handleBackgroundColorChange = (color) => {
        setBackgroundColor(color);
        if (teamCode) {
            socket.emit('sendDesignUpdate', {
                teamCode,
                elements,
                backgroundColor: color,
                backgroundImage,
                title,
            });
        }
    };

 
 

    return (
        <DndProvider backend={HTML5Backend}>
        <>
            <Header/>
            <div className="editor-container">
   <div className="sidebar"> <Sidebar setElements={setElements} /></div>
    <div className="main-content">
       <div  className="properties-panel" ><PropertiesPanel 
                               selectedItem={selectedItem}
                               updateItemProperties={updateItemProperties}
                               onBackgroundColorChange={handleBackgroundColorChange}
                               deleteItem={deleteItem}
       />

       </div> 
        <div className="canvas-container">
            <button onClick={saveDesign} className="save-button">Save Design</button>
            <CanvasArea elements={elements} 
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