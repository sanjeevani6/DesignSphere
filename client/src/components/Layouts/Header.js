import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, useMediaQuery, Menu, MenuItem } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import BrushIcon from "@mui/icons-material/Brush";
import CollectionsIcon from "@mui/icons-material/Collections";
import MenuIcon from "@mui/icons-material/Menu"; // Icon for dropdown menu
import { message } from "antd";

const Header = () => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
  const [loginUser, setLoginUser] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const teamCode = location.pathname.includes("/design/team/")
    ? location.pathname.split("/design/team/")[1]
    : null;

  const logoutHandler = () => {
    localStorage.removeItem("user");
    message.success("Logout successful");
    navigate("/login");
  };

  const handleTemplatesNavigation = () => {
    if (teamCode) {
      navigate("/templates", { state: { teamCode } });
    } else {
      navigate("/templates");
    }
  };

  // Handle opening and closing the menu
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#f3ccc0", padding: "10px", color: "black" }}>
      <Toolbar>
        {/* Title with Logo */}
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
          <Link
            to="/home"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <BrushIcon sx={{ marginRight: 0.2 }} /> {!isSmallScreen && "DesignSphere"}
          </Link>
        </Typography>

        {/* Dropdown for Very Small Screens */}
        {isVerySmallScreen ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
              <MenuItem onClick={() => navigate("/home")}>
                <HomeIcon sx={{ marginRight: 1 }} /> Home
              </MenuItem>
              <MenuItem onClick={() => navigate("/design")}>
                <BrushIcon sx={{ marginRight: 1 }} /> Design
              </MenuItem>
              <MenuItem onClick={handleTemplatesNavigation}>
                <CollectionsIcon sx={{ marginRight: 1 }} /> Templates
              </MenuItem>
              {loginUser && (
                <MenuItem>
                  <Box
                    sx={{
                      backgroundColor: "#f4eaea",
                      padding: "5px 10px",
                      borderRadius: "10px",
                      color: "#593125",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      border: "1px solid #3A3A4A",
                      boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {loginUser.name}
                  </Box>
                </MenuItem>
              )}
              <MenuItem onClick={logoutHandler}>
                <LogoutIcon sx={{ marginRight: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          /* Regular Layout for Larger Screens */
          <>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button color="inherit" startIcon={<HomeIcon />} component={Link} to="/home">
                {!isSmallScreen && "Home"}
              </Button>
              <Button color="inherit" startIcon={<BrushIcon />} component={Link} to="/design">
                {!isSmallScreen && "Design"}
              </Button>
              <Button color="inherit" startIcon={<CollectionsIcon />} onClick={handleTemplatesNavigation}>
                {!isSmallScreen && "Templates"}
              </Button>
            </Box>

            {/* Right Section: User Info and Logout */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "15px", marginLeft: "20px" }}>
              {loginUser && (
                <Box
                  sx={{
                    backgroundColor: "#f4eaea",
                    padding: isSmallScreen ? "5px 10px" : "8px 15px",
                    borderRadius: "10px",
                    color: "#593125",
                    fontWeight: "bold",
                    fontFamily: "Poppins",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    border: "1px solid #3A3A4A",
                    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {loginUser.name}
                </Box>
              )}
              <IconButton color="inherit" onClick={logoutHandler}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
