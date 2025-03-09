const mongoose=require('mongoose');

//schema design

const userSchema=new mongoose.Schema({
 name:{
    type:String,
    required:[true,'name is required'],
 },
 email:{
    type:String,
    required:[true,'email is required and should be unique'],
    unique:true
 },
 password:{
    type:String,
    required:[true,"password is required"],
 },
 googleId: {
   type: String,
   unique: true,
   sparse: true, // Allows for either Google users or regular users
 },
},
{timestamps:true}
);


//export
const userModel=mongoose.model('users',userSchema)
module.exports=userModel;
