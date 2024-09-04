import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { useLoading } from './LoadingContext';
import Footer from './Footer';
import { BASE_URL } from '../api';

const AllCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoading, setIsLoading } = useLoading();

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedCategories = localStorage.getItem('categories');
      const storedTimestamp = localStorage.getItem('categoriesTimestamp');
      const currentTime = new Date().getTime();

      // Check if stored categories exist and are less than 1 hour old
      if (storedCategories && storedTimestamp && (currentTime - parseInt(storedTimestamp)) < 3600000) {
        setCategories(JSON.parse(storedCategories));
      } else {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data);
        localStorage.setItem('categories', JSON.stringify(response.data));
        localStorage.setItem('categoriesTimestamp', currentTime.toString());
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    checkAuthStatus();
    fetchCategories();
  }, [checkAuthStatus, fetchCategories]);

  useEffect(() => {
    const results = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const displayedCategories = showAll ? filteredCategories : filteredCategories.slice(0, 8);

  if (isLoading) {
    return null; // The global loading state will handle the preloader
  }

  return (
    <div className="all-categories-page w-full">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-24">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Explore All Categories</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Discover a world of products and services across various categories</p>
          <div className="relative w-full max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-3 px-4 pl-12 rounded-full text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Categories Grid */}
      <section className="categories-grid py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {displayedCategories.map((category) => (
                <motion.div
                  key={category._id}
                  className="category-card bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={category.categoryImage || "https://via.placeholder.com/400x300"} alt={category.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{category.name}</h3>
                    <Link to={`/categories/${category._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Explore {category.name} &raquo;
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {filteredCategories.length > 8 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 inline-flex items-center"
              >
                {showAll ? "Show Less" : "Show More"}
                <FaChevronDown className={`ml-2 transform ${showAll ? "rotate-180" : ""} transition-transform duration-300`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => (
              <div key={category._id} className="featured-category-card bg-gray-100 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
                <img src={category.categoryImage || "https://via.placeholder.com/400x300"} alt={category.name} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">{category.name}</h3>
                  <p className="text-gray-600 mb-4">Discover the best products and services in {category.name}</p>
                  <Link to={`/categories/${category._id}`} className="bg-indigo-600 text-white py-2 px-4 rounded-full font-medium hover:bg-indigo-700 transition duration-300">
                    Explore Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Exploring?</h2>
          <p className="text-xl mb-10">Find the perfect category for your needs and start discovering amazing products and services!</p>
          {isLoggedIn ? (
            <Link to="/dashboard" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/signup" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllCategoriesPage;