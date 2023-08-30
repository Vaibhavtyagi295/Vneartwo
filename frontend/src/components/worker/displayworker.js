import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./workerdisplay.css";

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const WorkersPage = ({ match }) => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const subcategoryId = match.params.subcategoryId;
        const response = await apiInstance.get(`/subcategory/${subcategoryId}/workers`);
        setWorkers(response.data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };

    fetchWorkers();
  }, [match.params.subcategoryId]);

  return (
    <div className="card-container">
      <h2>Workers:</h2>
      {workers.length > 0 ? (
        <div className="card-grid">
          {workers.map((worker) => (
            <Link to={`/worker/${worker._id}`} key={worker._id} className="worker-link">
              <div className="card">
                <img src={`/images/${worker.image}`} alt={worker.name} className="card-image" />
                <div className="card-details">
                  <p className="card-location">Location: {worker.location}</p>
                  <p className="card-subcategories">Subcategories: {worker.subcategories}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No workers found.</p>
      )}
    </div>
  );
};

export default WorkersPage;
