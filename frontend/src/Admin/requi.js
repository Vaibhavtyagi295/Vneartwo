import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

function WorkerRegistrationRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    apiInstance
      .get('/workerregister/requests')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching worker registration requests:', error);
        setError('Failed to fetch worker registration requests');
      });
  };

  const handleApprove = (requestId) => {
    const requestData = { approvalStatus: 'approved' };

    apiInstance
      .patch(`/workerregister/requests/${requestId}`, requestData)
      .then((response) => {
        console.log(response.data.message);
        fetchRequests();
      })
      .catch((error) => {
        console.error('Failed to approve worker registration request:', error);
        setError('Failed to approve worker registration request');
      });
  };

  const handleReject = (requestId) => {
    const requestData = { approvalStatus: 'rejected' };

    apiInstance
      .patch(`/workerregister/requests/${requestId}`, requestData)
      .then((response) => {
        console.log(response.data.message);
        fetchRequests();
      })
      .catch((error) => {
        console.error('Failed to reject worker registration request:', error);
        setError('Failed to reject worker registration request');
      });
  };

  return (
    <div>
      <h1>Worker Registration Requests</h1>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.length > 0 && (
        <Row>
          {requests.map((request) => (
            <Col key={request._id} lg={4} md={6} sm={12} style={{ marginBottom: '1rem' }}>
              <Card>
              <Card.Img
                  variant="top"
                  src={`/images/${request.image}`}
                  alt="Worker Image"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{request.name}</Card.Title>
                  <Card.Text>
                    <strong>Location:</strong> {request.location}
                  </Card.Text>
                  <Card.Text>
                    <strong>Categories:</strong> {request.categories}
                  </Card.Text>
                  <Card.Text>
                    <strong>Subcategories:</strong> {request.subcategories}
                  </Card.Text>
                  <Card.Text>
                    <strong>Work Description:</strong> {request.workDescription}
                  </Card.Text>
                  <Button variant="success" onClick={() => handleApprove(request._id)}>Approve</Button>{' '}
                  <Button variant="danger" onClick={() => handleReject(request._id)}>Reject</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default WorkerRegistrationRequests;
