import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsFillInfoCircleFill, BsTrash } from 'react-icons/bs';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      // After successful deletion, fetch updated products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Container>
      <h1>All Products</h1>
      <Row>
        {products.map((product) => (
          <Col md={4} key={product._id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Price: ${product.price}</Card.Text>
                <Button variant="primary" onClick={() => handleProductSelect(product)}>
                  <BsFillInfoCircleFill />
                  Details
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProduct(product._id)}>
                  <BsTrash />
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedProduct && (
        <div className="selected-product">
          <h2>Selected Product Details</h2>
          <Card>
            <Card.Img variant="top" src={selectedProduct.image} alt={selectedProduct.name} />
            <Card.Body>
              <Card.Title>{selectedProduct.name}</Card.Title>
              <Card.Text>{selectedProduct.description}</Card.Text>
              <Card.Text>Price: ${selectedProduct.price}</Card.Text>
              <Card.Text>Quantity: {selectedProduct.quantity}</Card.Text>
              <Card.Text>Category: {selectedProduct.category}</Card.Text>
              <Card.Text>Shop ID: {selectedProduct.shop}</Card.Text>
              <Button variant="danger" onClick={() => handleDeleteProduct(selectedProduct._id)}>
                <BsTrash />
                Delete
              </Button>
            </Card.Body>
          </Card>
        </div>

      )}
    </Container>
  );
};

export default Products;
