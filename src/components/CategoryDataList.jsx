import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { BASE_URL } from '../api';

const CategoryDataList = ({ searchTerm }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories/search?q=${searchTerm}`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (searchTerm) {
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [searchTerm]);

  return (
    <datalist id="category-options">
      {categories.map((category) => (
        <option key={category._id} value={category.name} />
      ))}
    </datalist>
  );
};

export default CategoryDataList;