import React, { useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { AppBar, Toolbar, Grid, Tooltip, IconButton,useMediaQuery } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BrushIcon from "@mui/icons-material/Brush";
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
  const isSmallScreen = useMediaQuery("(max-width: 700px)");
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
    <> 
      <AppBar position="sticky" sx={{ backgroundColor: '#f5c5b3' }}>
        <Toolbar>
          <Typography
            variant={isSmallScreen ? "h6" : "h4"}
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontFamily: "'Chewy', cursive",
              letterSpacing: "2px",
              color: "#593125",
              textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
              <BrushIcon sx={{ marginRight: 0.2 }} /> {!isSmallScreen && "DesignSphere"}
            </Link>
          </Typography>

          <Grid container spacing={2} justifyContent="flex-end">
           <Grid item>
                          <Tooltip title="Home">
                              <Link className="nav-link active" to="/">
                              <Button sx={{ color: 'black' }} href="/"> HOME</Button>
                              
                            </Link>
                            </Tooltip>
                          </Grid>
            <Grid item>
              <Button sx={{ color: 'black' }} href="#features">Features</Button>
            </Grid>
            <Grid item>
              <Button sx={{ color: 'black' }} href="#contact">Contact</Button>
            </Grid>
            <Grid item>
              <Tooltip title="Login">
                <Link to="/login">
                  <IconButton sx={{ color: 'black' }}>
                    <LoginIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Register">
                <Link to="/register">
                  <IconButton sx={{ color: 'black' }}>
                    <AccountCircleIcon />
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
