import React, { useState, useEffect } from 'react';
import './Admin.css';
import Footer from './Footer';
import { BASE_URL } from '../api';


const ProductView = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch product data from an API or database
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Product View</h2>
      <div>
        {products.map((product, index) => (
          <div key={index}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
            {product.image && <img src={product.image} alt={product.name} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductView;