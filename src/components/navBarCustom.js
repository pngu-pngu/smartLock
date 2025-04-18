import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem,
  Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import StoreMallDirectoryRoundedIcon from '@mui/icons-material/StoreMallDirectoryRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import DriveEtaRoundedIcon from '@mui/icons-material/DriveEtaRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HistoryIcon from '@mui/icons-material/History';
import * as API from '../api.js';
import { useContext } from 'react';
import UserContext from '../context/UserContext';


const theme = createTheme({
  palette: {
    primary: {
      main: "#6a5acd", // Change this to any color (e.g., green)
    },
    secondary: {
      main: "#FFFFFF",
    },
    /*tertiary: {
      main: "#E0E0E0", // Custom Tertiary Color (Orange-Red)
    },*/
  },
});



export const NavBarCustom = () => {


  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userKind, setUserKind] = useState(null);
  const [givenName, setGivenName] = useState(""); // 👈 User's given name


  const navigate = useNavigate();


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 👇 Fetch the user's name on component load
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const userId = localStorage.getItem('user_id'); // You can update this if it's dynamic
          const userData = await API.userAPI.getById(userId);
          console.log("userData",userData.values[0]);
          // If API returns an array: setGivenName(userData[0]?.given_name || "User");
          setGivenName(userData.values[0].user_firstName || "User");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setGivenName("Guest");
        }
      };
  
      fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      // Clear user session
      localStorage.removeItem('user_id');
      localStorage.clear();
  
      // Redirect to sign-in page
      navigate('/signInUp');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Drawer content for driver and sponsor

  const menuItems = {
    noGroup: [
      { text: "About", icon: <StoreMallDirectoryRoundedIcon />, path: "/about" },
      { text: "History", icon: <HistoryIcon />, path: "/history" } ,
      { text: "Profile", icon: <AccountCircleRoundedIcon />, path: "/profile"},
      { text: "Trusted", icon: <AssessmentRoundedIcon />, path: "/trusted"}
    ]
  };
  

  const DrawerList = (

    <Box 
    sx={{ 
        width: 250, 
        backgroundColor: '#E0E0E0',  // Light grey
        height: '100vh' // Ensure it covers the full drawer height
      }} 
      role="presentation" 
      onClick={toggleDrawer(false)}>

      <List>

        {(menuItems.noGroup || []).map((item) => (

          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        
        <AppBar position="static">

        <Toolbar sx={{ position: "relative" }}>
        {/* Left: Drawer + Home Button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuRoundedIcon sx={{ color: "white" }} />
          </IconButton>
          <Link to="/home" style={{ textDecoration: 'none', marginLeft: 10 }}>
            <HomeRoundedIcon sx={{ color: "white" }} />
          </Link>
        </Box>

        {/* Center: Greeting */}
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
          }}
        >
          Hello, {givenName}
        </Typography>

        {/* Right: Profile Icon + Menu */}
        <Box sx={{ marginLeft: "auto" }}>
          <IconButton onClick={handleMenuOpen}>
            <AccountCircleRoundedIcon sx={{ color: "white" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>

        </AppBar>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>

    </ThemeProvider>
  );
};
