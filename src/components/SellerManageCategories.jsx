import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Footer from './Footer';
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
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 10px auto;

  &:hover {
    background-color: #0056b3;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  div {
    margin-bottom: 20px;
    img {
      width: 100px;
      height: 100px;
    }
  }

  input {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    max-width: 400px;
  }

  input[type="file"] {
    padding: 0;
  }

  button {
    width: 100px;
    margin: 5px;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  button {
    background-color: #007bff;
    color: #fff;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/seller/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const categoriesWithImageUrls = response.data.categories.map((category) => ({
        ...category,
        categoryImage: category.categoryImage
          ? `${BASE_URL}/${
              category.categoryImage.includes('uploads/')
                ? category.categoryImage
                : `uploads/${category.categoryImage}`
            }`
          : '',
      }));

      setCategories(categoriesWithImageUrls);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUpdateCategory = (category) => {
    setIsUpdating(true);
    setUpdatingCategory(category);
    setCategoryName(category.name);
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setUpdatingCategory(null);
    setCategoryName('');
    setCategoryImage(null);
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategoryImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      if (categoryImage) {
        formData.append('categoryImage', categoryImage);
      }
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/categories/${updatingCategory._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setIsUpdating(false);
      setUpdatingCategory(null);
      setCategoryName('');
      setCategoryImage(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <Container>
      <Header>Manage Categories</Header>
      <Button onClick={() => setIsUpdating(true)}>Update Category</Button>
      {isUpdating ? (
        <Form onSubmit={handleUpdateSubmit}>
          <div>
            {updatingCategory && (
              <div>
                <img
                  src={`${BASE_URL}/uploads/${updatingCategory.categoryImage}`}
                  alt={updatingCategory.name}
                />
              </div>
            )}
          </div>
          <input
            type="text"
            value={categoryName}
            onChange={handleCategoryNameChange}
            placeholder="Category Name"
          />
          <input type="file" onChange={handleCategoryImageChange} accept="image/*" />
          <div>
            <Button type="submit">Update</Button>
            <Button type="button" onClick={handleCancelUpdate}>
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <CategoryList>
          {categories.map((category) => (
            <li key={category._id}>
              <img
                src={category.categoryImage}
                alt={category.name}
              />
              {category.name}
              <Button onClick={() => handleUpdateCategory(category)}>Update</Button>
            </li>
          ))}
        </CategoryList>
      )}
    </Container>
  );
};

export default ManageCategories;
