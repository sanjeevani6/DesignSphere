const express=require('express')
const cors=require('cors')
const http = require('http');
const morgan=require('morgan')
const dotenv= require('dotenv')
const colors=require('colors')
const multer = require('multer');
const socketIo = require('socket.io');

const { Server } = require('socket.io');
//const { v4: uuidv4 } = require('uuid'); // for generating unique team codes

const connectDb = require('./config/connectDb')

// Import routes and socket handler
const teamRoutes = require('./routes/projectRoutes');
const canvasSocket = require('./sockets/canvasSocket');
const sidebarItemsRoutes = require('./routes/sidebarRoutes');
const savedesignRoutes = require('./routes/savedesignRoutes');
const templatesRoutes = require('./routes/templatesRoutes');
//const projectRoutes = require('./routes/projectRoutes');
//config dot env file
dotenv.config();
//database call
connectDb();

//rest object
const app=express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000/api/v1",  // Allow only your client origin
      methods: ["GET", "POST","PUT"],
      credentials: true
    }
  });

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



//sidebaritems and fileupload (images)
app.use('/api/v1/designpage', sidebarItemsRoutes);
//get templates
app.use('/api/v1/templates', templatesRoutes);

//save design
app.use('/api/v1/designs',savedesignRoutes);

//app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/teams', teamRoutes);



// Socket.io for real-time collaboration
canvasSocket(io);

//port
const PORT=8080||process.env.PORT;

//listen server
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})