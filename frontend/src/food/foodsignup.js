import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    retrieveLocation();
  }, []);

  const retrieveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getLocationDetails(latitude, longitude);
        },
        (error) => {
          console.log('Error retrieving location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  const getLocationDetails = (latitude, longitude) => {
    apiInstance
      .get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=95d4f8fddee14264b9a6801961b4d61a`
      )
      .then((response) => {
        const { city, state } = response.data.results[0].components;
        const formattedLocation = `${city}, ${state}`;
        setLocation(formattedLocation);
      })
      .catch((error) => {
        console.error('Error retrieving location details:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send to the backend
    const dataToSend = {
      username,
      location,
      cuisine,
      phoneNumber,
      password,
    };

    try {
      // Send the data to the backend for registration
      const response = await apiInstance.post('/food-register', dataToSend);
      console.log(response.data); // You can handle the response as per your requirements

      // Extract the JWT token from the response
      const { token } = response.data;

      // Store the token in localStorage
      localStorage.setItem('Token', token);

      // You can also redirect the user to a different page after successful registration.
    } catch (error) {
      console.error('Error during registration:', error);
      // You can display an error message to the user if the registration fails.
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                <RestaurantIcon fontSize="large" /> Food Registration
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Shop Name"
                  type="text"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  margin="normal"
                />
                <TextField
                  label="Location"
                  type="text"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <LocationOnIcon color="action" sx={{ alignSelf: 'flex-start', mt: 1 }} />
                    ),
                  }}
                />
                <TextField
                  label="Cuisine"
                  type="text"
                  fullWidth
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  required
                  margin="normal"
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <PhoneIcon color="action" />,
                  }}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  margin="normal"
                  InputProps={{
                    endAdornment: <LockIcon color="action" />,
                  }}
                />
                <Button variant="contained" type="submit" fullWidth sx={{ mt: 4 }}>
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegistrationPage;
