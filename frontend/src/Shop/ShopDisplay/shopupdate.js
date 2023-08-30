import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert, Table,Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom'; 


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

const SellerProductsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    image: null,
  });

  const [token, setToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [products, setProducts] = useState([]);
  const  userId  = useParams();

  const [showChatModal, setShowChatModal] = useState(false);

  const handleCloseChatModal = () => setShowChatModal(false);
  const handleShowChatModal = () => setShowChatModal(true);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    console.log(storedToken)
    // Fetch seller's products
    fetchProducts();
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
      formDataWithImage.append('quantity', formData.quantity);
      formDataWithImage.append('description', formData.description);
      formDataWithImage.append('category', formData.category);
      formDataWithImage.append('image', formData.image);

      const config = {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data', // Important for sending FormData
        },
      };
      console.log(config)
      const response = await axios.post('/products', formDataWithImage, config);
      console.log(response.data); // Success message and product details
      setSuccessMessage('Product created successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Clear the success message after a few seconds
      }, 3000);

      // Refetch the updated list of products after adding a new one
      fetchProducts();
    } catch (error) {
    
      console.log()
      console.error('Error creating product:', error);
      alert('Error creating product:', error.message || 'Internal server error');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const allProducts = response.data;
      const filteredProducts = allProducts.filter((product) => product.shop === userId.id);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products:', error.message || 'Internal server error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`/api/products/${productId}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data); // Success message after product deletion

      // Refetch the updated list of products after deletion
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product:', error.message || 'Internal server error');
    }
  };

  const tableStyle = {
    overflowX: 'auto',
    maxWidth: '100%',
    display: 'block',
  };

  const existingProductsStyle = {
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
      <h1>Seller Products</h1>
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
        <Form.Group controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control type="number" name="quantity" onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control type="text" name="category" onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleImageChange} />
        </Form.Group>
        <Button className="mt-1" variant="primary" type="submit">
          Create Product
        </Button>
      </Form>

      <div style={existingProductsStyle}>
        <h2>Existing Products</h2>
        <Table striped bordered hover responsive style={tableStyle}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>
                  <img src={product.image} alt={product.name} style={{ maxWidth: '100px' }} />
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteProduct(product._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default SellerProductsPage;
