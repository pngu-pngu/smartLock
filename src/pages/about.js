//import * as React from 'react';
//import Box from '@mui/material/Box';
//import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function About() {
  return (
    <Box p={4}>
      <Typography variant="h3" gutterBottom>
        Welcome to SmartLock
      </Typography>

      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1">
          With SmartLock, we aim to use facial recognition to provide an efficient, convenient, and secure way to allow individuals to enter or exit an entryway.
        </Typography>
      </Paper>

      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          How it works
        </Typography>
        <Typography variant="body1">
          The first step in the setup process is creating an account. Once your account is set up, you will be able to update your profile.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          The home page displays the status of your lock and its current battery level. It will also allow you to navigate to the other pages.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          If you want to add people who can unlock the system, click the menu icon in the top left corner and select the Trusted page. This page will allow you to add trusted users as well as update or delete current ones.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          If you want to view who has previously approached the lock, navigate to the History page. This will display a list of the most recent people who have approached the camera, the date and time in which it happened, and whether or not the lock was unlocked for them.
        </Typography>
      </Paper>
    </Box>
  );
}

