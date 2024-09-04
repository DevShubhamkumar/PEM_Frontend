import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaFrownOpen, FaSearch, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Footer from './Footer';
import { BASE_URL } from '../api';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SearchResultsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  animation: ${fadeIn} 0.5s ease-in;
`;

const PageTitle = styled.h2`
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
`;

const SectionTitle = styled.h3`
  font-size: 28px;
  color: #34495e;
  margin: 40px 0 30px;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #e74c3c;
  }
`;

const ResultGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
`;

const ResultCard = styled(motion.div)`
  background-color: #ffffff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 220px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
  }
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  color: #2c3e50;
  font-size: 20px;
  margin: 0 0 10px;
  line-height: 1.4;
  height: 56px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardCategory = styled.p`
  color: #7f8c8d;
  font-size: 14px;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const CardPrice = styled.p`
  color: #e74c3c;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
`;

const NoResultsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
`;

const NoResultsTitle = styled.h3`
  font-size: 28px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  color: #2c3e50;
`;

const NoResultsMessage = styled.p`
  font-size: 18px;
  color: #7f8c8d;
  max-width: 500px;
  line-height: 1.6;
`;

const CategoryContainer = styled(motion.div)`
  background-color: #ecf0f1;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const CategoryName = styled.h2`
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 15px;
`;

const CategoryDescription = styled.p`
  font-size: 18px;
  color: #34495e;
  line-height: 1.6;
`;

const SearchResultsPage = ({ serverUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(location.state?.searchResults || { categories: [], products: [] });
  const [categoryInfo, setCategoryInfo] = useState(location.state?.categoryInfo);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getImageUrl = (item) => {
    if (item.categoryImage || (item.images && item.images.length > 0)) {
      const imagePath = item.categoryImage || item.images[0];
      const baseUrl = serverUrl || `${BASE_URL}`;
      return imagePath.startsWith('http') ? imagePath : `${baseUrl}/${imagePath}`;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product._id}`, { state: { product } });
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  if (searchResults.categories.length === 0 && searchResults.products.length === 0) {
    return (
      <>
        <NoResultsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NoResultsTitle>
            <FaFrownOpen style={{ marginRight: '15px', fontSize: '32px', color: '#e74c3c' }} /> No results found
          </NoResultsTitle>
          <NoResultsMessage>
            We couldn't find any matching products or categories for your search. Please try different keywords or browse our featured items.
          </NoResultsMessage>
        </NoResultsContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SearchResultsContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PageTitle>Discover Your Perfect Match</PageTitle>

        {categoryInfo && (
          <CategoryContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CategoryName>{categoryInfo.name}</CategoryName>
            <CategoryDescription>{categoryInfo.description}</CategoryDescription>
          </CategoryContainer>
        )}

        {searchResults.categories.length > 0 && (
          <>
            <SectionTitle>Explore Categories</SectionTitle>
            <ResultGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {searchResults.categories.map((category) => (
                <ResultCard
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CardImage src={getImageUrl(category)} alt={category.name} />
                  <CardContent>
                    <CardTitle>{category.name}</CardTitle>
                    <CardCategory>
                      <FaSearch /> {category.productCount || 0} products
                    </CardCategory>
                  </CardContent>
                </ResultCard>
              ))}
            </ResultGrid>
          </>
        )}

        {searchResults.products.length > 0 && (
          <>
            <SectionTitle>Featured Products</SectionTitle>
            <ResultGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {searchResults.products.map((product) => (
                <ResultCard
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CardImage src={getImageUrl(product)} alt={product.name} />
                  <CardContent>
                    <CardTitle>{product.name.slice(0, 50)}{product.name.length > 50 ? '...' : ''}</CardTitle>
                    <CardCategory>
                      <FaStar style={{ color: '#f1c40f' }} /> {product.category.name}
                    </CardCategory>
                    <CardPrice>{formatPrice(product.price)}</CardPrice>
                  </CardContent>
                </ResultCard>
              ))}
            </ResultGrid>
          </>
        )}
      </SearchResultsContainer>
      <Footer />
    </>
  );
};

export default SearchResultsPage;