import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import './SubcategoriesPage.css';

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});

const SubcategoriesPage = ({ match }) => {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const categoryId = match.params.categoryId;

    apiInstance
      .get(`/category/${categoryId}/subcategories`)
      .then((response) => {
        setSubcategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching subcategories:', error);
      });
  }, [match.params.categoryId]);

  return (
    <div className="page-container">
      <Typography variant="h4"></Typography>
      {subcategories.length > 0 ? (
        <Grid container spacing={3}>
          {subcategories.map((subcategory) => (
            <Grid key={subcategory._id} item xs={12} sm={6} md={4}>
              <Link to={`/subcategory/${subcategory._id}/workers`} className="card-link">
                <Card className="subcategory-card">
                  <CardMedia
                    component="img"
                    alt={subcategory.name}
                    height="200"
                    image={`/images/${subcategory.image}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {subcategory.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <p>No subcategories found.</p>
      )}
    </div>
  );
};

export default SubcategoriesPage;
