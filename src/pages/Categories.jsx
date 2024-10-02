// pages/Categories.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { BASE_URL } from '../api';

const Categories = () => {
  const categories = [
    { id: 'electronics', title: 'Electronics' },
    { id: 'fashion', title: 'Fashion' },
    { id: 'home', title: 'Home' },
    { id: 'beauty', title: 'Beauty' },
  ];

  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <div className="category-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <Link to={`/category/${category.id}`}>{category.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;