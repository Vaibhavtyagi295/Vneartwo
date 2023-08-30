import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsFillInfoCircleFill, BsTrash } from 'react-icons/bs';

const FoodProducts = () => {
  const [foodProducts, setFoodProducts] = useState([]);
  const [selectedFoodProduct, setSelectedFoodProduct] = useState(null);

  useEffect(() => {
    fetchFoodProducts();
  }, []);

  const fetchFoodProducts = async () => {
    try {
      const response = await fetch('/api/foodproducts');
      const data = await response.json();
      setFoodProducts(data);
    } catch (error) {
      console.error('Error fetching food products:', error);
    }
  };

  const handleFoodProductSelect = (foodProduct) => {
    setSelectedFoodProduct(foodProduct);
  };

  const handleDeleteFoodProduct = async (foodProductId) => {
    try {
      await fetch(`/api/foodproducts/${foodProductId}`, {
        method: 'DELETE',
      });
      // After successful deletion, fetch updated food products list
      fetchFoodProducts();
    } catch (error) {
      console.error('Error deleting food product:', error);
    }
  };

  return (
    <Container>
      <h1>All Food Products</h1>
      <Row>
        {foodProducts.map((foodProduct) => (
          <Col md={4} key={foodProduct._id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{foodProduct.name}</Card.Title>
                <Card.Text>{foodProduct.description}</Card.Text>
                <Card.Text>Price: ${foodProduct.price}</Card.Text>
                <Card.Text>Shop: {foodProduct.shop}</Card.Text>
                <Button variant="primary" onClick={() => handleFoodProductSelect(foodProduct)}>
                  <BsFillInfoCircleFill />
                  Details
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteFoodProduct(foodProduct._id)}
                >
                  <BsTrash />
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedFoodProduct && (
        <div className="selected-food-product">
          <h2>Selected Food Product Details</h2>
          <Card>
            <Card.Body>
              <Card.Title>{selectedFoodProduct.name}</Card.Title>
              <Card.Text>{selectedFoodProduct.description}</Card.Text>
              <Card.Text>Price: ${selectedFoodProduct.price}</Card.Text>
              <Card.Text>Shop: {selectedFoodProduct.shop}</Card.Text>
              <Card.Text>Quantity: {selectedFoodProduct.quantity}</Card.Text>
              <Card.Text>Category: {selectedFoodProduct.category}</Card.Text>
              <Card.Text>Shop ID: {selectedFoodProduct.shop}</Card.Text>
              <Button
                variant="danger"
                onClick={() => handleDeleteFoodProduct(selectedFoodProduct._id)}
              >
                <BsTrash />
                Delete
              </Button>
              {/* Add any additional details you want to display */}
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default FoodProducts;
