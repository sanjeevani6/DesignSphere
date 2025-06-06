import React from "react";
import { Button, AppBar, Toolbar, Grid, Tooltip, IconButton, Typography, Box, useMediaQuery, Container } from "@mui/material";
import { Link } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BrushIcon from "@mui/icons-material/Brush";
import i1_1 from "../assets/i1.png";
import i1_2 from "../assets/i2.png";
import i1_3 from "../assets/i3.png";
import img1 from "../assets/img1.png";
import img2 from "../assets/img3.png";
import img3 from "../assets/img2.png";

const Landing = () => {
  const isSmallScreen = useMediaQuery("(max-width: 700px)");

  return (
    <div className="landing-container" style={{ backgroundColor: "#fffdf0" }}>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#f5c5b3" }}>
        <Toolbar>
          <Typography
            variant={isSmallScreen ? "h6" : "h4"}
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontFamily: "'Chewy', cursive",
              letterSpacing: "2px",
              color: "#593125",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
              <BrushIcon sx={{ marginRight: 0.2 }} /> {!isSmallScreen && "DesignSphere"}
            </Link>
          </Typography>

          <Grid container spacing={2} justifyContent="flex-end">
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

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", padding: 8, backgroundColor: "#90b0e6" }}>
      <Typography
            variant={isSmallScreen ? "h4" : "h2"}
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontFamily: "'Chewy', cursive",
              letterSpacing: "2px",
              color: "whitesmoke",
            }}
          >
          
            Unleash Your Creativity!
          
          </Typography>
        <Typography variant="h5" sx={{ marginTop: 2, color: "#f6bea9" }}>Create stunning campus visuals effortlessly.</Typography>
        <Button
          variant="contained"
          sx={{ marginTop: 3, backgroundColor: "#e46064", color: "#fffdf0", fontSize: "1.2rem", padding: "10px 25px" }}
          component={Link}
          to="/register"
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Container sx={{ marginTop: 5, textAlign: "center" }} id="features">
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 4, color: "#e46064" }}>Why Choose Us?</Typography>
        <Grid container spacing={4}>
          {[{ img: i1_2, title: "Easy-to-Use Editor", desc: "Drag, drop, and customize effortlessly." },
            { img: img1, title: "Custom Templates", desc: "Choose from a variety of pre-made designs." },
            { img: img2, title: "Export & Share", desc: "Download in high-quality formats instantly." }].map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box>
                  <img src={feature.img} alt={feature.title} style={{ width: "80%", borderRadius: 10 }} />
                  <Typography variant="h6" sx={{ marginTop: 2, fontWeight: "bold", color: "#519bc5" }}>{feature.title}</Typography>
                  <Typography sx={{ marginTop: 1, fontSize: "1rem", fontWeight: "500", color: "#444" }}>{feature.desc}</Typography>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Container>

      {/* Extra Features */}
      <Container sx={{ marginTop: 8 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {[{ img: img3, title: "Print-Ready Designs", desc: "Convert your designs to print-ready formats." },
            { img: i1_3, title: "Real-Time Collaboration", desc: "Work with your team anywhere, anytime." },
            { img: i1_1, title: "Drag-and-Drop Functionality", desc: "Seamlessly customize your designs." }].map((feature, index) => (
              <Grid item xs={12} sm={4} key={index} sx={{ textAlign: "center" }}>
                <Box>
                  <img src={feature.img} alt={feature.title} style={{ width: "70%", borderRadius: 10 }} />
                  <Typography variant="h6" sx={{ marginTop: 2, fontWeight: "bold", color: "#f6bea9" }}>{feature.title}</Typography>
                  <Typography sx={{ marginTop: 1, fontSize: "1rem", fontWeight: "500", color: "#444" }}>{feature.desc}</Typography>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#519bc5", color: "#fffdf0", padding: 4, textAlign: "center", marginTop: 8 }} id="contact">
        <Typography variant="h6">Contact Us</Typography>
        <Typography>Email: contact@designsphere.com</Typography>
        <Typography>Phone: +1 (555) 123-4567</Typography>
      </Box>
      <Box sx={{ backgroundColor: "black", color: "#fffdf0", padding: 2, textAlign: "center" }}>
        <Typography>&copy; 2025 Campus Art Creator. All rights reserved.</Typography>
      </Box>
    </div>
  );
};

export default Landing;
