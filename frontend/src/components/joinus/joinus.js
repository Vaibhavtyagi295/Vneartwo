import React from 'react';
import { Container, Grid, Typography, Button, Paper } from '@mui/material';
import { FaBoxOpen, FaStore, FaUtensils, FaHandsHelping } from 'react-icons/fa';

import './join.css';

const JoinUs = () => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="JoinUs">
      <Container>
        <header className="my-5">
          <Typography variant="h1" align="center" gutterBottom>
            Join Us
          </Typography>
        </header>
        <Grid container spacing={4}>
          <Grid item md={6}>
            <Paper elevation={3} className="category-box">
              <FaBoxOpen className="category-icon" />
              <Typography variant="h4">Old Item Selling Shop</Typography>
              <Typography variant="body1">
                Join our platform to sell your old items and discover unique treasures from other sellers.
              </Typography>
              <Button variant="contained" color="primary">Join Now</Button>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper elevation={3} className="category-box">
              <FaStore className="category-icon" />
              <Typography variant="h4">New Product Selling Shop</Typography>
              <Typography variant="body1">
                Start your online business and showcase your new products to a wide audience of potential customers.
              </Typography>
              <Button variant="contained" color="primary">Join Now</Button>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={4} className="my-5">
          <Grid item md={6}>
            <Paper elevation={3} className="category-box">
              <FaUtensils className="category-icon" />
              <Typography variant="h4">Food Restaurant Openings</Typography>
              <Typography variant="body1">
                If you're a restaurateur looking to expand your reach, join us to connect with food enthusiasts.
              </Typography>
              <Button variant="contained" color="primary">Join Now</Button>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper elevation={3} className="category-box">
              <FaHandsHelping className="category-icon" />
              <Typography variant="h4">Open Your Shop (Free)</Typography>
              <Typography variant="body1">
                Whether you're a creator, artist, or entrepreneur, you can open your shop on our platform for free.
              </Typography>
              <Typography variant="body1">Join Now and start your journey with us!</Typography>
              <Typography variant="body1">Date: {currentDate}</Typography>
              <Button variant="contained" color="primary">Join Now</Button>
            </Paper>
          </Grid>
        </Grid>
    
      </Container>
    </div>
  );
};

export default JoinUs;
