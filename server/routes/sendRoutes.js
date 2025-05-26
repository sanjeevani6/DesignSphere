const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const DesignImage = require('../models/DesignImage');  // Import your design image model
require('dotenv').config();

const verifyToken = require('../middlewares/verifyToken');

router.get('/events/:designId', async (req, res) => {
    const { designId } = req.params;
  console.log('design id',designId)

    try {
        // Check if the provided designId is a valid ObjectId (for designs)
        const isObjectId = mongoose.Types.ObjectId.isValid(designId);
        
        let designImage;
        if (isObjectId) {
            // Query for individual design
            designImage = await DesignImage.findOne({ designId: designId });
        } else {
            // Query for team project using teamCode (if designId is not an ObjectId)
            designImage = await DesignImage.findOne({ teamCode: designId });
        }

        console.log("design image:",designImage);
        // Check if the design image URL was found in the database
        if (!designImage || !designImage.imageUrl) {
            return res.status(404).json({ message: 'Design image URL not found in the database.' });
        }

        // Construct the absolute path to the image file based on the retrieved URL
       
        const designPath = path.join(__dirname, '..', designImage.imageUrl).replace(/\\/g, '/');
        const reldesignPath =           '/'+ designImage.imageUrl.replace(/\\/g, '/');
        console.log('Design path:', designPath);
      
        // Check if the design file exists
        if (!fs.existsSync(designPath)) {
            return res.status(404).json({ message: 'Design image file not found.' });
        }
      

       res.status(200).json({
            relimageUrl:reldesignPath,
           imageUrl: designPath})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving design details.' });
    }
});

router.post('/send', async (req, res) => { 
    const { designId, userDetails,teamCode } = req.body;
    console.log('Print details:', req.body);
    const effectiveDesignId = teamCode ? teamCode : designId; // ✅ Use a new variable
    console.log(`Printing with ID: ${effectiveDesignId}`);console.log(`printing ${teamCode}`);
      
    try {
        // Query the database to get the image URL for the given designId
        // Check if the provided effectiveDesignId is an ObjectId (for designs)
        console.log("Effective Design ID:", effectiveDesignId);
        console.log("Is Object ID Valid?", mongoose.Types.ObjectId.isValid(effectiveDesignId));

        const isObjectId = mongoose.Types.ObjectId.isValid(effectiveDesignId);
        console.log("objectid",isObjectId)
        
        let designImage;
        if (isObjectId) {
            // Query for individual design using designId
            designImage = await DesignImage.findOne({ designId: effectiveDesignId });
            console.log("designimage",designImage);
        } else {
            // Query for team project using teamCode
            designImage = await DesignImage.findOne({ teamCode: effectiveDesignId });
        }

        
        // Check if the design image URL was found in the database
        if (!designImage || !designImage.imageUrl) {
            return res.status(404).json({ message: 'Design image URL not found in the database.' });
        }
     
       designPath=designImage.imageUrl;

       console.log('Design path:', designPath);


        // Check if the design image path exists
        if (!(designPath)) {
            return res.status(404).json({ message: 'Design image path not found.' });
        }

            console.log('before creating account');
          
        
            // Nodemailer setup for Gmail shop account
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,  // Replace with your dummy Gmail
                    pass: process.env.GMAIL_PASS       // Use app password, not Gmail password
                },
            });
        



        // Email options with image attachment and user details
        const mailOptionsToShop = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Shop's email (send to self)

            subject: 'New Print Order',
            text: `
                Customer Details:
                - Name: ${userDetails.name}
                - Email: ${userDetails.email}
                - Phone: ${userDetails.phone}
                - Address: ${userDetails.address}
                
                Attached is the design for printing.
            `,
            attachments: [
                {
                    filename: designImage.imageName ,
                    path: designPath,
                    contentType: 'image/png',
                },
            ],
        };

        
        // Send the email with the design and user details
       
      const shopEmailInfo=  await transporter.sendMail(mailOptionsToShop);
      console.log('Email sent to shop:', shopEmailInfo.messageId);


           // Auto-reply to customer with a confirmation
           const mailOptionsToUser = {
            from: process.env.GMAIL_USER,
            to: userDetails.email,  // Customer's email
            subject: 'Order Confirmation - Your Design is Being Processed',
            text: `
                Hello ${userDetails.name},

                Thank you for placing your order! We have received your design and will start processing it soon.

                If you have any questions, feel free to contact us.

                Best regards,
                The Print Shop Team
            `,
        };

        const userEmailInfo = await transporter.sendMail(mailOptionsToUser);
        console.log('Confirmation email sent to customer:', userEmailInfo.messageId);
       
        res.status(200).json({ message: 'Design and details sent to the shop successfully!' });

    } catch (error) {
        console.error('Error sending design to shop:', error);
        res.status(500).json({ message: 'Failed to send design to shop.', error });
    }
});

module.exports = router;

