// components/SellerOldItemsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Alert, Table ,Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const Chatbox = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
  
    const handleUserInput = (e) => {
      setUserInput(e.target.value);
    };
  
    const handleSubmit = () => {
      // Save the user's question in the chat history
      const userQuestion = { type: 'user', text: userInput };
      setMessages([...messages, userQuestion]);
  
      // Clear the user input after submitting the question
      setUserInput('');
  
      // Simulate a response from the support team (you can replace this with actual logic)
      const supportResponse = {
        type: 'support',
        text: 'Thank you for your question. We will get back to you soon.',
      };
      setTimeout(() => {
        setMessages([...messages, supportResponse]);
      }, 1000);
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
  
const SellerOldItemsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    condition: '',
    image: null,
  });

  const [token, setToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [items, setItems] = useState([]);
  const sellerId = useParams();
  const [showChatModal, setShowChatModal] = useState(false);

  const handleCloseChatModal = () => setShowChatModal(false);
  const handleShowChatModal = () => setShowChatModal(true);

  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    // Fetch seller's old items
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        alert('Please log in to create a product.');
        return;
      }

      const formDataWithImage = new FormData();
      formDataWithImage.append('name', formData.name);
      formDataWithImage.append('price', formData.price);
      formDataWithImage.append('description', formData.description);
      formDataWithImage.append('category', formData.category);
      formDataWithImage.append('condition', formData.condition);
      formDataWithImage.append('image', formData.image);

      const config = {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data', // Important for sending FormData
        },
      };

      const response = await apiInstance.post('/api/olditem', formDataWithImage, config);
      console.log(response.data); // Success message and item details
      setSuccessMessage('Old item created successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Clear the success message after a few seconds
      }, 3000);

      // Refetch the updated list of items after adding a new one
      fetchItems();
    } catch (error) {
      console.error('Error creating old item:', error);
      alert('Error creating old item:', error.message || 'Internal server error');
    }
  };

  const fetchItems = async () => {
    try {
      const response = await apiInstance.get(`/api/sellerproducts/${sellerId.id}`);
      const sellerItems = response.data;
      setItems(sellerItems);
    } catch (error) {
      console.error('Error fetching seller items:', error);
      alert('Error fetching seller items:', error.message || 'Internal server error');
    }
  };

  const handleUpdateItem = async (itemId, updatedData) => {
    try {
      const response = await apiInstance.put(`/api/olditem/${itemId}`, updatedData, {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data); // Success message and item details
      setSuccessMessage('Old item updated successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Clear the success message after a few seconds
      }, 3000);

      // Refetch the updated list of items after updating
      fetchItems();
    } catch (error) {
      console.error('Error updating old item:', error);
      alert('Error updating old item:', error.message || 'Internal server error');
    }
  };
  const tableStyle = {
    overflowX: 'auto',
    maxWidth: '100%',
    display: 'block',
  };

  const existingItemsStyle = {
    marginTop: '30px',
  };
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


  return (
    <Container className="mt-5">
          <div className="help-button" variant="info" style={helpButtonStyle} onClick={handleShowChatModal}>
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
    <h1>Seller Old Items</h1>
    {successMessage && <Alert variant="success">{successMessage}</Alert>}
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" name="price" onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" name="description" onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control type="text" name="category" onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="condition">
        <Form.Label>Condition</Form.Label>
        <Form.Control type="text" name="condition" onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="image">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" name="image" onChange={handleImageChange} />
      </Form.Group>
      <Button  className='mt-1' variant="primary" type="submit">
        Create Item
      </Button>
    </Form>

      <div style={existingItemsStyle}>
        <h2>Existing Old Items</h2>
        <Table striped bordered hover responsive style={tableStyle}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>{item.condition}</td>
                <td>
                  <img src={item.image} alt={item.name} style={{ maxWidth: '100px' }} />
                </td>
                <td>
                  <Button variant="danger">
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div style={{ marginTop: '50px' }}>
        <h2>Update Shop</h2>
        <Form onSubmit={handleUpdateItem}>
          {/* Add form fields for updating name, description, and image */}
          <Form.Group controlId="updateName">
            <Form.Label>Update Name</Form.Label>
            <Form.Control type="text" name="name" onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="updateDescription">
            <Form.Label>Update Description</Form.Label>
            <Form.Control as="textarea" name="description" onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="updateImage">
            <Form.Label>Update Image</Form.Label>
            <Form.Control type="file" name="image" onChange={handleImageChange} />
          </Form.Group>
          <Button  className='mt-1' variant="primary" type="submit">
            Update Item
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default SellerOldItemsPage;
