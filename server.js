const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const dotenv= require('dotenv')
const colors=require('colors')
const multer = require('multer');
const connectDb = require('./config/connectDb')
const sidebarItemsRoutes = require('./routes/sidebarRoutes');
const savedesignRoutes = require('./routes/savedesignRoutes');
const templatesRoutes = require('./routes/templatesRoutes');
const sendRoutes = require('./routes/sendRoutes');
const designimageRoutes=require('./routes/designImageRoutes')

//config dot env file
dotenv.config();
//database call
connectDb();

//rest object
const app=express()

//middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

//for testing only
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

//routes

//for user 
app.use('/api/v1/users',require('./routes/userRoute'))
//design page

// Serve static files from the 'uploads' directory
app.use('/api/v1/uploads/images', express.static('uploads/images'));
app.use('/api/v1/uploads/templates', express.static('uploads/templates'));
app.use('/api/v1/uploads/stickers', express.static('uploads/stickers'));
app.use('/api/v1/uploads/animations', express.static('uploads/animations'));
app.use('/api/v1/uploads/artelements', express.static('uploads/artelements'));
app.use('/api/v1/uploads/designimage',express.static('uploads/designimage'));

//sidebaritems and fileupload (images)
app.use('/api/v1/designpage', sidebarItemsRoutes);
//get templates
app.use('/api/v1/templates', templatesRoutes);

//save design
app.use('/api/v1/designs',savedesignRoutes);
//print design 
app.use('/api/v1/shop',sendRoutes);
//upload design image in server
app.use('/api/v1/store',designimageRoutes);
//port
const PORT=8080||process.env.PORT;

//listen server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})