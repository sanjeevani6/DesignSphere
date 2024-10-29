import React, { useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode }from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();

  const onGoogleLoginSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    localStorage.setItem('user', JSON.stringify(decoded));
    message.success('Google login successful');
    navigate('/');
  };

  const onGoogleLoginError = (res) => {
    console.log('Google login failed', res);
    message.error('Google login failed');
  };
 
  

 

  const submitHandler = async (values) => {
    try {
      const { data } = await axios.post('/users/login', values);
      message.success('Login successful');
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
      navigate('/');
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
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
