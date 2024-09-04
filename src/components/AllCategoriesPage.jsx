import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import Footer from './Footer';
import { BASE_URL } from '../api';

const AllCategoriesContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled(motion.h1)`
  text-align: center;
  color: var(--primary-color);
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 50%;
  padding: 10px 15px;
  font-size: 1rem;
  border: 2px solid var(--accent-color);
  border-radius: 25px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
`;

const SearchIcon = styled(Search)`
  position: relative;
  left: -30px;
  top: 10px;
  color: var(--accent-color);
`;

const CategoryGrid = styled(motion.div)`
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

const CategoryCard = styled(motion.div)`
  background-color: var(--accent-color);
  box-shadow: var(--box-shadow);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const CategoryInfo = styled.div`
  padding: 20px;
  text-align: center;

  h3 {
    color: var(--primary-color);
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: var(--hover-color);
    }
  }
`;

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const results = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <AllCategoriesContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          Explore All Categories
        </Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <SearchIcon size={20} />
        </SearchContainer>
        <CategoryGrid layout>
          <AnimatePresence>
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.categoryImage ? (
                  <motion.img
                    src={category.categoryImage}
                    alt={category.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                ) : (
                  <div>No image available</div>
                )}
                <CategoryInfo>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {category.name}
                  </motion.h3>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link to={`/categories/${category._id}`}>
                      Explore {category.name} &raquo;
                    </Link>
                  </motion.div>
                </CategoryInfo>
              </CategoryCard>
            ))}
          </AnimatePresence>
        </CategoryGrid>
      </AllCategoriesContainer>
      <Footer />
    </>
  );
};

export default AllCategories;