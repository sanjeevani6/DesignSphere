import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { exportToPDF, exportToImage } from '../utils/exportUtils'; // Import the export functions
import { Button, Menu, MenuItem } from '@mui/material'; // Import Material UI components

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
        setSelectedDesignId(designId); // Store the design ID for download
    };

    const handleClose = () => setAnchorEl(null);

    const handleDownload = async (format) => {
        if (!selectedDesignId) return;
        try {
            const response = await axios.get(`/designs/${selectedDesignId}`);
            const { elements, backgroundColor } = response.data;

            if (format === 'pdf') {
                exportToPDF(elements, backgroundColor);
            } else if (format === 'image') {
                exportToImage(elements, backgroundColor);
            }
        } catch (error) {
            console.error('Error fetching design data for download:', error);
        }
        handleClose(); // Close the menu after download
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
                {/* Dropdown menu for download options */}
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
