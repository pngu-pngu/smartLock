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
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HistoryIcon from '@mui/icons-material/History';
import * as API from '../api.js';

export const NavBarCustom = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userKind, setUserKind] = useState(null);
  const [givenName, setGivenName] = useState(""); // User's given name
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

  const handleSignOut = async () => {
    try {
      navigate('/'); // Redirect to home page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Drawer content for driver and sponsor

  const menuItems = {
    noGroup: [
      { text: "About", icon: <AssessmentRoundedIcon />, path: "/about" },
      { text: "History", icon: <HistoryIcon />, path: "/history" } 
    ]
  };
  

  const DrawerList = (

    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
      {menuItems.noGroup.map((item) => (
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
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuRoundedIcon sx={{ color: "white" }} />
          </IconButton>
          <Link to="/about" style={{ color: 'inherit', textDecoration: 'none', marginLeft: 10 }}>
            <HomeRoundedIcon sx={{ color: "white" }} />
          </Link>
          <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 2 }}>
            Hello, {givenName}
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};
