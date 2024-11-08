// src/pages/PrintOrderPage.js
import React, { useEffect, useState ,useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Box } from '@mui/material';

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

    const handlePrint = () => {
        if (designRef.current) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Design</title>
                        <style>
                            img { max-width: 100%; height: auto; }
                        </style>
                    </head>
                    <body>
                        ${designRef.current.outerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
        
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
        <div className="print-order-container">
            <h2>Print Order Page</h2>
            {design && (
                <div>
                    
                    <Box component="form" sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6">Enter Your Details for Print Order</Typography>
                        <TextField
                            label="Name"
                            name="name"
                            value={userDetails.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={userDetails.email}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={userDetails.phone}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            label="Address"
                            name="address"
                            value={userDetails.address}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            required
                        />
                    </Box>
                    <div style={{ marginTop: '20px' }}>
                        <Button variant="contained" onClick={handlePrint} style={{ marginRight: '10px' }}>
                            Print
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSendToShop}>
                            Send to Shop
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrintOrderPage;

