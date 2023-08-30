// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Prepare the data to send to the backend
    const dataToSend = {
      phoneNumber,
      password,
    };

    try {
      // Use the Axios instance for API call
      const response = await apiInstance.post('/seller-login', dataToSend);

      console.log(response);
      const data = response.data;

      if (response.status === 200) {
        // If the login is successful, redirect to the Foodshop component with the sellerId.
        history.push(`/sellershop/${data.sellerId}`);
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
    <div>
      <h2>Login</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Phone Number:
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
