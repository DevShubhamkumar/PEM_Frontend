import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BASE_URL } from '../api';

const styles = {
  categoryProductsPage: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
};

const ProductCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3`
  margin-top: 0;
  font-size: 18px;
`;

const ProductDescription = styled.p`
  margin-bottom: 8px;
  color: #666;
  line-height: 1.4;
`;

const ProductPrice = styled.p`
  margin-bottom: 0;
  font-weight: bold;
  font-size: 16px;
`;

const AddToCartButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const AllCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [discountOnly, setDiscountOnly] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('${BASE_URL}/api/admin/data');
        setCategories(response.data.categories);
        setItemTypes(response.data.itemTypes);
        setBrands(response.data.brands);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === '' || product.category._id === selectedCategory;
    const itemTypeMatch = selectedItemType === '' || product.itemType._id === selectedItemType;
    const brandMatch = selectedBrand === '' || product.brand._id === selectedBrand;
    const priceMatch = (minPrice === '' || product.price >= minPrice) && (maxPrice === '' || product.price <= maxPrice);
    const discountMatch = !discountOnly || product.discount > 0;

    return categoryMatch && itemTypeMatch && brandMatch && priceMatch && discountMatch;
  });

  const handleAddToCart = (product) => {
    // Implement your logic to add the product to the cart
    console.log('Adding product to cart:', product);
  };

  return (
    <div style={styles.categoryProductsPage}>
      <h2>All Products</h2>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <div style={styles.filterGroup}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label htmlFor="itemType">Item Type:</label>
          <select
            id="itemType"
            value={selectedItemType}
            onChange={(e) => setSelectedItemType(e.target.value)}
          >
            <option value="">All</option>
            {itemTypes.map((itemType) => (
              <option key={itemType._id} value={itemType._id}>
                {itemType.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label htmlFor="brand">Brand:</label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label htmlFor="minPrice">Min Price:</label>
          <input
            id="minPrice"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div style={styles.filterGroup}>
          <label htmlFor="maxPrice">Max Price:</label>
          <input
            id="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div style={styles.filterGroup}>
          <label htmlFor="discountOnly">Discounted Only:</label>
          <input
            id="discountOnly"
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => setDiscountOnly(e.target.checked)}
          />
        </div>
      </div>

      <div style={styles.productGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id}>
              <Link to={`/products/${product._id}`}>
                <ProductImage src={`${BASE_URL}/${product.images[0]}`} alt={product.name} />
                <ProductDetails>
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>
                  {product.discount > 0 ? (
                    <>
                      <ProductPrice style={{ textDecoration: 'line-through' }}>${product.price}</ProductPrice>
                      <ProductPrice>${product.price - (product.price * product.discount / 100)}</ProductPrice>
                    </>
                  ) : (
                    <ProductPrice>${product.price}</ProductPrice>
                  )}
                </ProductDetails>
              </Link><AddToCartButton onClick={() => handleAddToCart(product)}>Add to Cart</AddToCartButton>
            </ProductCard>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AllCategoriesPage;