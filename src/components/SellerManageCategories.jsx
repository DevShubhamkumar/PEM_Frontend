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
const SellerManageCategories = () => {
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

  const handleUpdateSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('name', categoryName.trim());
    if (categoryImage) {
      formData.append('image', categoryImage);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      let response;
      if (updatingCategory._id === 'new') {
        response = await axios.post(`${BASE_URL}/api/categories`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.put(`${BASE_URL}/api/categories/${updatingCategory._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data && response.data._id) {
        setCategories(prevCategories => {
          if (updatingCategory._id === 'new') {
            return [...prevCategories, response.data];
          } else {
            return prevCategories.map(category =>
              category._id === response.data._id ? response.data : category
            );
          }
        });

        setSuccessMessage('Category updated successfully');
        setIsUpdating(false);
        setUpdatingCategory(null);
        setCategoryName('');
        setCategoryImage(null);
        setImagePreview(null);
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while updating the category');
    } finally {
      setLoading(false);
    }
  }, [categoryName, categoryImage, updatingCategory]);

  const handleUpdateCategory = (category) => {
    setIsUpdating(true);
    setUpdatingCategory(category);
    setCategoryName(category.name);
    setImagePreview(category.categoryImage);
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setUpdatingCategory(null);
    setCategoryName('');
    setCategoryImage(null);
    setImagePreview(null);
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCategoryImage = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('http')) {
      return <img src={imageUrl} alt="Category" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />;
    }
    return <div style={{ width: '50px', height: '50px', backgroundColor: '#ccc' }}></div>;
  };

  return (
    <Container>
      <Header>Manage Categories</Header>
      {loading && <LoadingOverlay><LoadingSpinner /></LoadingOverlay>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {isUpdating ? (
        <Form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
          <div>
            {imagePreview && <img src={imagePreview} alt="Category preview" />}
          </div>
          <div>
            <label htmlFor="categoryName">Category Name</label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={handleCategoryNameChange}
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
            />
          </div>
          <div>
            <Button type="submit" disabled={loading || !categoryName.trim()}>
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
              {renderCategoryImage(category.categoryImage)}
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

export default SellerManageCategories;