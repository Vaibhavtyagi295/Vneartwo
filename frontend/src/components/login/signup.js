import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  CssBaseline,
  Grid,
  Paper,
} from '@mui/material';
import { AccountCircle, Email, Lock } from '@mui/icons-material'; // Import icons
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiInstance.post('/register', { username, email, password });

      if (response.status === 200) {
        console.log('User registered successfully!');
      } else {
        console.log('User registration failed.');
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }

    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AccountCircle style={{ fontSize: 64, marginBottom: 20 }} />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form style={{ width: '100%', marginTop: 20 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <Email />,
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: <AccountCircle />,
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <Lock />,
            }}
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Sign Up
          </Button>

          <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: 20 }}>
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default SignupPage;
