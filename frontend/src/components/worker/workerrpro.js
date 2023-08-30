import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { Person, GeoAlt, Whatsapp, Eye } from 'react-bootstrap-icons';
import { useParams ,Link } from 'react-router-dom';

import StarRatingComponent from 'react-star-rating-component';
import './WorkerPage.css';



const WorkerPage = () => {
  const [worker, setWorker] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', name: '' });
  const [averageRating, setAverageRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    fetchWorkerData(id)
      .then((data) => {
        setWorker(data);
        fetchAverageRating(id);
      })
      .catch((error) => console.error(error));
  }, [id]);

  const fetchWorkerData = async (workerId) => {
    try {
      const response = await fetch(`/api/worker/${workerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch worker data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch worker data');
    }
  };

  const fetchAverageRating = async (workerId) => {
    try {
      const response = await fetch(`/api/worker/${workerId}/rating`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch average rating');
      }

      const data = await response.json();
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error('Failed to fetch average rating:', error);
    }
  };

  const ratingChanged = (newRating) => {
    setNewReview({ ...newReview, rating: newRating });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(newReview);

    setShowModal(true);
  };
  const handleModalSubmit = () => {
    // Save the name and number in the database using an API call
    saveNameAndNumber(name, number)
      .then((response) => {
        console.log('Name and number saved successfully:', response);
        setShowModal(false);
        redirectToWhatsApp();
      })
      .catch((error) => {
        console.error('Failed to save the name and number:', error);
        // Handle the error or show an error message to the user
      });
  };
  
  const saveNameAndNumber = async (name, number) => {
    try {
      // Replace the API endpoint and method with your actual implementation
      const response = await fetch('/api/saveNameAndNumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, number }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to save the name and number');
    }
  };
  
  const redirectToWhatsApp = () => {
    // Redirect the user to the worker's WhatsApp link
    window.location.href = worker.whatsappLink;
  };
 
  
 
  if (!worker) {
    return <p>Loading worker data...</p>;
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="worker-image-container">
          <img src={`/images/${worker.image}`} alt="Worker" className="worker-image" />
        </Col>
        <Col md={6} className="worker-details">
          <h3 className="worker-name">
            <Person /> {worker.name}
          </h3>
          <div className="worker-rating-and-buttons">
            <StarRatingComponent
              name="workerRating"
              starCount={5}
              value={averageRating}
              className="star-rating"
              editing={false}
            />
            <div className="worker-buttons">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <Whatsapp /> Contact on WhatsApp
              </Button>
              <Button variant="secondary" as={Link} to={`/work/${worker._id}`}>
  <Eye /> View Profile
</Button>
            </div>
          </div>
          <p className="worker-location">
            <GeoAlt /> {worker.location}
          </p>
          <p className="worker-description">{worker.description}</p>

          <div className="worker-reviews">
            <h4>Customer Reviews</h4>
            {worker.reviews.map((review, index) => (
              <div key={index} className="review">
                <p className="review-author">- {review.name}</p>
                <p className="review-comment">{review.comment}</p>
                <StarRatingComponent
                  name="workerRating"
                  starCount={5}
                  value={review.rating}
                  className="star-rating"
                  editing={false}
                />
              </div>
            ))}
            <h4>Add a Review</h4>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formRating">
                <Form.Label>Rating</Form.Label>
                <StarRatingComponent
                  name="newRating"
                  starCount={5}
                  value={newReview.rating}
                  onStarClick={ratingChanged}
                />
              </Form.Group>

              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formComment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button className="mt-2" variant="primary" type="submit">
                Submit Review
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter your Name and Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNumber">
              <Form.Label>Number</Form.Label>
              <Form.Control
                type="text"
                name="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Save and Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default WorkerPage;
