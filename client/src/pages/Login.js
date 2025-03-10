import React, { useEffect,useContext } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode }from 'jwt-decode';


const Login = () => {
  const navigate = useNavigate();


  
  const onGoogleLoginSuccess = async (res) => {
    try {
      const decoded = jwtDecode(res.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      };
      
      // Send the user data to the backend to be saved
      const response = await axios.post('/users/google-login', userData);
      localStorage.setItem("jwt_token", response.data.token);  // Save token in localStorage
      // Save user info in localStorage and context
      const user = { ...response.data.user, password: '' }; 
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Logged in user:', user);
      message.success('Google login successful');
      navigate('/home');
    } catch (error) {
      console.error('Error with Google login:', error);
      message.error('Google login failed');
    }
  };
  

  const onGoogleLoginError = (res) => {
    console.log('Google login failed', res);
    message.error('Google login failed');
  };
 
  

 

  const submitHandler = async (values) => {
    try {
      console.log("control before login button")
      const response= await axios.post('/users/login', values,{withCredentials: true});
     
      message.success('Login successful');
       const user = { ...response.data.user, password: '' }; 
      localStorage.setItem('user', JSON.stringify(user));
   
      console.log('Logged in user:', user);
      navigate('/home');
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div className="register-page">
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>LOGIN Form</h1>
        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" />
        </Form.Item>
        <div className="justify-content-between">
          <Link to="/register">Not a User? Click here to register</Link>
          <div>
            <button className="btn btn-primary" type="submit">LOGIN</button>
          </div>
        </div>

        <div>
          <h5>OR</h5>
          <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} />
         
        </div>
      </Form>
    </div>
  );
};

export default Login;
