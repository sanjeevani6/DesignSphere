const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const DesignImage = require('../models/DesignImage');
require('dotenv').config();


const printController= async (req, res) => { 
        const { designId, userDetails,teamCode } = req.body;
        console.log('Print details:', req.body);
        const effectiveDesignId = teamCode ? teamCode : designId; //  Used a new variable
        console.log(`Printing with ID: ${effectiveDesignId}`);console.log(`printing ${teamCode}`);
          
        try {
            // Query the database to get the image URL for the given designId
            // Checking if the provided effectiveDesignId is an ObjectId (for designs)
            console.log("Effective Design ID:", effectiveDesignId);
            console.log("Is Object ID Valid?", mongoose.Types.ObjectId.isValid(effectiveDesignId));
    
            const isObjectId = mongoose.Types.ObjectId.isValid(effectiveDesignId);
            console.log("objectid",isObjectId)
            
            let designImage;
            if (isObjectId) {
                // Query for individual design using designId
                designImage = await DesignImage.findOne({ designId: effectiveDesignId });
             
            } else {
                // Query for team project using teamCode
                designImage = await DesignImage.findOne({ teamCode: effectiveDesignId });
            }
            console.log("designimage",designImage);
            
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
              
             console.log('GMAIL_USER:', process.env.GMAIL_USER);
             console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'Provided' : 'Missing');

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
                    Contact Details: 956XXXXXXX

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
    }

    module.exports = { printController };
