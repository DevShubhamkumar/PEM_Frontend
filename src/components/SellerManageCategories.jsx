import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaEdit, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import { BASE_URL } from '../api';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 2.5rem;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357ae8;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  div {
    margin-bottom: 20px;
    width: 100%;
    max-width: 400px;
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  input {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  input[type="file"] {
    padding: 10px 0;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const CategoryItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
    object-fit: cover;
    border-radius: 50%;
  }

  span {
    flex-grow: 1;
    font-size: 1.1rem;
    color: #333;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  text-align: center;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.div`
  color: #388e3c;
  text-align: center;
  margin-bottom: 10px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/seller/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = useCallback((category) => {
    setIsUpdating(true);
    setUpdatingCategory(category);
    setCategoryName(category.name);
    setImagePreview(category.categoryImage);
    setError(null);
    setSuccessMessage('');
  }, []);

  const handleCancelUpdate = useCallback(() => {
    setIsUpdating(false);
    setUpdatingCategory(null);
    setCategoryName('');
    setCategoryImage(null);
    setImagePreview(null);
    setError(null);
    setSuccessMessage('');
  }, []);

  const handleCategoryNameChange = useCallback((e) => {
    setCategoryName(e.target.value);
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
  
    const formData = new FormData();
    formData.append('name', categoryName);
    if (categoryImage) {
      formData.append('categoryImage', categoryImage);
      console.log('Category image appended:', categoryImage);
    }
  
    try {
      const token = localStorage.getItem('token');
      const url = updatingCategory._id === 'new' 
        ? `${BASE_URL}/api/categories`
        : `${BASE_URL}/api/categories/${updatingCategory._id}`;
      
      const method = updatingCategory._id === 'new' ? 'post' : 'put';
  
      console.log('Sending request to:', url);
      console.log('FormData contents:', [...formData.entries()]);
  
      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Server response:', response.data);

      setSuccessMessage(updatingCategory._id === 'new' ? 'Category created successfully' : 'Category updated successfully');
      setIsUpdating(false);
      setUpdatingCategory(null);
      setCategoryName('');
      setCategoryImage(null);
      setImagePreview(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating/creating category:', error);
      setError(error.response?.data?.message || 'An error occurred while updating/creating the category');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  return (
    <Container>
      <Header>Manage Categories</Header>
      {loading && <LoadingOverlay><LoadingSpinner /></LoadingOverlay>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {isUpdating ? (
        <Form onSubmit={handleUpdateSubmit}>
          <div>
            {imagePreview && <img src={imagePreview} alt="Category preview" />}
          </div>
          <div>
            <label htmlFor="categoryName">Category Name</label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              required
            />
          </div>
          <div>
            <label htmlFor="categoryImage">Category Image</label>
            <input
              id="categoryImage"
              type="file"
              onChange={handleCategoryImageChange}
              accept="image/*"
              required
            />
          </div>
          <div>
            <Button type="submit" disabled={loading || !categoryName.trim() || !categoryImage}>
              <FaSave style={{ marginRight: '5px' }} /> Save
            </Button>
            <Button type="button" onClick={handleCancelUpdate} disabled={loading}>
              <FaTimes style={{ marginRight: '5px' }} /> Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <CategoryList>
          {categories.map((category) => (
            <CategoryItem key={category._id}>
              <img src={category.categoryImage} alt={category.name} />
              <span>{category.name}</span>
              <Button onClick={() => handleUpdateCategory(category)}>
                <FaEdit style={{ marginRight: '5px' }} /> Update
              </Button>
            </CategoryItem>
          ))}
        </CategoryList>
      )}
      {!isUpdating && (
        <Button onClick={() => handleUpdateCategory({ _id: 'new', name: '', categoryImage: '' })}>
          <FaPlus style={{ marginRight: '5px' }} /> Add New Category
        </Button>
      )}
    </Container>
  );
};

export default ManageCategories;