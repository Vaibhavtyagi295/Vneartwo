import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Form, Button, Container, Alert, Table,Modal } from 'react-bootstrap';
import axios from 'axios';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
const images = [
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3',
 
];

const apiInstance = axios.create({
  baseURL: process.env.Server_Api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});
const helpButtonStyle = {
  position: 'fixed',
  top: '50%',
  right: '20px',
backgroundColor: 'blue',
color:"white",
  borderRadius: '50%', // Make the button circular
  width: '50px', // Set the width and height to control the size of the button
  height: '50px',
  fontSize: '18px', // Adjust the font size to center the text
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    const userQuestion = { type: 'user', text: userInput };
    setMessages([...messages, userQuestion]);
    setUserInput('');
  
    const supportResponse = {
      type: 'support',
      text: 'Thank you for your question. We will get back to you soon.',
    };
  
    // Save the message to the backend API
    apiInstance.post('/api/messages', userQuestion)
      .then(() => {
        setTimeout(() => {
          setMessages([...messages, supportResponse]);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  };
  

  return (
    <div className="chatbox">
      <div className="chatbox-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message message-${message.type}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <Form.Control type="text" value={userInput} onChange={handleUserInput} />
        <Button className='mt-1' variant="primary" onClick={handleSubmit}>
          Send
        </Button>
      </div>
    </div>
  );
};

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const handleCloseChatModal = () => setShowChatModal(false);
  const handleShowChatModal = () => setShowChatModal(true);


  useEffect(() => {
    // Check if it's the first visit
    const isFirstVisit = localStorage.getItem('isFirstVisit') === null;

    // If it's the first visit, ask for user's location
    if (isFirstVisit) {
      // Function to handle user location permission
      const handleLocationPermission = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Save the user's location in localStorage
            localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
            // Set isFirstVisit to false to avoid asking for location again
            localStorage.setItem('isFirstVisit', 'false');
            // Update the state with user's location
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting user location:', error);
            // If geolocation is not available or user denies the permission, you can handle it here
          }
        );
      };

      // Ask for location permission
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            handleLocationPermission();
          } else if (result.state === 'prompt') {
            // Show a prompt to ask the user for permission
            result.onchange = () => {
              if (result.state === 'granted') {
                handleLocationPermission();
              }
            };
          } else {
            // Handle other states like 'denied'
          }
        });
      } else {
        // Handle cases where navigator.permissions.query is not supported
        handleLocationPermission();
      }
    } else {
      // If it's not the first visit, get the user's location from localStorage
      const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
      setUserLocation(savedLocation);
    }

  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const backgroundImageStyle = {
    backgroundImage: `url(${images[currentImageIndex]})`,
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    fade: true,
  };

  return (
    <div className="app">
      <div className="help-button" variant="info" style={helpButtonStyle} onClick={handleShowChatModal} >
  Help
</div>
<Modal show={showChatModal} onHide={handleCloseChatModal}>
  <Modal.Header closeButton>
    <Modal.Title>Chat with Support</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <p>What problem are you facing?</p>
    <Chatbox />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseChatModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
      <div className="background-image" style={backgroundImageStyle} />
      <div className="overlay">
        <h1 className="title"></h1>
      
      </div>
    </div>
  );
}


export default App;
