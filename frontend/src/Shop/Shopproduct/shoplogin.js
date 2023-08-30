import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


const apiInstance = axios.create({
  baseURL: process.env.Server_Api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the Axios instance to make the login request
      const response = await apiInstance.post('/shoplogin', {
        phoneNumber,
        password,
      });

      const data = response.data;
      console.log(data);

      if (response.status === 200) {
        // If the login is successful, redirect to the ShopUpdate component with the userId.
        history.push(`/ShopUpdate/${data.userId}`);

        localStorage.setItem('token', data.token);
      } else {
        // Handle login errors here if needed.
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number:</Form.Label>
              <Form.Control
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
