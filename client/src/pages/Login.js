import React, { useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { AppBar, Toolbar, Grid, Tooltip, IconButton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { styled } from '@mui/system';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import img5 from '../assets/img5.png';


const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#fffdf0',
});

const LoginBox = styled(Paper)({
  display: 'flex',
  width: 1000,
  padding: 20,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#519bc5',
  borderRadius: 10,
  position: 'relative',
  overflow: 'hidden',
});

const LeftSection = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffd374',
  borderRadius: '10px 0 0 10px',
  padding: 20,
});

const ImageBox = styled(Box)({
  display: 'grid',
  padding: 10,
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

const Image = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 10,
});

const RightSection = styled(Box)({
  flex: 1,
  padding: 20,
  backgroundColor: '#fffdf0',
  borderRadius: '0 10px 10px 0',
});

const Login = () => {
  const navigate = useNavigate();
  const GITHUB_CLIENT_ID = 'your-github-client-id';

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

  const handleGitHubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
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
    <>  <AppBar position="sticky" sx={{ backgroundColor: '#684B74' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                DESIGNSPHERE
              </Typography>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button color="inherit" href="#features">Features</Button>
                </Grid>
                <Grid item>
                  <Button color="inherit" href="#contact">Contact</Button>
                </Grid>
                <Grid item>
                {/* Replace href with Link */}
                <Tooltip title="Login">
                <Link to="/login">
                  <IconButton color="inherit">
                    <LoginIcon />
                  </IconButton>
    
                </Link>
                </Tooltip>
              </Grid>
                <Grid item>
                <Tooltip title="Register">
                    <Link className="nav-link active" to="/register">
                  <IconButton color="inherit" href="/register" >
                    <AccountCircleIcon/>
                  </IconButton>
                  </Link>
                  </Tooltip>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
     <Container>
      
      <LoginBox>
        <LeftSection>
          <ImageBox>
            <Box><Image src={img1} alt="Image 1" /></Box>
            <Box><Image src={img2} alt="Image 2" /></Box>
            <Box><Image src={img3} alt="Image 3" /></Box>
            <Box><Image src={img4} alt="Image 4" /></Box>
           
            
          </ImageBox>
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
          <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} />
           
          </Box>
        </RightSection>
      </LoginBox>
    </Container>
    </>
   
  );
};

export default Login;
