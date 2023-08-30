import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsFillInfoCircleFill, BsTrash } from 'react-icons/bs';

const ProductsForSell = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProductsForSell();
  }, []);

  const fetchProductsForSell = async () => {
    try {
      const response = await fetch('/api/products-for-sell');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products for sell:', error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`/api/products-for-sell/${productId}`, {
        method: 'DELETE',
      });
      // After successful deletion, fetch updated products list
      fetchProductsForSell();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Container>
      <h1>Products For Sell</h1>
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
            <Card.Body>
              <Card.Title>{selectedProduct.name}</Card.Title>
              <Card.Text>{selectedProduct.description}</Card.Text>
              <Card.Text>Price: ${selectedProduct.price}</Card.Text>
              <Card.Text>condition: {selectedProduct.condition}</Card.Text>
              <Card.Text>Category: {selectedProduct.category}</Card.Text>
              <Card.Text>Shop ID: {selectedProduct.shop}</Card.Text>
              <Button variant="danger" onClick={() => handleDeleteProduct(selectedProduct._id)}>
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

export default ProductsForSell;
