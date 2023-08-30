// src/App.js
import React, { useEffect, useState } from 'react';
import { Container, Nav, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const App = () => {
  const [showCategories, setShowCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    axios.get('/category')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));

    axios.get('/workerregister')
      .then(response => setWorkers(response.data))
      .catch(error => console.error('Error fetching workers:', error));
  }, []);

  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker);
    setShowCategories(false);
  };

  const handleBackToCategories = () => {
    setSelectedWorker(null);
    setShowCategories(true);
  };

  const handleDeleteWorker = (workerId) => {
    axios.delete(`/api/workerregister/${workerId}`)
      .then(() => {
        setWorkers(workers.filter(worker => worker._id !== workerId));
        setSelectedWorker(null);
        setShowCategories(true);
      })
      .catch(error => console.error('Error deleting worker:', error));
  };

  return (
    <Container>
      {showCategories ? (
        <div>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link onClick={() => setShowCategories(true)}>Categories</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setShowCategories(false)}>Workers</Nav.Link>
            </Nav.Item>
          </Nav>
          {categories.length > 0 && (
            <Row>
              {categories.map(category => (
                <Col key={category._id} md={4} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={`/images/${category.image}`} />
                    <Card.Body>
                      <Card.Title>{category.name}</Card.Title>
                      {/* Display any other category details */}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ) : (
        <div>
          {selectedWorker && (
            <div>
              <Button variant="link" onClick={handleBackToCategories}>
                Back to Workers
              </Button>
              <Card>
                <Card.Body>
                  <Card.Title>{selectedWorker.name}</Card.Title>
                  <Card.Text>
                    <strong>Username:</strong> {selectedWorker.username}<br />
                    <strong>Location:</strong> {selectedWorker.location}<br />
                    <strong>Contact Number:</strong> {selectedWorker.number}<br />
                    <strong>Categories:</strong> {selectedWorker.categories.join(', ')}<br />
                    <strong>Work Description:</strong> {selectedWorker.workDescription}
                  </Card.Text>
                  <Button variant="danger" onClick={() => handleDeleteWorker(selectedWorker._id)}>
                    Delete Worker
                  </Button>
                </Card.Body>
              </Card>
            </div>
          )}
          {workers.length > 0 && (
            <Row>
              {workers.map(worker => (
                <Col key={worker._id} md={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>{worker.name}</Card.Title>
                      <Button variant="info" onClick={() => handleWorkerSelect(worker)}>
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </Container>
  );
};

export default App;
