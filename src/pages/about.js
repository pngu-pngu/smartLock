import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

document.body.style = "margin:0;padding:0";

export default function About() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        // add URL
        //backgroundImage: 'url(https://t3.ftcdn.net/jpg/02/84/06/64/360_F_284066430_2AIa1pJN6fDQWoShnYTO34MoRZHTh8AZ.jpg)',
        backgroundColor: '#ffffff',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >

      {/* Content Box */}
      <Box
        sx={{
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 4,
          color: '#ffffff',
        }}
      >
        {/* Welcome Section */}
        <Typography variant="h2" gutterBottom>
          Welcome!
        </Typography>

        </Box>
      </Box>
   
  );
}
