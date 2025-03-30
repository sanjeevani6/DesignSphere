import React, { useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { styled } from '@mui/system';
//import loginIllustration from '../assets/login-illustration.png';

const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#fffdf0',
});

const LoginBox = styled(Paper)({
  display: 'flex',
  width: 800,
  padding: 20,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#519bc5',
  borderRadius: 10,
});

const LeftSection = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffd374',
  borderRadius: '10px 0 0 10px',
  padding: 20,
});

const RightSection = styled(Box)({
  flex: 1,
  padding: 20,
  backgroundColor: '#fffdf0',
  borderRadius: '0 10px 10px 0',
});

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/home');
    }
  }, [navigate]);

  const onGoogleLoginSuccess = async (res) => {
    try {
      const decoded = jwtDecode(res.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      };
      
      const response = await axios.post('/users/google-login', userData);
      const user = { ...response.data.user, password: '' };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  const onGoogleLoginError = () => {
    console.error('Google login failed');
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    try {
      const response = await axios.post('/users/login', values);
      const user = { ...response.data.user, password: '' };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Container>
      <LoginBox>
        <LeftSection>
         <img src={loginIllustration} alt="Login Illustration" style={{ width: '80%', height: 'auto' }} />
        </LeftSection>
        <RightSection>
          <Typography variant="h5" gutterBottom color="#e46064">
            Login to DesignSphere
          </Typography>
          <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Email" name="email" type="email" fullWidth required sx={{ backgroundColor: '#f6bea9', borderRadius: 1 }} />
            <TextField label="Password" name="password" type="password" fullWidth required sx={{ backgroundColor: '#ffb8b8', borderRadius: 1 }} />
            <Button variant="contained" sx={{ backgroundColor: '#90b0e6', color: '#fffdf0' }} type="submit" fullWidth>
              Login
            </Button>
          </Box>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Don't have an account? <Link to="/register" style={{ color: '#519bc5' }}>Register</Link>
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 2, color: '#e46064' }}>OR</Typography>
          <Box sx={{ marginTop: 2 }}>
            <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} />
          </Box>
        </RightSection>
      </LoginBox>
    </Container>
  );
};

export default Login;
