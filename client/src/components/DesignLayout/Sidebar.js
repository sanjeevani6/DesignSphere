// Sidebar.js
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import SidebarItem from './SidebarItem';
import axios from 'axios';
import socket from '../../socket'
import {teamCode} from "../../pages/Design"
import Chat from './Chat';
import {
    Box,
    Typography, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
  ListItemText,
    Button,
    
    Divider,
  } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import TextFieldsIcon from '@mui/icons-material/TextFields';
import ShapesIcon from '@mui/icons-material/Category';
import BrushIcon from '@mui/icons-material/Brush';
import ImageIcon from '@mui/icons-material/Image';
import StickerIcon from '@mui/icons-material/EmojiEmotions';
import ChatIcon from '@mui/icons-material/Chat';


// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);


const Sidebar = ({ setElements , socket}) => {
    const [sidebarItems, setSidebarItems] = useState([]);
    const [isChatVisible, setIsChatVisible] = useState(false); // State to toggle chat visibility
    const {teamCode}=useParams()  ;  

    //handle image upload:
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            //const imageUrl = URL.createObjectURL(file);
           // console.log(imageUrl); // Check this in the console
            const formData = new FormData();
            formData.append('image', file);
    
            try {
                // Upload the image to the server and get the URL
                 const response = await axios.post('/designpage/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("URL",response.data.url);
              // const imageUrl = '/' + (response.data.url).replace(/\\/g, '/');// Adjust according to your response structure
               //console.log("URL updated",imageUrl);
                const newImageItem = {
                    name:'uploaded image',
                    id: generateId(),
                    type: 'image',
                    category: 'image', 
                    imageUrl: response.data.url, // Use the permanent URL
                    size: { width: 100, height: 100 }, // Default size
                    top: 50,
                    left: 50,
                };
                // Instead of adding to sidebar, add directly to canvas
                setElements((prevItems) => [...prevItems, newImageItem]); // Add to canvas directly
                // Emit event to inform other clients
                socket.emit('newSidebarItem', { teamCode, item: newImageItem });
            } catch (error) {
                console.error('Error uploading image:', error);
            }


          
   
        }
    };


    // Fetch sidebar items from the backend API
    useEffect(() => {
        const fetchSidebarItems = async () => {
            try {
                const response = await fetch('/designpage/get-sidebar-items'); // Adjust if your backend is on a different domain
                const data = await response.json();
                console.log('sidebar items',data)
                setSidebarItems(data);
            } catch (error) {
                console.error('Error fetching sidebar items:', error);
            }
        };

        fetchSidebarItems();
   
     // Listen for new items added by other clients in the same team
    //  socket.on('sidebarItemAdded', (newItem) => {
    //     setElements((prevItems) => [...prevItems, newItem]); // Add new item to canvas
    //     if (newItem.category === 'image') {
    //         // Update sidebar if it's an image item
    //         setSidebarItems((prevItems) => [...prevItems, newItem]);
    //     }
    // });

    // Clean up socket listener on component unmount
    // return () => {
    //     socket.off('sidebarItemAdded');
    // };
}, [setElements]);

    // Separate items by category
    const textItems = sidebarItems.filter(item => item.category === 'text');
    const shapeItems = sidebarItems.filter(item => item.category === 'shape');
    const animatedTextItems = sidebarItems.filter(item => item.category === 'animatedText');
    const stickerItems = sidebarItems.filter(item => item.category === 'sticker');

    return (
        <Box
          sx={{
            width: { xs: '100%', sm: '240px' },
        height: '82vh',
        backgroundColor: '#f8f9fa',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowX: 'hidden', // Prevent horizontal scrolling
        overflowY: 'auto', // Enable vertical scrolling for overflow
        boxSizing: 'border-box', // Prevent layout shifts due to padding
        padding: '8px',
          }}
        >
          {/* Header */}
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#684B74',      
              
              color: 'white',
            }}
          >
            Sidebar
          </Typography>
    
          {/* Sidebar Content */}
          <Box>
       

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextFieldsIcon sx={{ marginRight: 1 }} />
            <Typography>Add Text</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {textItems.map((item) => (
                <ListItem key={item.id} button>
                  <SidebarItem item={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ShapesIcon sx={{ marginRight: 1 }} />
            <Typography>Shapes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {shapeItems.map((item) => (
                <ListItem key={item.id} button>
                  <SidebarItem item={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextFieldsIcon sx={{ marginRight: 1 }} />
            <Typography>Animated Text</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {animatedTextItems.map((item) => (
                <ListItem key={item.id} button>
                  <SidebarItem item={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <StickerIcon sx={{ marginRight: 1 }} />
            <Typography>Stickers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {stickerItems.map((item) => (
                <ListItem key={item.id} button>
                  <SidebarItem item={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ padding: '16px' }}>
          <Typography variant="subtitle1">
            <ImageIcon sx={{ marginRight: 1 }} />
            Upload Image
          </Typography>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </Box>
      </Box>

      {/* Footer with Chat Toggle */}
     
      {teamCode && (
        <Box
          sx={{
            padding: '16px',
            borderTop: '1px solid #ccc',
          }}
        >
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            fullWidth
            onClick={() => setIsChatVisible((prev) => !prev)}
            sx={{
              backgroundColor: '#1C2529',
              '&:hover': {
                backgroundColor: '#A1D1B1',
              },
            }}
          >
            {isChatVisible ? 'Hide Chat' : 'Group Chat'}
          </Button>

          {/* Chat Box */}
          <Box
            sx={{
              marginTop: '16px',
              height: isChatVisible ? '300px' : '0px', // Adjust height dynamically
              overflow: 'hidden', // Prevent overflow
              transition: 'height 0.3s ease', // Smooth height transition
            }}
          >
            {isChatVisible && <Chat teamCode={teamCode} socket={socket} />}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;