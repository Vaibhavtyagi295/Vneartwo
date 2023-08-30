import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Image, Container, Row, Col, Button, Form, Card, ListGroup, Modal } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './foodProductPage.css';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const FoodProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ author: '', comment: '', rating: 5 });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add a state for login status
  const [phoneNumber, setWhatsappNumber] = useState(''); 
  useEffect(() => {
    // Fetch the food product data when the component mounts
    const fetchFoodProduct = async () => {
      try {
        const response = await apiInstance.get(`/api/foodproducts/${id}`);
        setProduct(response.data.product); // Assuming the fetched data is an object with the 'product' property containing product details
        setWhatsappNumber(response.data.phoneNumber); 
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching food product:', error);
      }
    };

    fetchFoodProduct();
  }, [id]);

  // Fetch the reviews when the component mounts and when a new review is added
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiInstance.get(`/api/foodproducts/${id}/reviews`);
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

  // State for modal visibility and user details
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');

  const handleWhatsAppContact = () => {
    if (isLoggedIn) {
      // Proceed with the WhatsApp contact logic
      const phone = phoneNumber;
      const message = `Hi, I'm interested in buying ${product.name}.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      // Show the modal for capturing user details
      setShowModal(true);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    // Send user details to the server using the /api/contact endpoint
    try {
      const response = await apiInstance.post('/api/contact', { name, number, location });
      console.log('Data saved successfully:', response.data);
      // Now the user is "registered" with the details, allow them to use the WhatsApp button
      setShowModal(false);
      // Optionally, you can update the login status here to avoid another check
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error saving data to the server:', error);
      // You can handle the error and display a message to the user if needed
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      // Proceed with the review submission logic
      try {
        const response = await apiInstance.post(`/api/foodproducts/${id}/reviews`, newReview);
        setReviews([...reviews, response.data]);
        setNewReview({ author: '', comment: '', rating: 5 });
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    } else {
      // Handle the case when the user is not logged in
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
    <Container className="product-container">
    <Row>
      <Col md={6}>
        <Image src={`/images/${product.image}`} alt={product.name} fluid className="product-image" />
      </Col>
      <Col md={6}>
        <Card className="product-details-card">
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text>Price: ${product.price}</Card.Text>
            <Card.Text className="star-icon">
              {generateStarRating(product.rating)}
            </Card.Text>
            <Button className="contact-button" onClick={handleWhatsAppContact}>
              Contact via WhatsApp
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>

      <Row className="mt-5 product-reviews">
        <Col>
          <h3>Product Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews available.</p>
          ) : (
            <ListGroup>
              {reviews.map((review, index) => (
                <ListGroup.Item className="review-item" key={index}>
                  <strong>Name:{review.author}</strong>
                  <p>comment:{review.comment}</p>
                  <p className="review-rating">
                    {/* Display star ratings */}
                    {generateStarRating(review.rating)}
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      <Row className="mt-5 product-reviews">
        <Col>
          <div className="add-review-form">
            <h3>Add a Review</h3>
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group controlId="formAuthor">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formComment">
                <Form.Label>Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your review"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formRating">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as="select"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </Form.Control>
              </Form.Group>
              <Button className="mt-1" variant="primary" type="submit">
                Submit Review
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      {/* Modal for capturing user details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleModalSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNumber">
              <Form.Label>Your Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formLocation">
              <Form.Label>Your Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FoodProductPage;
