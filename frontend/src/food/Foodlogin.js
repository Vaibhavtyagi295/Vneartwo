import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';


const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the Axios instance for API call
      const response = await apiInstance.post('/food-login', {
        phoneNumber,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        // If the login is successful, redirect to the Foodshop component with the foodId.
        history.push(`/Foodshop/${data.foodId}`);
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
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
