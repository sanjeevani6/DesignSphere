// src/pages/Homepage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { exportToPDF, exportToImage } from '../utils/exportUtils';
import { Button, Menu, MenuItem } from '@mui/material';

const Homepage = () => {
    const [designs, setDesigns] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDesignId, setSelectedDesignId] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : null;

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const response = await axios.get(`/designs/user/${userId}`);
                setDesigns(response.data);
            } catch (error) {
                console.error('Error fetching designs:', error);
            }
        };

        if (userId) fetchDesigns();
    }, [userId]);

    const handleDesignClick = (designId) => navigate(`/design/${designId}`);

    const handleDownloadClick = (event, designId) => {
        setAnchorEl(event.currentTarget);
        setSelectedDesignId(designId);
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
        } catch (error) {
            console.error('Error fetching design data for download:', error);
        }
        handleClose();
    };

    const handleDeleteClick = async (designId) => {
        try {
            // Send DELETE request to backend
            await axios.delete(`/designs/delete/${designId}`);

            // Update state to remove the deleted design from the list
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
                    <p>This is the options content.</p>
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
                                <div className="button-group" style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px'
                                }}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            backgroundColor: '#A5D6A7',
                                            color: '#1B5E20',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                           
                                            border: '1px solid #66BB6A',
                                            flex: '1 1 48%'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/events/${design._id}`);
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
                                            backgroundColor: '#EF9A9A',
                                            color: '#B71C1C',
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            border: '1px solid #E57373',
                                            flex: '1 1 48%'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(design._id); // Delete handler
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleDownload('pdf')}>Download as PDF</MenuItem>
                    <MenuItem onClick={() => handleDownload('image')}>Download as Image</MenuItem>
                </Menu>
            </div>
        </Layout>
    );
};

export default Homepage;
