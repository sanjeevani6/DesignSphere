const express=require('express')
const cors=require('cors')
const morgan=require('morgan')
const dotenv= require('dotenv')
const colors=require('colors')
const connectDb = require('./config/connectDb')
const sidebarItemsRoutes = require('./routes/sidebarRoutes');
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

//routes

//for user 
app.use('/api/v1/users',require('./routes/userRoute'))
//for sidebaritems in design page
app.use('/api/v1/designpage', sidebarItemsRoutes);

//port
const PORT=8080||process.env.PORT

//listen server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})