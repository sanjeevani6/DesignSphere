// src/pages/PrintOrderPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import Header from '../components/Layouts/Header';

const PrintOrderPage = () => { 
   
    const { designId,teamCode } = useParams();
    const [design, setDesign] = useState(null);
    const [teamDesign, setTeamDesign] = useState(null);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    console.log(`teamcode ${teamCode}`);
    
    const designRef = useRef(null); // Reference to the design image for printing
    useEffect(() => {
        const fetchDesignDetails = async () => {
            let response;
            try {
                if(teamCode){
                    response=await axios.get(`/api/v1/designs/team-designs/${teamCode}`,{
                        withCredentials: true ,
                    })
                    setTeamDesign(response.data)
                }
                else{
                 response = await axios.get(`/api/v1/designs/${designId}`,{
                     withCredentials: true 
                 });
                setDesign(response.data);
                }
                console.log("design:",response.data);
            } catch (error) {
                console.error('Error fetching design details:', error);
            }
        };

        fetchDesignDetails();
    }, [designId,teamCode]);

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
            const payload = teamCode
            ? { teamCode, userDetails }
            : { designId, userDetails };

           console.log("sending from frontend to backend for printing");
            await axios.post(`/api/v1/shop/send`,payload,
                { withCredentials: true });
                
           
        
            alert("Design and details sent to local shop!");
        } catch (error) {
            console.error("Failed to send design to shop:", error);
        }
    };

  return (
    <>
      <Header />
      <div
        className="print-order-container"
        style={{
          backgroundColor: '#fffdf0', // Neutral background (not yellow)
          padding: '20px',
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <Paper
          className="print-order-card"
          elevation={3}
          sx={{
            borderRadius: 2,
            p: 3,
            maxWidth: 400,
            width: '100%',
            backgroundColor: '#fffdf0',
            border: '2px solid #f6bea9', // Orange border
          }}
        >
          <Typography
            variant="h4"
            className="print-order-header"
            sx={{
              fontFamily: "'Chewy', cursive",
              color: '#519bc5', // Blue header
              mb: 2,
              textAlign: "center",
            }}
          >
            Print Order Page
          </Typography>
          {(design || teamDesign) && (
            <>
              <Box
                component="form"
                className="print-order-form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Chewy', cursive",
                    color: '#ffb8b8', // Pink subheading
                  }}
                >
                  Enter Your Details for Print Order
                </Typography>
                <TextField
                  label="Name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90b0e6" }, // Navy blue accent
                      "&:hover fieldset": { borderColor: "#90b0e6" },
                      "&.Mui-focused fieldset": { borderColor: "#90b0e6" },
                    },
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90b0e6" },
                      "&:hover fieldset": { borderColor: "#90b0e6" },
                      "&.Mui-focused fieldset": { borderColor: "#90b0e6" },
                    },
                  }}
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90b0e6" },
                      "&:hover fieldset": { borderColor: "#90b0e6" },
                      "&.Mui-focused fieldset": { borderColor: "#90b0e6" },
                    },
                  }}
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
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90b0e6" },
                      "&:hover fieldset": { borderColor: "#90b0e6" },
                      "&.Mui-focused fieldset": { borderColor: "#90b0e6" },
                    },
                  }}
                />
              </Box>
              <Button
  className="send-to-shop-button"
  onClick={handleSendToShop}
  variant="contained"
  sx={{
    backgroundColor: '#90b0e6', // New button color: Navy Blue
    color: "#fff",
    '&:hover': { backgroundColor: "#519bc5" }, // Hover color: Blue
    width: "100%",
    py: 1,
  }}
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
