import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaFrownOpen } from 'react-icons/fa';
import Footer from './Footer';

const SearchResultsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  color: #444;
  margin: 30px 0 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`;

const ResultCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0 0 10px;
  line-height: 1.4;
  height: 50px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardCategory = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 10px;
`;

const CardPrice = styled.p`
  color: #e53935;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const NoResultsTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const NoResultsMessage = styled.p`
  font-size: 16px;
  color: #666;
`;

const CategoryContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const CategoryName = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const CategoryDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const SearchResultsPage = ({ serverUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchResults = location.state?.searchResults || { categories: [], products: [] };
  const categoryInfo = location.state?.categoryInfo;

  const getImageUrl = (item) => {
    if (item.categoryImage || (item.images && item.images.length > 0)) {
      const imagePath = item.categoryImage || item.images[0];
      const baseUrl = serverUrl || 'http://localhost:5002';
      return imagePath.startsWith('http') ? imagePath : `${baseUrl}/${imagePath}`;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const handleProductClick = (productId) => {
    console.log("Navigating to product:", productId);
    navigate(`/products/${productId}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  if (searchResults.categories.length === 0 && searchResults.products.length === 0) {
    return (
      <>
        <NoResultsContainer>
          <NoResultsTitle>
            <FaFrownOpen style={{ marginRight: '10px' }} /> No results found.
          </NoResultsTitle>
          <NoResultsMessage>
            Sorry, we couldn't find any matching products or categories for your search.
          </NoResultsMessage>
        </NoResultsContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SearchResultsContainer>
        <PageTitle>Search Results</PageTitle>

        {categoryInfo && (
          <CategoryContainer>
            <CategoryName>{categoryInfo.name}</CategoryName>
            <CategoryDescription>{categoryInfo.description}</CategoryDescription>
          </CategoryContainer>
        )}

        {searchResults.categories.length > 0 && (
          <>
            <SectionTitle>Categories</SectionTitle>
            <ResultGrid>
              {searchResults.categories.map((category) => (
                <ResultCard key={category._id} onClick={() => handleCategoryClick(category._id)}>
                  <CardImage src={getImageUrl(category)} alt={category.name} />
                  <CardContent>
                    <CardTitle>{category.name}</CardTitle>
                  </CardContent>
                </ResultCard>
              ))}
            </ResultGrid>
          </>
        )}

        {searchResults.products.length > 0 && (
          <>
            <SectionTitle>Products</SectionTitle>
            <ResultGrid>
              {searchResults.products.map((product) => (
                <ResultCard 
                  key={product._id} 
                  onClick={() => handleProductClick(product._id)}
                >
                  <CardImage src={getImageUrl(product)} alt={product.name} />
                  <CardContent>
                    <CardTitle>{product.name.slice(0, 50)}{product.name.length > 50 ? '...' : ''}</CardTitle>
                    <CardCategory>Category: {product.category.name}</CardCategory>
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