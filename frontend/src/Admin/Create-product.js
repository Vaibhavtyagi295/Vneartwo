import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const response = await apiInstance.post('/categories', formData);
      console.log('Category created:', response.data);
      // Handle success or navigate to a different page
    } catch (error) {
      console.error('Error creating category:', error);
      // Handle error
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" align="center">
        Create Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          fullWidth
          required
          value={name}
          onChange={handleNameChange}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </Container>
  );
};

export default CategoryForm;
