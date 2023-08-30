import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  }
});

const RegistrationPage = () => {
  const [username, setusername] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  
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
    axios
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

  useEffect(() => {
    retrieveLocation();
  }, []); // Fetch location details when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send registration data to the backend
    const dataToSend = {
      username,
      location,
      phoneNumber,
      password,
    };

    try {
      // Send the data to the backend for registration
      const response = await apiInstance.post('/shop-register', dataToSend);
      console.log(response.data);

      // Redirect to the dashboard after successful registration
      history.push(`/`); // Replace 'userId' with the actual ID of the registered shopkeeper
    } catch (error) {
      console.error('Error during registration:', error);
      // You can display an error message to the user if the registration fails.
    }

  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Shopkeeper Registration</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="shopName">
                  <Form.Label>Shop Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="location">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId="phoneNumber">
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationPage;
