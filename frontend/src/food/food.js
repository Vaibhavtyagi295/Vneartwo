import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Button,
  Rating, // Import the Rating component
} from '@mui/material';
import axios from 'axios';
import Header from '../foodheader';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

const MyPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const history = useHistory();

  useEffect(() => {
    apiInstance.get('/api/foodproducts')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const categories = [...new Set(products.map((product) => product.category))];

  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  };

  const cardMediaStyles = {
    paddingTop: '56.25%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const containerStyles = {
    padding: '20px',
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleButtonClick = (product) => {
    history.push(`/api/foodproducts/${product._id}`);
  };

  return (
    <div>
      <Header />
      <Container maxWidth="lg" style={containerStyles}>
        <FormControl style={{ marginBottom: '16px', minWidth: '120px' }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {products
            .filter(
              (product) =>
                selectedCategory === null || product.category === selectedCategory
            )
            .map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={4}>
                <Card style={cardStyles}>
                  <CardMedia
                    style={{
                      ...cardMediaStyles,
                      backgroundImage: `url(/images/${product.image})`,
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
              
                    <Typography variant="subtitle1" color="primary">
                      Price: ${product.price}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                      <Typography variant="body2" style={{ marginRight: '4px' }}>
                        Rating:
                      </Typography>
                      {/* Replace with actual rating data */}
                      <Rating name="product-rating" value={product.rating} readOnly />
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleButtonClick(product)}
                      style={{ marginTop: '8px' }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};

export default MyPage;
