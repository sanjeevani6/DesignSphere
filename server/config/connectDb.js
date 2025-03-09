const mongoose=require('mongoose')
const colors = require('colors');
require('dotenv').config();

const connectDb=async()=>{
    const dbURI = process.env.MONGO_URI;  // This should hold your MongoDB URI from .env
console.log(dbURI)
try{
 //await mongoose.connect(process.env.MONGO_URL)
 await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

 console.log(`server running on ${mongoose.connection.host}`.bgCyan.white);
}
catch(error){
    console.log(`${error}`.bgRed)
}
}
module.exports=connectDb;