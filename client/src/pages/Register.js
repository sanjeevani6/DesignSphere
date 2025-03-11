import './Register.css';
import React ,{useState,useEffect}from 'react'
import{Form,Input,message}from 'antd'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { Button, Container, Grid, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import Slider from 'react-slick';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';  // Icon for Login
import LoginIcon from '@mui/icons-material/Login';  // Icon for Signup
import ContactMailIcon from '@mui/icons-material/ContactMail';  // Icon for Contact 

const Register=()=>{

    const navigate= useNavigate()
    // form submit
     const SubmitHandler=async (values)=>{
      console.log("📤 Sending Data to Backend:", values);
        try{
          const response = await axios.post('/users/register', values,{
            withCredentials: true, // Ensures cookies are sent
            headers: { "Content-Type": "application/json" },
          });
          console.log("response got",response)
          
            
          // Store access token & user data in localStorage
          
          const user = { ...response.data.user, password: '' };
          localStorage.setItem('user', JSON.stringify(user));
            message.success('registration successful')
            navigate('/login');
        }
        catch(error){
        message.error("invalid username or password");
        }
        
     };
     //prevent for login user
     useEffect(()=>{
        if(localStorage.getItem('user')){
            navigate('/home')
        }
     },[navigate]);
    return(
      <>
      {/* Navbar */}
     <AppBar position="sticky" sx={{ backgroundColor: '#684B74' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            DESIGNSPHERE
          </Typography>
          <Grid container spacing={2} justifyContent="flex-end">
            
            <Grid item>
              <IconButton color="inherit" href="/register">
                <LoginIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="inherit" href="/register">
                <AccountCircleIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
          <div className="register-page">
            <Form layout="vertical" onFinish={SubmitHandler}>
            <h1>Register Form</h1>
                <Form.Item label="Name" name="name">
                    <Input/> 
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input type="email"/> 
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input type="password"/> 
                </Form.Item>
                <div className=" justify-content-between">
               <Link to="/login"> Already Register? 
               Click here to login</Link>
               <div>
               <button style={{backgroundColor:'#684B74',color:'white'}}className="btn ">REGISTER</button>
               </div>
                </div>

            </Form> 
          </div>

      </>  
    );
};

export default Register;