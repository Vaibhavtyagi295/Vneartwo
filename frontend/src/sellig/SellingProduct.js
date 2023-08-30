// OldItemPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Image, Container, Row, Col, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './oldItemPage.css';


const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const OldItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ author: '', comment: '', rating: 5 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setWhatsappNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchOldItem = async () => {
      try {
        const response = await apiInstance.get(`/api/products-for-sell/${id}`);
        setItem(response.data);
        setWhatsappNumber(response.data.phoneNumber);
      } catch (error) {
        console.error('Error fetching old item:', error);
      }
    };

    fetchOldItem();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiInstance.get(`/api/products-for-sell/${id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleWhatsAppContact = () => {
    if (isLoggedIn) {
      const phone = phoneNumber;
      const message = `Hi, I'm interested in buying ${item.name}.`;
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
        const response = await apiInstance.post(`/api/products-for-sell/${id}/reviews`, newReview);
        setReviews([...reviews, response.data]);
        setNewReview({ author: '', comment: '', rating: 5 });
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    } else {
      alert('Please log in to submit a review.');
    }
  };

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
    <Container className="old-item-container">
      <Row>
        <Col md={6}>
          <Image src={`/images/${item.image}`} alt={item.name} fluid />
        </Col>
        <Col md={6}>
          <div className="old-item-details">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p className="star-icon">
              {generateStarRating(item.rating)}
            </p>

            <button onClick={handleWhatsAppContact}>Contact via WhatsApp</button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5 old-item-reviews">
        <Col>
          <h3>Item Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews available.</p>
          ) : (
            <ListGroup>
              {reviews.map((review, index) => (
                <ListGroup.Item className="review-item" key={index}>
                  <strong>{review.author}</strong>
                  <p>{review.comment}</p>
                  <p className="review-rating">
                    {generateStarRating(review.rating)}
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      <Row className="mt-5 old-item-reviews">
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

export default OldItemPage;
