import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './Footer';
import { BASE_URL } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 2px;
  background-color: #f7f7f7;
  padding: 10px;
  border-radius: 5px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background-color: var(--accent-color);
  box-shadow: var(--box-shadow);
  border-radius: 4px;
  text-align: center;
  padding: 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductTitle = styled.h3`
  color: var(--primary-color);
  font-size: 20px;
  margin-bottom: 12px;
  text-decoration: none;
`;

const ProductDetails = styled.div`
  display: none;
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

const DetailsButton = styled.button`
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--hover-color);
  }
`;

const FooterWrapper = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
`;

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products?category=${categoryId}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [categoryId]);

  const toggleDetails = (event) => {
    const detailsContainer = event.currentTarget.parentNode.querySelector('.product-details');
    if (detailsContainer) {
      detailsContainer.classList.toggle('show');
      event.currentTarget.textContent = detailsContainer.classList.contains('show') ? 'Hide Details' : 'Show Details';
    }
  };

  return (
    <>
      <Container>
        <Title>Products</Title>
        {products.length > 0 ? (
          <ProductGrid>
            {products.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} state={{ product }} style={{ textDecoration: 'none' }}>
                <ProductCard>
                  <ProductImageContainer>
                    <ProductImage src={`${BASE_URL}/${product.images[0]}`} alt={product.name} />
                  </ProductImageContainer>
                  <ProductContent>
                    <ProductTitle>{product.name.length > 50 ? `${product.name.slice(0, 50)}...` : product.name}</ProductTitle>
                    <ProductDetails className="product-details">
                      <DetailsParagraph>{product.description.length > 100 ? `${product.description.slice(0, 100)}...` : product.description}</DetailsParagraph>
                      <DetailsParagraph className="price">Price: ${product.price}</DetailsParagraph>
                      <DetailsParagraph>Category: {product.category.name}</DetailsParagraph>
                      <DetailsParagraph>Item Type: {product.itemType.name}</DetailsParagraph>
                      <DetailsParagraph>Brand: {product.brand.name}</DetailsParagraph>
                    </ProductDetails>
                    <DetailsButton onClick={toggleDetails}>Show Details</DetailsButton>
                  </ProductContent>
                </ProductCard>
              </Link>
            ))}
          </ProductGrid>
        ) : (
          <p>No products found.</p>
        )}
      </Container>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </>
  );
};

export default CategoryProductsPage;