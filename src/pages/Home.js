import { Link } from "react-router-dom"
import { NavBarCustom } from "../components/navBarCustom";
import React, { useState, useEffect } from 'react';
import * as API from '../api.js';
import { Container, Card, CardMedia, CardContent, Typography, Grid , Box, Alert} from "@mui/material";

export default function Home() {
  const [lockStatus, setLockStatus] = useState("Loading...");
  const [batteryLevel, setBatteryLevel] = useState("Loading...");
  const batteryThreshold = 20;


  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await API.getStatus(); 
      setLockStatus(response.lock_status);
      setBatteryLevel(response.battery_level);
      } catch (error) {
        console.error("Error fetching lock info:", error);
        setLockStatus("Error");
        setBatteryLevel("Error");
      }
    };
    fetchData();


  }, []);
  const showLowBatteryWarning = batteryLevel !== "Loading..." && batteryLevel <= batteryThreshold;
  return (
    <Box p={4}>
      <Typography variant="h3" gutterBottom>Home Page</Typography>

      {showLowBatteryWarning && (
      <Alert severity="warning" sx={{ mb: 2 }}>
         Warning: Battery level is low!
      </Alert>
      )}


      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5"> Lock Status: {lockStatus}</Typography>
          <Typography variant="h6"> Battery Level: {batteryLevel}%</Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>Navigate</Typography>
      <ul>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/Profile">Profile</Link></li>
        <li><Link to="/History">History</Link></li>
      </ul>
    </Box>
  );
}

