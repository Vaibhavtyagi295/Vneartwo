import React from 'react';
import axios from 'axios';
import "./SubcategoryPage.css";

class SubcategoryPage extends React.Component {
  state = {
    subcategoryName: '',
    categoryId: '',
    image: null,
    categories: [],
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = () => {
    axios
      .get('/category')
      .then((response) => {
        this.setState({ categories: response.data });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

  handleInputChange = (event) => {
    if (event.target.name === 'image') {
      this.setState({ image: event.target.files[0] });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  createSubcategory = () => {
    const { subcategoryName, categoryId, image } = this.state;

    const formData = new FormData();
    formData.append('name', subcategoryName);
    formData.append('image', image);

    axios
      .post(`/categories/${categoryId}/subcategories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Subcategory created:', response.data);
        // Handle the response if needed
        // Clear the input fields
        this.setState({ subcategoryName: '', categoryId: '', image: null });
      })
      .catch((error) => {
        console.error('Error creating subcategory:', error);
        // Handle the error if needed
      });
  };

  render() {
    const { subcategoryName, categoryId, categories } = this.state;

    return (
      <div className="subcategory-page">
        <input
          type="text"
          name="subcategoryName"
          value={subcategoryName}
          onChange={this.handleInputChange}
          placeholder="Enter subcategory name"
        />
        <select
          name="categoryId"
          value={categoryId}
          onChange={this.handleInputChange}
          placeholder="Select category"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="image"
          onChange={this.handleInputChange}
        />
        <button onClick={this.createSubcategory}>Create Subcategory</button>
      </div>
    );
  }
}

export default SubcategoryPage;
