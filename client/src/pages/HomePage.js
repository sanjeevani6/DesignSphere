import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
//import { FiUsers } from 'react-icons/fi'; 
import { exportToPDF, exportToImage, exportToGIF,designHasAnimatedText } from '../utils/exportUtils';
import { Button, Menu, MenuItem } from '@mui/material';

const Homepage = () => {
   // const [designs, setDesigns] = useState([]);
    const [designs, setDesigns] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [teamDesigns, setTeamDesigns] = useState([]);
    const [selectedDesignId, setSelectedDesignId] = useState(null);
    const [hasAnimatedText, setHasAnimatedText] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : null;
    console.log(teamDesigns)

    useEffect(() => {
        const fetchDesigns = async () => {
          try{
          
           if (userId) {
            // Otherwise, fetch user-specific designs
           
          const userResponse = await axios.get(`/designs/user/${userId}`);
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

    const handleDownloadClick = async(event, designId) => {
        setAnchorEl(event.currentTarget);
        setSelectedDesignId(designId);
        try {
            const response = await axios.get(`/designs/${designId}`);
            setHasAnimatedText(designHasAnimatedText(response.data.elements));
        } catch (error) {
            console.error('Error checking for animated text:', error);
        }
    };

    const handleClose = () => setAnchorEl(null);

    const handleDownload = async (format) => {
        if (!selectedDesignId) return;
        try {
            const response = await axios.get(`/designs/${selectedDesignId}`);
            const { elements, backgroundColor, backgroundImage } = response.data;

            if (format === 'pdf') {
                exportToPDF(elements, backgroundColor, backgroundImage);
            } else if (format === 'image') {
                exportToImage(elements, backgroundColor, backgroundImage);
            }
            else if (format === 'gif') {
                // Check for animated text and handle GIF export
                exportToGIF(elements, backgroundColor, backgroundImage,200,2000);
            }
        } catch (error) {
            console.error('Error fetching design data for download:', error);
        }
        handleClose();
    };

    const handleEventifyClick = (designId) => {
        // Use navigate to go to the event page with the designId
        navigate(`/event/${designId}`);
    };

    const handleDeleteClick = async (designId) => {
        try {
         
            await axios.delete(`/designs/delete/${designId}`);
            setDesigns((prevDesigns) => prevDesigns.filter((design) => design._id !== designId));
        } catch (error) {
            console.error("Failed to delete design:", error);
        }
    };

    return (
        <Layout>
            <div className="homepage-container">
                <div className="options">
                    <h2>Options</h2>
                    <div className="collaborate-card" onClick={handleCollaborateClick}>
                        {/* <FiUsers size={20} className="collaborate-icon" /> */}
                        <h3>Collaborate with Friends</h3>
                        <p>Invite friends to work together on projects in real time.</p>
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
                    <h3>{design.teamName}</h3>
                    <p>Team Project</p>
                    <p>Created at: {new Date(design.createdAt).toLocaleDateString()}</p>
                    <div className="button-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            backgroundColor: '#A5D6A7',
                                            color: '#1B5E20',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #66BB6A',
                                            flex: '1 1 48%',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEventifyClick(design.teamCode); // Navigate to event page
                                        }}
                                    >
                                        Eventify
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
                                            backgroundColor: '#90CAF9',
                                            color: '#0D47A1',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #64B5F6',
                                            flex: '1 1 48%'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownloadClick(e, design.teamCode);
                                        }}
                                    >
                                        Download
                                    </Button>

                                    <Button
                                        variant="contained"
                                        style={{
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
              </div>
            </>
          )}

                </div>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={() => handleDownload('pdf')}>Download as PDF</MenuItem>
                    <MenuItem onClick={() => handleDownload('image')}>Download as Image</MenuItem>
                    {hasAnimatedText && <MenuItem onClick={() => handleDownload('gif')}>Download as GIF</MenuItem>}
                  
                </Menu>
            </div>
        </Layout>
    );
};

export default Homepage;
