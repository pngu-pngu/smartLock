import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as API from '../api.js';
import { v4 as uuidv4 } from 'uuid';


// modes and purposes to connect to cognito for
const MODES = {
    SIGN_IN: 'signIn',
    SIGN_UP: 'signUp',
};

const CustomAuthForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || 'landing'; // Extract `from` properly

    // Initialize mode based on `from`
    const [mode, setMode] = useState(
        from === 'landing' ? MODES.SIGN_IN : MODES.SIGN_UP
    );



    //form of data to create cognito user
    const [formData, setFormData] = useState({
        user_username: '',
        user_firstName: '',
        user_password: '',
        user_lastName: '',
        user_id: uuidv4(), 
        user_email: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleMode = () => {
        setMode((prevMode) =>
            prevMode === MODES.SIGN_IN ? MODES.SIGN_UP : MODES.SIGN_IN
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword, firstName, lastName } = formData;

        if (mode === MODES.SIGN_IN) {
            try {

                alert('Sign-in successful');
                navigate('/about');
            } catch (error) {
                alert(`Error signing in: ${error.message}`);
            }
        } else if (mode === MODES.SIGN_UP) {
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {

                const userData = { username, firstName, lastName, email };
                const response = await API.userAPI.post(userData);

                if (response.status === 200) {
                    alert('Sign up successful! Please check your email to confirm your account.');
                    navigate('/confirm', { state: { username } });
                }
                
            } catch (error) {
                alert(`Error signing up: ${error.message}`);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {mode === MODES.SIGN_IN ? 'Sign In' : 'Sign Up'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                {mode !== MODES.SIGN_IN && (
                    <>
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                    {mode === MODES.SIGN_IN ? 'Sign In' : 'Sign Up'}
                </Button>

                {from === 'landing' && (
                    <Button onClick={toggleMode} color="secondary" fullWidth style={{ marginTop: '8px' }}>
                        {mode === MODES.SIGN_IN ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                    </Button>
                )}
                {mode === MODES.SIGN_IN && (
                    <Button
                        onClick={() => navigate('/forgot-password')}
                        color="primary"
                        fullWidth
                        style={{ marginTop: '8px' }}
                    >
                        Forgot Password?
                    </Button>
                )}
            </form>
        </Container>
    );
};

export default CustomAuthForm;