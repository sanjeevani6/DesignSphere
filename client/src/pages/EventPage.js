import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Container, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';

const EventPage = () => {
    const { designId } = useParams();
    const [designTitle, setDesignTitle] = useState('');
    const [designImage, setDesignImage] = useState(''); // Store design image URL
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
                setDesignImage(response.data.imageUrl); // Assuming `imageUrl` is correct
            } catch (error) {
                console.error('Error fetching design:', error);
            }
        };
        fetchDesignTitle();
    }, [designId]);

    useEffect(() => {
        if (designImage) {
            const metaTags = [
                // Open Graph Meta Tags for Facebook and LinkedIn
                { property: 'og:title', content: eventDetails.title || 'Event Title' },
                { property: 'og:description', content: eventDetails.description || 'Event Description' },
                { property: 'og:image', content: designImage },
                { property: 'og:url', content: `http://localhost:3000/events/${designId}` },
                
                // Twitter Card Meta Tags for Twitter
                { name: 'twitter:title', content: eventDetails.title || 'Event Title' },
                { name: 'twitter:description', content: eventDetails.description || 'Event Description' },
                { name: 'twitter:image', content: designImage },
                { name: 'twitter:card', content: 'summary_large_image' },

                // Pinterest Meta Tags for Pinterest
                { name: 'pinterest:title', content: eventDetails.title || 'Event Title' },
                { name: 'pinterest:description', content: eventDetails.description || 'Event Description' },
                { name: 'pinterest:image', content: designImage }
            ];

            metaTags.forEach(({ property, name, content }) => {
                const metaTag = document.createElement('meta');
                if (property) {
                    metaTag.setAttribute('property', property);
                }
                if (name) {
                    metaTag.setAttribute('name', name);
                }
                metaTag.setAttribute('content', content);
                document.head.appendChild(metaTag);
            });
        }
    }, [eventDetails, designImage, designId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventDetails((prev) => ({ ...prev, [name]: value }));
    };

    const eventPageUrl = `http://localhost:3000/events/${designId}`;
    const shareText = encodeURIComponent(`Check out this event: ${eventDetails.title}`);

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Typography variant="h5">Create Event for: {designTitle}</Typography>
            <form>
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
                    rows={4}
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

                <Typography variant="subtitle1" style={{ marginTop: '16px' }}>
                    Share this event on:
                </Typography>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <IconButton
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${eventPageUrl}`, '_blank')}
                    >
                        <FacebookIcon style={{ color: '#4267B2' }} />
                    </IconButton>
                    <IconButton
                        onClick={() => window.open(`https://www.linkedin.com/shareArticle?url=${eventPageUrl}&title=${shareText}`, '_blank')}
                    >
                        <LinkedInIcon style={{ color: '#0A66C2' }} />
                    </IconButton>
                    <IconButton
                        onClick={() => window.open(`https://twitter.com/share?url=${eventPageUrl}&text=${shareText}`, '_blank')}
                    >
                        <TwitterIcon style={{ color: '#1DA1F2' }} />
                    </IconButton>
                    <IconButton
                        onClick={() => window.open(`https://pinterest.com/pin/create/bookmarklet/?media=${encodeURIComponent(designImage)}&url=${encodeURIComponent(eventPageUrl)}&is_video=[]&description=${encodeURIComponent(shareText)}`, '_blank')}
                    >
                        <PinterestIcon style={{ color: '#E60023' }} />
                    </IconButton>
                </div>
                
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: '16px' }}
                    onClick={() => alert('Event ready to share!')}
                >
                    Save Event
                </Button>
            </form>
        </Container>
    );
};

export default EventPage;
