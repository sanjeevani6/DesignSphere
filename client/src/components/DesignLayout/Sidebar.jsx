// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import SidebarItem from './SidebarItem';

import axios from "../../services/axiosInstance";

import Chat from './Chat';
import {
    Box,
    Typography, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    
    Button,
    
    
  } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import TextFieldsIcon from '@mui/icons-material/TextFields';
import ShapesIcon from '@mui/icons-material/Category';

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
            
            const formData = new FormData();
            formData.append('image', file);
    
            try {
                // Upload the image to the server and get the URL
                 const response = await axios.post('/api/v1/designpage/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true,
                });
                console.log("URL",response.data.url);
             
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
                const response = await fetch('/api/v1/designpage/get-sidebar-items'); // Adjust if your backend is on a different domain
                const data = await response.json();
                console.log('sidebar items:',data)
                setSidebarItems(data);
            } catch (error) {
                console.error('Error fetching sidebar items:', error);
            }
        };

        fetchSidebarItems();
   
   
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
       
         
        backgroundColor: '#9eb7e1',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
       
        justifyContent: 'center',
        
        
        //overflowY: 'auto', // Enable vertical scrolling for overflow
        boxSizing: 'border-box', // Prevent layout shifts due to padding
        padding: '8px',
         overflowX: 'hidden',
          }}
        >
          {/* Header */}
          
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                padding: '16px',
                backgroundColor: 'whitesmoke',      
                width: '100%', 
                color: '#593125',
                 
          
                  
                  fontWeight: "bold",
                  fontFamily: "'Chewy', cursive",
                  letterSpacing: "2px",
                 
                  textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                
              }}
          >
              Sidebar
          </Typography>
    
          {/* Sidebar Content */}
          <Box sx={{ flex: 1, overflowY: 'auto',width: '100%',overflowX: 'hidden' }}>
          

        <Accordion >
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

        <Box sx={{ padding: '16px', paddingTop:'30px', backgroundColor: 'whitesmoke', width: '100%',  }}>
          <Typography variant="subtitle1"  sx={{ 
                textAlign: 'center',
                padding: '16px',
                   width: '100%', 
                
                color: '#593125',
                 
          
                  
                  fontWeight: "bold",
                  fontFamily: "'Chewy', cursive",
                  letterSpacing: "2px",
                 
                  textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                
              }}>
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
            width: '100%', 
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
              width: '100%', 
            }}
          >
            {isChatVisible && <Chat teamCode={teamCode}  />}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;