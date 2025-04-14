import React, { useEffect,useState} from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { AppBar, Toolbar, Grid, Tooltip, IconButton,useMediaQuery } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BrushIcon from "@mui/icons-material/Brush";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axiosInstance';;
import {message} from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { styled } from '@mui/system';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import img5 from '../assets/img5.png';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;



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

const Login = ({ setUser }) => {
  const isSmallScreen = useMediaQuery("(max-width: 700px)");
  const navigate = useNavigate();

   // Local state to manage user and loading
   const [localUser, setLocalUser] = useState(null);
   const [loading, setLoading] = useState(true);
 
// Check if already logged in (via cookie)
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/check-auth`, {
          withCredentials: true,
        });
        if (res.data.user) {
          setUser(res.data.user);
          setLocalUser(res.data.user);
          navigate('/home');
        }
      } catch (err) {
        console.log("🧪 Not logged in:", err?.response?.data?.message || err.message);
      }
      finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, [navigate,setUser]);

  const onGoogleLoginSuccess = async (res) => {
    try {
      const decoded = jwtDecode(res.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      };
  
      console.log("📤 Google Login Data:", userData);
  
      const response = await axios.post(`${BASE_URL}/users/google-login`, userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
  
      setUser(response.data.user);
      message.success('Login successful via Google');
      navigate('/home');
    } catch (error) {
      console.error('❌ Google login failed:', error);
      message.error('Google login failed. Please try again.');
    }
  };
  

  const onGoogleLoginError = (res) => {
    console.log('Google login failed', res);
    message.error('Google login failed');};

 

  
  const submitHandler = async (e) => {
    e.preventDefault(); // prevent page reload
    const formData = new FormData(e.currentTarget);
    const values = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };
  
    console.log("📤 Sending Data to Backend:", values);
  
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, values, {
        withCredentials: true,
       
      });
     console.log("response data in login:",response.data);
      setUser(response.data.user); // Set parent user state
      console.log("before message");
      message.success('Login successful');
      console.log("after message");
      navigate('/home');
    } catch (error) {
      console.error("❌ Login error:", error);
      message.error("Invalid username or password");
    }
  };
  if (loading) {
    return <h1>Loading...</h1>;
  }
  
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
