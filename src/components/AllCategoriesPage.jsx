import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './Footer';
import { BASE_URL } from '../api';

const AllCategoriesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const CategoryGrid = styled.div`
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

const CategoryCard = styled.div`
  background-color: var(--accent-color);
  box-shadow: var(--box-shadow);
  border-radius: 4px;
  text-align: center;
  padding: 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  h3 {
    color: var(--primary-color);
    font-size: 20px;
    margin-bottom: 12px;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: var(--hover-color);
    }
  }
`;

const AllCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <>
      <AllCategoriesContainer>
        <div className="popular-categories">
          <h2>All Categories</h2>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryCard key={category._id}>
                {category.categoryImage ? (
                  <img src={category.categoryImage} alt={category.name} />
                ) : (
                  <div>No image available</div>
                )}
                <h3>{category.name}</h3>
                <Link to={`/categories/${category._id}`}>
                  Explore {category.name} &raquo;
                </Link>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </div>
      </AllCategoriesContainer>
      <Footer />
    </>
  );
};

export default AllCategories;