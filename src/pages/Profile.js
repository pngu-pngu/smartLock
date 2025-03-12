import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import * as API from '../api';

const userId = '000000001';

async function updateUserAttributes(updatedAttributes) {
    try {
        const response = API.userAPI.post(userId, updatedAttributes);

        console.log('User attributes updated:', response);
        return response;
    } catch (error) {
        console.error('Error updating user attributes:', error);
        throw error;
    }
}


const Profile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    //profilepic: '',
  });
  const [tempProfile, setTempProfile] = useState({ ...profile }); // Temporary state for input values

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAttributes = await API.userAPI.getById(userId);
        console.log(userAttributes);

        setProfile({
          firstName: userAttributes.user_firstname || '',
          lastName: userAttributes.user_lastname || '',
          username: userAttributes.user_username || '',
          password: userAttributes.user_password || '',
          email: userAttributes.user_email || '',

        });

        setTempProfile({
            firstName: userAttributes.user_firstname || '',
            lastName: userAttributes.user_lastname || '',
            username: userAttributes.user_username || '',
            password: userAttributes.user_password || '',
            email: userAttributes.user_email || '',
  
          });

      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = async () => {
    if (isEditable) {
      const updatedAttributes = {
        firstName: tempProfile.firstName ,
        lastName: tempProfile.lastName,
        username: tempProfile.username,
        password: tempProfile.password,
        email: tempProfile.email,
      };
      try {
        await updateUserAttributes({ userAttributes: updatedAttributes });
        setProfile(tempProfile);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating user attributes:', error);
        alert('Error updating profile. Please try again.');
      }
    }
    setIsEditable(!isEditable);
  };

  const handleInputChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };


  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      {/* Profile Card */}
      <Card
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          marginBottom: '20px',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Box marginLeft={2}>
              <Typography variant="h4" gutterBottom>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {profile.bio}
              </Typography>
              
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Input Card */}
      <Card
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Info
          </Typography>
          <Divider />
          <Box marginBottom={2}>
                      {/* Sponsor Section */}
            <TextField
              label="First Name"
              name="firstName"
              value={tempProfile.firstName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={tempProfile.lastName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
            <TextField
              label="Username"
              name="username"
              value={tempProfile.username}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
          </Box>

          <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>
            Bio
          </Typography>
          <Divider />


          {/* Edit/Save Button */}
          <Box sx={{ marginTop: '16px', textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              {isEditable ? 'Save' : 'Edit'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
