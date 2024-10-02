// pages/CategoryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryId } = useParams();

  // Fetch and display products for the selected category
  return (
    <div className="category-page">
      <h1>{categoryId.toUpperCase()} Products</h1>
      <div className="product-list">
        {/* Display products for the selected category */}
      </div>
    </div>
  );
};

export default CategoryPage;