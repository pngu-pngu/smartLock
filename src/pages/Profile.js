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
import { useContext } from 'react';
import UserContext from '../context/UserContext';

const userId = localStorage.getItem('user_id');

async function updateUserAttributes(userAttributes) {
  console.log(userAttributes);
    try {
        const response = await API.userAPI.patchById(userId, userAttributes);

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
    user_firstName: '',
    user_lastName: '',
    user_username: '',
    user_password: '',
    user_email: '',
    //profilepic: '',
  });
  const [tempProfile, setTempProfile] = useState({ ...profile }); // Temporary state for input values
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAttributes = await API.userAPI.getById(userId);
        console.log(userAttributes);
        const userData = userAttributes.values[0];
        

        setProfile({
          user_firstName: userData.user_firstName || '',
          user_lastName: userData.user_lastName || '',
          user_username: userData.user_username || '',
          user_password: userData.user_password || '',
          user_email: userData.user_email || '',

        });

        setTempProfile({
            user_firstName: userData.user_firstName || '',
            user_lastName: userData.user_lastName || '',
            user_username: userData.user_username || '',
            user_password: userData.user_password || '',
            user_email: userData.user_email || '',
  
          });

        setUser({ givenName: userData.user_firstName || '' });


      } catch (err) {
        console.error('Error fetching user data:', err);
      }

    };

    fetchData();
  }, []);

  const handleEditClick = async () => {
    if (isEditable) {
      const updatedAttributes = {
        user_firstName: tempProfile.user_firstName ,
        user_lastName: tempProfile.user_lastName,
        user_username: tempProfile.user_username,
        user_password: tempProfile.user_password,
        user_email: tempProfile.user_email,
      };
      try {
        await updateUserAttributes(updatedAttributes);
        setProfile(tempProfile);
        setUser({ givenName: tempProfile.user_firstName });
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
                {profile.user_firstName} {profile.user_lastName}
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
            <TextField
              label="First Name"
              name="user_firstName"
              value={tempProfile.user_firstName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
            <TextField
              label="Last Name"
              name="user_lastName"
              value={tempProfile.user_lastName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
            <TextField
              label="Username"
              name="user_username"
              value={tempProfile.user_username}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
            <TextField
              label="Password"
              name="user_password"
              value={tempProfile.user_password}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
            <TextField
              label="Email"
              name="user_email"
              value={tempProfile.user_email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!isEditable}
            />
          </Box>

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
