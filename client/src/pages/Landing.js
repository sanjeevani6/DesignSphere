import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Grid, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import Slider from 'react-slick';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';  // Icon for Login
import LoginIcon from '@mui/icons-material/Login';  // Icon for Signup
import ContactMailIcon from '@mui/icons-material/ContactMail';  // Icon for Contact
//import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// Custom styles (will include images for the features)

const Landing = () => {
  const [slider, setSlider] = useState(null); // Store the slider reference

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false, // No arrows
    dots: true, // Show dots for navigation
    centerMode: true, // Center the active slide
    centerPadding: '0', // Prevent unnecessary padding on the sides
  };

  const featureData = [
    {
      title: 'Drag and Drop Functionality',
      description: 'Seamlessly create and customize designs with our intuitive drag-and-drop interface.',
      image: 'https://cdn2.editmysite.com/images/landing-pages/global/features/Website-Builder/drag-drop-screen@2x.png',
    },
    {
      title: 'Save and Download Designs',
      description: 'Save your creations and download them in multiple formats including PNG, JPEG, and SVG.',
      image: 'https://converter.app/jpeg-to-pdf/images/jpeg-to-pdf.png',
    },
    {
      title: 'Real-Time Collaborative Designs',
      description: 'Work together in real-time on the same project with teammates or clients, no matter where you are.',
      image: 'https://img.freepik.com/premium-photo/group-multiethnic-business-people-working-together-project-while-sitting-modern-office_673498-156.jpg?w=1480',
    },
    {
      title: 'Eventify',
      description: 'Create event designs effortlessly and share them with your team or clients instantly.',
      image: 'https://www.westcounty.com/wp-content/uploads/2019/05/posting-to-social-media.jpg',
    },
    {
      title: 'Print-Ready Designs',
      description: 'Easily convert your designs to print-ready formats and get them professionally printed.',
      image: 'https://www.catdi.com/wp-content/uploads/2022/12/AdobeStock_119955021-scaled-1.jpeg',
    },
  ];

  return (
      <div className="App">
     {/* Navbar */}
     <AppBar position="sticky" sx={{ backgroundColor: '#684B74' }}>
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
            
              <IconButton color="inherit" href="/login">
                <LoginIcon />
                <Link className="nav-link active" to="/login"></Link>
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="inherit" href="/register" >
                <AccountCircleIcon />
                <Link className="nav-link active" to="/register"></Link>
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    {/* Header Section */}
    <header className="hero-section">
      <Container className="text-center">
        <h1 className="site-title">DesignSphere</h1>
        <p className="tagline">Unleash your creativity with our powerful design tools</p>
       
      </Container>
    </header>
    {/* Get Started and Contact Details */}
    <section className="cta-section">
        <Container className="text-center">
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Button style={{backgroundColor:'#684B74', color:'white',height:'7vh'}} className="cta-button" size="large" href="/register">
                Start Designing
              </Button>
            </Grid>
          </Grid>
        </Container>
      </section>


    {/* Features Section with Carousel */}
    <section className="features-section" id='features'>
      <Container>
        {/* <h2 className="text-center mb-5">Features</h2> */}
        <Slider {...settings} ref={(slider) => setSlider(slider)}>
          {featureData.map((feature, index) => (
            <div key={index} className="carousel-item">
              <img src={feature.image} alt={feature.title} className="feature-image" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </Slider>
      </Container>
    </section>
    


    {/* Footer Section with Contact Info */}
    <footer id="contact" className="footer-section text-center">
      <Container>
        <h4>Contact Us</h4>
        <p>Email: contact@designsphere.com</p>
        <p>Phone: +1 (555) 123-4567</p>
      </Container>
    </footer>
  </div>
);
};
export default Landing;