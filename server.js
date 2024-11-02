const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const dotenv= require('dotenv')
const colors=require('colors')
const multer = require('multer');
const connectDb = require('./config/connectDb')
const sidebarItemsRoutes = require('./routes/sidebarRoutes');
const savedesignRoutes = require('./routes/savedesignRoutes');
//config dot env file
dotenv.config();
//database call
connectDb();
//set up multer for file uploads

 // Folder to store images
const upload = multer({ dest: 'uploads/' });
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
app.use('/api/v1/uploads', express.static('uploads'));

//sidebaritems and fileupload (images)
app.use('/api/v1/designpage', sidebarItemsRoutes);


//save design
app.use('/api/v1/designs',savedesignRoutes);
//port
const PORT=8080||process.env.PORT;

//listen server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})