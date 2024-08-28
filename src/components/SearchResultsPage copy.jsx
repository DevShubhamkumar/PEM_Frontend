import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFrownOpen } from 'react-icons/fa';
import StarRatingComponent from 'react-star-rating-component';
import Footer from './Footer';

const SearchResultsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 20px;
  transition: transform 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-5px);
  }

  @media (min-width: 768px) {
    flex-direction: row;
    width: 100%;
    height: auto;
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 200px;
    margin-bottom: 0;
    margin-right: 20px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const ProductTitle = styled.h3`
  color: #333;
  font-size: 18px;
  margin-bottom: 12px;
`;

const ProductDetails = styled.div`
  margin-bottom: 20px;
`;

const DetailsParagraph = styled.p`
  margin-bottom: 5px;
  color: #666;
  &.price {
    color: #333;
    font-weight: bold;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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

const SearchResultsPage = ({ serverUrl }) => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || { categories: [], products: [] };

  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0) {
      const imagePath = item.images[0];
      const baseUrl = serverUrl || 'http://localhost:5002';
      return imagePath.startsWith('http') ? imagePath : `${baseUrl}/${imagePath}`;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
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
        <Title>Search Results</Title>
        {searchResults.products.length > 0 && (
          <>
            <h3>Products</h3>
            <ProductList>
              {searchResults.products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  to={`/products/${product._id}`}
                  state={{ product }}
                >
                  <ProductImageContainer>
                    <ProductImage src={getImageUrl(product)} alt={product.name} />
                  </ProductImageContainer>
                  <ProductContent>
                    <ProductTitle>
                      {product.name.length > 50 ? `${product.name.slice(0, 50)}...` : product.name}
                    </ProductTitle>
                    <ProductDetails>
                      <DetailsParagraph>
                        {product.description.length > 100
                          ? `${product.description.slice(0, 100)}...`
                          : product.description}
                      </DetailsParagraph>
                      <DetailsParagraph className="price">
                        Price: {formatPrice(product.price)}
                      </DetailsParagraph>
                      <RatingContainer>
                        <StarRatingComponent
                          value={product.rating || 0}
                          editing={false}
                        />
                        <span>({product.totalRatingsCount || 0})</span>
                      </RatingContainer>
                      {product.discount > 0 && (
                        <DetailsParagraph>
                          Discount: {product.discount}%
                        </DetailsParagraph>
                      )}
                    </ProductDetails>
                  </ProductContent>
                </ProductCard>
              ))}
            </ProductList>
          </>
        )}
        {searchResults.categories.length > 0 && (
          <>
            <h3>Categories</h3>
            {/* Add category display logic here if needed */}
          </>
        )}
      </SearchResultsContainer>
      <Footer />
    </>
  );
};

export default SearchResultsPage;