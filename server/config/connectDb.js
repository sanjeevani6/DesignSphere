const mongoose=require('mongoose')
const colors = require('colors');
require('dotenv').config();

const connectDb=async()=>{
    const dbURI = process.env.MONGO_URL;
    if (!dbURI) {
        console.error("❌ MongoDB URI is not defined! Check your .env file.".bgRed);
        process.exit(1);
    }
    console.log("✅ MongoDB URI found:", dbURI);
try{
 //await mongoose.connect(process.env.MONGO_URL)
 await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

 console.log(`server running on ${mongoose.connection.host}`.bgCyan.white);
}
catch(error){
    console.log(`${error}`.bgRed)
}
}
module.exports=connectDb;