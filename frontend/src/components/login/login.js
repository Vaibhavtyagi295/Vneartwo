import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios'; 

const apiInstance = axios.create({
  baseURL: process.env.Server_Api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginOption, setLoginOption] = useState('email');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiInstance.post('/login', { email, username, password }); // Use the Axios instance for API call

      const data = response.data;

      if (response.status === 200) {
        // Save the token in localStorage or sessionStorage for further use
        localStorage.setItem('token', data.token);
        // Redirect to the main page or any other authenticated route
        window.location.href = '/';
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred');
    }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {error && <Typography color="error" gutterBottom>{error}</Typography>}
          <form onSubmit={handleLogin}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="loginOptionLabel">Login as:</InputLabel>
              <Select
                labelId="loginOptionLabel"
                id="loginOption"
                value={loginOption}
                onChange={(e) => setLoginOption(e.target.value)}
              >
                <MenuItem value="email">User (Email)</MenuItem>
                <MenuItem value="worker">Worker (Username)</MenuItem>
              </Select>
            </FormControl>

            {loginOption === 'email' ? (
              <TextField
                fullWidth
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              />
            ) : (
              <TextField
                fullWidth
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              />
            )}

            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
            />

            <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
              Login
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
