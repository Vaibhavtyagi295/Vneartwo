// ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Modal,
} from '@mui/material';
import { Rating } from '@mui/material';
import { FaStarHalfAlt, FaStar } from 'react-icons/fa';

import './productPage.css'; // Create and import your custom CSS file for styling if needed

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Adjust the base URL accordingly
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});


const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ author: '', comment: '', rating: 5 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setWhatsappNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiInstance.get(`/api/products/${id}`);
        setProduct(response.data);
        setWhatsappNumber(response.data.phoneNumber);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiInstance.get(`/api/products/${id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  // Implement a function to check if the user is logged in or has a valid token
  const checkLoginStatus = () => {
    // Replace this with your authentication logic to check if the user is logged in or has a valid token
    // For example, you can fetch the token from localStorage and verify it with the backend.
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleWhatsAppContact = () => {
    if (isLoggedIn) {
      const phone = phoneNumber;
      const message = `Hi, I'm interested in buying ${product.name}.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      setShowModal(true);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiInstance.post('/api/contact', { name, number, location });
      console.log('Data saved successfully:', response.data);
      setShowModal(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error saving data to the server:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      try {
        const response = await apiInstance.post(`/api/products/${id}/reviews`, newReview);
        setReviews([...reviews, response.data]);
        setNewReview({ author: '', comment: '', rating: 5 });
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    } else {
      alert('Please log in to submit a review.');
    }
  };

  // Helper function to generate star icons based on the rating
  const generateStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    return stars;
  };

  return (
    <Container maxWidth="lg" className="product-page-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <img src={`/images/${product.image}`} alt={product.name} className="product-image" />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="product-details">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <Rating name="product-rating" value={product.rating} precision={0.5} readOnly />
            <Button onClick={handleWhatsAppContact} variant="contained" color="primary">
              Contact via WhatsApp
            </Button>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-5 product-reviews">
        <Grid item xs={12}>
          <h3>Product Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews available.</p>
          ) : (
            <List>
              {reviews.map((review, index) => (
                <ListItem key={index} className="review-item">
                  <ListItemText primary={review.author} secondary={review.comment} />
                  <Rating value={review.rating} precision={0.5} readOnly />
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-5 product-reviews">
        <Grid item xs={12}>
          <div className="add-review-form">
            <h3>Add a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <TextField
                label="Your Name"
                variant="outlined"
                fullWidth
                value={newReview.author}
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
              />
              <TextField
                label="Your Review"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <Rating
                name="review-rating"
                value={newReview.rating}
                precision={1}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })
                }
              />
              <Button className="mt-1" variant="contained" color="primary" type="submit">
                Submit Review
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>

      {/* Modal for capturing user details */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-container bg-black">
          <h2>Enter Your Details</h2>
          <form onSubmit={handleModalSubmit}>
            <TextField
              label="Your Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Your Number"
              variant="outlined"
              fullWidth
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <TextField
              label="Your Location"
              variant="outlined"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </Container>
  );
};



export default ProductPage;
