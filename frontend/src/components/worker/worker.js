import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  AccountCircle,
  Lock,
  Person,
  Phone,
  Description,
  LocationOn,
} from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WorkerRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchCategoryOptions();
    retrieveLocation();
  }, []);

  const apiInstance = axios.create({
    baseURL: process.env.Server_Api,
  });

  const fetchCategoryOptions = () => {
    apiInstance
      .get('/category')
      .then((response) => {
        const options = response.data.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategoryOptions(options);
      })
      .catch((error) => {
        console.error('Failed to fetch category options:', error);
      });
  };

  const fetchSubcategories = (categoryId) => {
    apiInstance
      .get(`/category/${categoryId}/subcategories`)
      .then((response) => {
        setSubcategories(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch subcategories:', error);
      });
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setCategory(categoryId);
    setSelectedSubcategory('');
    if (categoryId) {
      fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      username,
      password,
      name,
      number,
      workDescription,
      location,
      category,
      subcategory: selectedSubcategory,
    };

    apiInstance
      .post('/workerregister', formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Failed to register worker:', error);
      });
  };

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

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="dense"
            InputProps={{
              startAdornment: <AccountCircle color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="dense"
            InputProps={{
              startAdornment: <Lock color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
            InputProps={{
              startAdornment: <Person color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            margin="dense"
            InputProps={{
              startAdornment: <Phone color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Work Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            margin="dense"
            InputProps={{
              startAdornment: <Description color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleCategoryChange}
              label="Category"
              startAdornment={<Description color="action" />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={selectedSubcategory}
              onChange={(event) => setSelectedSubcategory(event.target.value)}
              label="Subcategory"
              disabled={!category}
              startAdornment={<Description color="action" />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled
            margin="dense"
            InputProps={{
              startAdornment: <LocationOn color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default WorkerRegisterPage;
