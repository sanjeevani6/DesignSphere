const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const DesignImage = require('../models/DesignImage');  // Import your design image model
// const DesignImage = require('../models/DesignImage');  // Import your design image model
const verifyToken = require('../middlewares/verifyToken');

router.get('/events/:designId', async (req, res) => {
    const { designId } = req.params;
  console.log('design id',designId)
//   console.log('team id',teamCode)
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

        console.log(designImage);
        // Check if the design image URL was found in the database
        if (!designImage || !designImage.imageUrl) {
            return res.status(404).json({ message: 'Design image URL not found in the database.' });
        }

        // Construct the absolute path to the image file based on the retrieved URL
        //const designPath = '/'+ designImage.imageUrl.replace(/\\/g, '/');
        const designPath = path.join(__dirname, '..', designImage.imageUrl).replace(/\\/g, '/');
        const reldesignPath =           '/'+ designImage.imageUrl.replace(/\\/g, '/');
        console.log('Design path:', designPath);
      
        // Check if the design file exists
        if (!fs.existsSync(designPath)) {
            return res.status(404).json({ message: 'Design image file not found.' });
        }
       // res.status(200).json({ imageUrl: `/uploads/designimage/${designImage.imageName}` });

       res.status(200).json({
            relimageUrl:reldesignPath,
           imageUrl: designPath})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving design details.' });
    }
});

router.post('/send', async (req, res) => {
    const { designId, userDetails,teamCode } = req.body.payload;
    console.log('Print details:', req.body);
    const effectiveDesignId = teamCode ? teamCode : designId; // ✅ Use a new variable
    console.log(`Printing with ID: ${effectiveDesignId}`);console.log(`printing ${teamCode}`);
      
    try {
        // Query the database to get the image URL for the given designId
        // Check if the provided effectiveDesignId is an ObjectId (for designs)
        const isObjectId = mongoose.Types.ObjectId.isValid(effectiveDesignId);
        
        let designImage;
        if (isObjectId) {
            // Query for individual design using designId
            designImage = await DesignImage.findOne({ designId: effectiveDesignId });
        } else {
            // Query for team project using teamCode
            designImage = await DesignImage.findOne({ teamCode: effectiveDesignId });
        }

        
        // Check if the design image URL was found in the database
        if (!designImage || !designImage.imageUrl) {
            return res.status(404).json({ message: 'Design image URL not found in the database.' });
        }

        // Construct the absolute path to the image file based on the retrieved URL
        const designPath = path.join(__dirname, '..', designImage.imageUrl).replace(/\\/g, '/');
        console.log('Design path:', designPath);

        // Check if the design file exists
        if (!fs.existsSync(designPath)) {
            return res.status(404).json({ message: 'Design image file not found.' });
        }

        
            let testAccount = await nodemailer.createTestAccount();
            console.log('Ethereal Account:', testAccount);
        
        
        


        // Set up Nodemailer to send the image and details to the shop
        const transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
               user: testAccount.user,
               pass: testAccount.pass
            },
        });
        // Email options with image attachment and user details
        const mailOptions = {
            from: testAccount.user,   // Replace with your email
            to: 'shop-email@example.com',   // Replace with the local shop's email
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
       
      const info=  await transporter.sendMail(mailOptions);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info)); // Preview URL for testing
       
        res.status(200).json({ message: 'Design and details sent to the shop successfully!' });

    } catch (error) {
        console.error('Error sending design to shop:', error);
        res.status(500).json({ message: 'Failed to send design to shop.', error });
    }
});

module.exports = router;

