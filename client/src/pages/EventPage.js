import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, IconButton, Box, Container } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { exportToShare } from '../utils/exportUtils'; // Import export function

const EventPage = () => {
    const { designId } = useParams();
    const [designTitle, setDesignTitle] = useState('');
    const [designImage, setDesignImage] = useState('');
    const [eventDetails, setEventDetails] = useState({
        title: '',
        description: '',
        date: '',
        location: ''
    });

    useEffect(() => {
        const fetchDesignTitle = async () => {
            try {
                const response = await axios.get(`/designs/${designId}`);
                setDesignTitle(response.data.title);

                // Fetch design elements and pass them to exportToImage
                const elements = response.data.elements; // Assuming `elements` is part of response
                const imageUrl = await exportToShare(elements, response.data.backgroundColor, response.data.imageUrl);
                setDesignImage(imageUrl); // Set the generated image URL
            } catch (error) {
                console.error('Error fetching design:', error);
            }
        };
        fetchDesignTitle();
    }, [designId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventDetails((prev) => ({ ...prev, [name]: value }));
    };

    const eventPageUrl = `http://localhost:3000/events/${designId}`;
    const shareText = encodeURIComponent(`Check out this event: ${eventDetails.title}`);

    return (
        <Container maxWidth="lg" style={{ display: 'flex', height: '100vh', padding: '0' }}>
            {/* Left Side: Design Image */}
            <Box 
                sx={{
                    width: '66.66%',
                    borderRight: '2px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}
            >
                {designImage ? (
                    <img
                        src={designImage}
                        alt="Design Preview"
                        style={{
                            width: '100%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                    />
                ) : (
                    <Typography variant="h6" color="textSecondary">Loading design preview...</Typography>
                )}
            </Box>

            {/* Right Side: Event Form */}
            <Box
                sx={{
                    width: '33.33%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    backgroundColor: '#f9f9f9'
                }}
            >
                <Typography variant="h5" gutterBottom align="center">{designTitle}</Typography>

                <form style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        label="Event Title"
                        fullWidth
                        margin="normal"
                        name="title"
                        value={eventDetails.title}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Event Description"
                        fullWidth
                        margin="normal"
                        name="description"
                        multiline
                        rows={3}
                        value={eventDetails.description}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Event Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        name="date"
                        InputLabelProps={{ shrink: true }}
                        value={eventDetails.date}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        margin="normal"
                        name="location"
                        value={eventDetails.location}
                        onChange={handleChange}
                    />

                    <Typography variant="subtitle1" align="center" style={{ marginTop: '20px' }}>
                        Share this event:
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '15px 0' }}>
                        <IconButton
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${eventPageUrl}`, '_blank')}
                            sx={{ color: '#4267B2', fontSize: '30px' }}
                        >
                            <FacebookIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            onClick={() => window.open(`https://www.linkedin.com/shareArticle?url=${eventPageUrl}&title=${shareText}&image=${encodeURIComponent(designImage)}`, '_blank')}
                            sx={{ color: '#0A66C2', fontSize: '30px' }}
                        >
                            <LinkedInIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            onClick={() => window.open(`https://twitter.com/share?url=${eventPageUrl}&text=${shareText}&image=${encodeURIComponent(designImage)}`, '_blank')}
                            sx={{ color: '#1DA1F2', fontSize: '30px' }}
                        >
                            <TwitterIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            onClick={() => window.open(`https://pinterest.com/pin/create/bookmarklet/?media=${encodeURIComponent(designImage)}&url=${encodeURIComponent(eventPageUrl)}&description=${shareText}`, '_blank')}
                            sx={{ color: '#E60023', fontSize: '30px' }}
                        >
                            <PinterestIcon fontSize="inherit" />
                        </IconButton>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            padding: '12px',
                            fontSize: '16px',
                            marginTop: '10px',
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' }
                        }}
                        onClick={() => alert('Event ready to share!')}
                    >
                        Save Event
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default EventPage;
