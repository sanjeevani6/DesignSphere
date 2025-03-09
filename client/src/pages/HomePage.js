import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { FiUsers } from "react-icons/fi"

//import { FiUsers } from 'react-icons/fi'; 
import { exportToPDF, exportToImage, exportToGIF, designHasAnimatedText } from '../utils/exportUtils';
//import { Button, Menu, MenuItem, Grid, Card, CardContent, Typography, } from '@mui/material';
import {
    Button,
    Menu,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Typography,
  } from '@mui/material';


  // Function to check for animated text
//   const designHasAnimatedText = (elements) => {
//     if (Array.isArray(elements)) {
//         return elements.some(element => element.category && element.category.trim().toLowerCase() === 'animatedtext');
//     }
//     return false;
// };
const Homepage = () => {
    const [designs, setDesigns] = useState([]);
    
    const [designMenuAnchorEl, setDesignMenuAnchorEl] = useState(null);
    const [teamMenuAnchorEl, setTeamMenuAnchorEl] = useState(null);
    const [teamDesigns, setTeamDesigns] = useState([]);
    const [selectedDesignId, setSelectedDesignId] = useState(null);
    const [selectedteamCode, setSelectedteamCode] = useState(null);
    const [hasAnimatedText, setHasAnimatedText] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt_token');
    
    
    if (!token) {
        // Handle the case where the token is missing
        console.error("token is not there");
      }
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    const userId = user ? user._id : null;
    //console.log(teamDesigns)

    useEffect(() => {
        const fetchDesigns = async () => {
          try{
          
           if (userId) {
            // Otherwise, fetch user-specific designs
           console.log(token);
          const userResponse = await axios.get(`/designs/user/${userId}`,{
            headers:{
                        Authorization: `Bearer ${token}`,
                    },
          });
          //setDesigns(userResponse.data)
          setDesigns(userResponse.data.designs);
          setTeamDesigns(userResponse.data.TeamDesigns);
          console.log("ok",teamDesigns)
          }
  
          
        } catch (error) {
          console.error('Error fetching designs:', error);
        }
    
     };

        if (userId) fetchDesigns();
    }, [userId]);

    const handleDesignClick = (designId, isTeamDesign = false) => {
      // Navigate to different paths based on design type
      if (isTeamDesign) {
        navigate(`/design/team/${designId}`);
      } else {
        navigate(`/design/${designId}`);
      }
    };
    const handleCollaborateClick = () => {
      navigate('/teams');
    };

    const handleDownloadClick = async(e, designId,isTeamDesign=false) => {
        
        if(isTeamDesign){
            setSelectedteamCode(designId);
            setTeamMenuAnchorEl(e.currentTarget);
            console.log(`Downloading for teamCode ${selectedteamCode}`)
           
        }
        else{
         setSelectedDesignId(designId);
         setDesignMenuAnchorEl(e.currentTarget)
         console.log(`Downloading for design ${selectedDesignId}`)
          // Now, we call handleDownload directly with the designId
        
        }
        
    };
    //close the menu
    const handleClose = () => {
        setDesignMenuAnchorEl(null);
        setTeamMenuAnchorEl(null);
    };


    const handleDownload = async (format,isTeamDesign=false) => {
        const designId = isTeamDesign ? selectedteamCode : selectedDesignId;
         // Check if the required design ID (or teamCode) exists
    if (!designId) {
        console.error('Design ID or Team Code is missing');
        return;
    }
        // if (isTeamDesign && !selectedteamCode) return;
        // if (!isTeamDesign && !selectedDesignId) return;

        let response;
        try {
            if(isTeamDesign){
                console.log(`Downloading for ${designId}`)
               response=await axios.get(`/designs/team-designs/${designId}`)
            }
            else{
                console.log(`Downloading foe ${designId}}`)
             response = await axios.get(`/designs/${designId}`);
            }
             console.log(response.data.elements)
            const { elements, backgroundColor, backgroundImage } = response.data;

            setHasAnimatedText(designHasAnimatedText(elements));
            console.log(hasAnimatedText)
            if (format === 'pdf') {
                exportToPDF(elements, backgroundColor, backgroundImage);
            } else if (format === 'image') {
                exportToImage(elements, backgroundColor, backgroundImage);
            }
            else if (format === 'gif') {
                // Check for animated text and handle GIF export
                exportToGIF(elements, backgroundColor, backgroundImage,200,2000);
            }
            // After download logic, check for animated text
        } catch (error) {
            console.error('Error fetching design data for download:', error);
        }
        handleClose();
    };

    const handleEventifyClick = (designId,isTeamDesign=false) => {
        // Use navigate to go to the event page with the designId
        if(isTeamDesign)
            navigate(`/event/teams/${designId}`)
        else
        navigate(`/event/${designId}`);
    };

    const handleDeleteClick = async (designId,isTeamDesign=false) => {
        console.log("downloading")
        try {
            if(isTeamDesign){
                console.log(`Deleting:${designId}`)
                const response = await axios.delete(`/designs/delete/team/${designId}/${userId}`);
                if (response.status === 200) {
                  // Update local state to remove the team design
                  setTeamDesigns((prevDesigns) =>
                    prevDesigns.filter((design) => design.teamCode !== designId)
                  );
                } else {
                  console.error("Failed to delete team design: Response not OK");
                }
            }
            else{
                await axios.delete(`/designs/delete/${designId}`);
            
            setDesigns((prevDesigns) => prevDesigns.filter((design) => design._id !== designId));
            }
        } catch (error) {
            console.error("Failed to delete design:", error);
        }
    };

    return (
        <Layout>
            <div className="homepage-container">
               
                <div className="options max-w-md w-full bg-purple-50 rounded-2xl shadow-lg p-6">
        <div 
        
            className="collaborate-card flex flex-col items-center text-center bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-transform cursor-pointer" 
            onClick={handleCollaborateClick}
        >
            <FiUsers size={48} style={{color:"black"}}className="collaborate-icon mb-3 " />
            <h3  style={{color:"black"}}className="text-lg font-semibold mb-2 font-sans tracking-wide">Collaborate with Friends</h3>
            <p  style={{color:"black"}}className="text-sm font-light font-mono mb-4">Invite friends to work together on projects in real time.</p>
            <button 
            style={{backgroundColor:"#FF6F61",color:'black'}}
                className="px-4 py-2  text-purple-700 rounded-full shadow-sm hover:bg-purple-100 transition-colors font-medium"
            >
                Get Started
            </button>
        </div>
        </div>
                <div className="mainarea">
                    <h2>YOUR DESIGNS</h2>
                    <div className="design-cards">
                        {designs.map((design) => (
                            <div
                                key={design._id}
                                className="design-card"
                                onClick={() => handleDesignClick(design._id)}
                            >
                                <h3>{design.title}</h3>
                                <p>Created at: {new Date(design.createdAt).toLocaleDateString()}</p>

                                <div className="button-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            backgroundColor: '#A5D6A7',
                                            fontWeight:'bold',
                                            color: '#1B5E20',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #66BB6A',
                                            flex: '1 1 48%',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEventifyClick(design._id); // Navigate to event page
                                        }}
                                    >
                                        Eventify
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
                                            fontWeight:'bold',

                                            backgroundColor: '#90CAF9',
                                            color: '#0D47A1',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #64B5F6',
                                            flex: '1 1 48%'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownloadClick(e, design._id);
                                        }}
                                    >
                                        Download
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
                                            fontWeight:'bold',
                                            backgroundColor: '#FFCC80',
                                            color: '#E65100',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #FFA726',
                                            flex: '1 1 48%'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/print/${design._id}`); // Navigate to print page with designId
                                        }}
                                    >
                                        Print
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
                                            fontWeight:'bold',
                                            backgroundColor: '#EF9A9A',
                                            color: '#B71C1C',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #E57373',
                                            flex: '1 1 48%',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(design._id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Menu anchorEl={designMenuAnchorEl} open={Boolean(designMenuAnchorEl)} onClose={handleClose}>
                    <MenuItem onClick={() => handleDownload('pdf')}>Download as PDF</MenuItem>
                    <MenuItem onClick={() => handleDownload('image')}>Download as Image</MenuItem>
                    {hasAnimatedText && <MenuItem onClick={() => handleDownload('gif')}>Download as GIF</MenuItem>}
                  
                </Menu>
                    </div>
                     {/* Section for Team Designs */}
          {teamDesigns.length > 0 && (
            <>
              <h2>TEAM PROJECTS</h2>
              <div className="design-cards team-design-cards">
                {teamDesigns.map((design) => (
                  <div
                    key={design._id}
                    className="design-card team-design-card"
                    onClick={() => handleDesignClick(design.teamCode, true)}
                  >
                    <h3  style={{color:"white"}}>{design.teamName}</h3>
                    <p>Team Project</p>
                    <p>Created at: {new Date(design.createdAt).toLocaleDateString()}</p>
                    <div className="button-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            fontWeight:'bold',
                                            backgroundColor: '#A5D6A7',
                                            color: '#1B5E20',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #66BB6A',
                                            flex: '1 1 48%',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEventifyClick(design.teamCode,true); // Navigate to event page
                                        }}
                                    >
                                        Eventify
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
                                            fontWeight:'bold',
                                            backgroundColor: '#90CAF9',
                                            color: '#0D47A1',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #64B5F6',
                                            flex: '1 1 48%'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownloadClick(e, design.teamCode,true);
                                        }}
                                    >
                                        Download
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
                                            fontWeight:'bold',
                                            backgroundColor: '#FFCC80',
                                            color: '#E65100',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #FFA726',
                                            flex: '1 1 48%'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/print/teams/${design.teamCode}`); // Navigate to print page with designId
                                        }}
                                    >
                                        Print
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
                                            fontWeight:'bold',
                                            backgroundColor: '#EF9A9A',
                                            color: '#B71C1C',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #E57373',
                                            flex: '1 1 48%',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(design.teamCode,true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                    
                  </div>
                ))}
              </div>
          <Menu anchorEl={teamMenuAnchorEl} open={Boolean(teamMenuAnchorEl)} onClose={handleClose}>
                    <MenuItem onClick={() => handleDownload('pdf',true)}>Download as PDF</MenuItem>
                    <MenuItem onClick={() => handleDownload('image',true)}>Download as Image</MenuItem>
                    {hasAnimatedText && <MenuItem onClick={() => handleDownload('gif')}>Download as GIF</MenuItem>}
                  
                </Menu>
            </>
          )}

                </div>

                
            </div>
        </Layout>
    );
};

export default Homepage;
 