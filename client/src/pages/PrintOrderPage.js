// src/pages/PrintOrderPage.js
import React, { useEffect, useState ,useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Box ,Paper} from '@mui/material';
import Header from '../components/Layouts/Header';

const PrintOrderPage = () => {
    const { designId } = useParams();
    const [design, setDesign] = useState(null);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const designRef = useRef(null); // Reference to the design image for printing
    useEffect(() => {
        const fetchDesignDetails = async () => {
            try {
                const response = await axios.get(`/designs/${designId}`);
                setDesign(response.data);
                console.log("design:",response.data);
            } catch (error) {
                console.error('Error fetching design details:', error);
            }
        };

        fetchDesignDetails();
    }, [designId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

   

    const handleSendToShop = async () => {
        try {
            if (!userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.address) {
                alert("Please fill in all details before sending to shop.");
                return;
            }

            await axios.post(`/shop/send`, {
                designId,
                userDetails,
            });
            alert("Design and details sent to local shop!");
        } catch (error) {
            console.error("Failed to send design to shop:", error);
        }
    };

    return (
        <>
        <Header />
        <div className="print-order-container">
            <Paper className="print-order-card">
                <Typography variant="h4" className="print-order-header">
                    Print Order Page
                </Typography>
                {design && (
                    <>
                        <Box component="form" className="print-order-form">
                            <Typography variant="h6">Enter Your Details for Print Order</Typography>
                            <TextField
                                label="Name"
                                name="name"
                                value={userDetails.name}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={userDetails.email}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={userDetails.phone}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                name="address"
                                value={userDetails.address}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                required
                                fullWidth
                            />
                        </Box>
                        <Button
                            className="send-to-shop-button"
                            onClick={handleSendToShop}
                        >
                            Send to Shop
                        </Button>
                    </>
                )}
            </Paper>
        </div>
    </>
        );
};

export default PrintOrderPage;
