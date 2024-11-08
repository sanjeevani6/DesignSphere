// src/pages/Homepage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { exportToPDF, exportToImage, exportToShare } from '../utils/exportUtils';
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

    const handleEventifyClick = async (designId) => {
        try {
            // Fetch the design data
            const response = await axios.get(`/designs/${designId}`);
            const { elements, backgroundColor, backgroundImage } = response.data;

            // Generate the PNG data URL
            const imageDataUrl = await exportToShare(elements, backgroundColor, backgroundImage);

            // Upload the image and save the URL
            await uploadImage(imageDataUrl, designId);
        } catch (error) {
            console.error('Error processing design for Eventify:', error);
        }
    };

    // Function to upload the image to the server
    const uploadImage = async (imageDataUrl, designId) => {
        const formData = new FormData();
        const blob = await fetch(imageDataUrl).then(res => res.blob());
        formData.append('image', blob, 'design.png');

        try {
            const response = await fetch('/api/v1/uploads/designimage', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                // Save the relative URL in the database
                const imageUrl = result.imageUrl;
                await saveDesignImageUrl(imageUrl, designId);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Function to save the image URL in the database
    const saveDesignImageUrl = async (imageUrl, designId) => {
        try {
            await axios.put(`/designs/${designId}/updateImageUrl`, { imageUrl });
            console.log('Image URL saved successfully');
        } catch (error) {
            console.error('Error saving image URL:', error);
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

                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: '#A5D6A7',
                                        color: '#1B5E20',
                                        fontSize: '0.8rem',
                                        padding: '4px 10px',
                                        marginBottom: '6px',
                                        border: '1px solid #66BB6A'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEventifyClick(design._id);
                                    }}
                                >
                                    Eventify
                                </Button>

                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: '#90CAF9',
                                        color: '#0D47A1',
                                        fontSize: '0.8rem',
                                        padding: '4px 10px',
                                        border: '1px solid #64B5F6'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadClick(e, design._id);
                                    }}
                                >
                                    Download
                                </Button>
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
