import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const DashboardPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [subcategorySelected, setSubcategorySelected] = useState(false);
  const [workerId, setWorkerId] = useState(null);

  useEffect(() => {
    apiInstance.get('/api/checkSelection')
      .then(response => {
        const { category, subcategory, workerId } = response.data;
        setCategorySelected(!!category);
        setSubcategorySelected(!!subcategory);
        setWorkerId(workerId);

        if (!category || !subcategory) {
          setShowPopup(true);
        } else {
          // Redirect to the worker page
          // You can use a <Link> component or programmatically redirect
          window.location.href = `/worker/${workerId}`;
        }
      })
      .catch(error => {
        console.error('Error checking selection:', error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {showPopup && (
        <div className="popup">
          <h2>Please select a category and subcategory</h2>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
