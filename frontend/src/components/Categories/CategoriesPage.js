import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./CategoriesPage.css"

const apiInstance = axios.create({
  baseURL: process.env.Server_Api, // Set the base URL for your API
});


class CategoryPage extends React.Component {
  state = {
    categories: [], // Initial state is an empty array
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = () => {
    apiInstance.get('/category')
      .then((response) => {
        const categoriesArray = response.data; // Assuming data is already an array
        this.setState({ categories: categoriesArray });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };
  

  render() {
    const { categories } = this.state;

    return (
      <div className="categories-page">
        <h2 className="page-title">Workers</h2>
        <div className="category-cards">
          {categories.map((category) => (
            <div className="category-card" key={category._id}>
              <Link to={`/category/${category._id}/subcategories`} className="category-link">
                <div className="category-image">
                  <img src={`/images/${category.image}`} alt={category.name} />
                  <div className="category-name">
                    {category.name}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}


export default CategoryPage;
