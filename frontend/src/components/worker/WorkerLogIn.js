import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const WorkerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create the login data object
    const loginData = {
      username: username,
      password: password,
    };

    // Send the login request to your server using Axios
    apiInstance
      .post('/workerlogin', loginData)
      .then((response) => {
        // Handle the response here if needed
        console.log(response.data);
        // Clear the form fields after successful login
        setUsername('');
        setPassword('');
        // Redirect to the worker profile page
        history.push(`/work/${response.data.workerId}`);
      })
      .catch((error) => {
        // Handle login error here if needed
        console.error('Login failed:', error);
      });
  };

  return (
    <div className="container">
      <h2>Worker Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={handleUsernameChange} />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={handlePasswordChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default WorkerLogin;
