import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAppContext } from './AppContext';

import { Alert, AlertTitle, AlertDescription } from './Alert';
import Footer from './Footer';

const ITEMS_PER_PAGE = 12;

const AllCategoriesPage = () => {
  const {
    isAuthenticated,
    fetchCategories,
    searchTerm,
    setSearchTerm,
    categoriesPage,
    setCategoriesPage,
  } = useAppContext();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchCategories()
      .then(data => {
        if (isMounted) {
          setCategories(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [fetchCategories]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCategoriesPage(1);
  }, [setSearchTerm, setCategoriesPage]);

  const handleCategoriesPageChange = useCallback((newPage) => {
    setCategoriesPage(newPage);
  }, [setCategoriesPage]);

  const filteredCategories = useMemo(() => 
    categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [categories, searchTerm]
  );

  const totalPages = useMemo(() => 
    Math.ceil(filteredCategories.length / ITEMS_PER_PAGE),
    [filteredCategories]
  );

  const displayedCategories = useMemo(() => 
    filteredCategories.slice(
      (categoriesPage - 1) * ITEMS_PER_PAGE,
      categoriesPage * ITEMS_PER_PAGE
    ),
    [filteredCategories, categoriesPage]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="all-categories-page w-full mt-20">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-24">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Explore All Categories</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Discover a world of products and services across various categories</p>
          <div className="relative w-full max-w-xl mx-auto">
            <label htmlFor="search-input" className="sr-only">Search categories</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full py-3 px-4 pl-12 rounded-full text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <FaSearch className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                <CategoryCard key={category._id} category={category} />
              ))}
            </AnimatePresence>
          </motion.div>
          <div className="flex justify-center items-center mt-12">
            <button
              onClick={() => handleCategoriesPageChange(categoriesPage - 1)}
              className="bg-indigo-600 text-white py-2 px-4 rounded-full font-medium hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={categoriesPage === 1}
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>
            <span className="mx-4 text-gray-700 font-medium">
              Page {categoriesPage} of {totalPages}
            </span>
            <button
              onClick={() => handleCategoriesPageChange(categoriesPage + 1)}
              className="bg-indigo-600 text-white py-2 px-4 rounded-full font-medium hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={categoriesPage === totalPages}
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => (
              <FeaturedCategoryCard key={category._id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8">Join our community and explore the world of possibilities!</p>
          {!isAuthenticated && (
            <Link to="/signup" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const CategoryCard = React.memo(({ category }) => (
  <motion.div
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
));

const FeaturedCategoryCard = React.memo(({ category }) => (
  <div className="featured-category-card bg-gray-100 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
    <img src={category.categoryImage || "https://via.placeholder.com/400x300"} alt={category.name} className="w-full h-56 object-cover" />
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">{category.name}</h3>
      <p className="text-gray-600 mb-4">Discover the best products and services in {category.name}</p>
      <Link to={`/categories/${category._id}`} className="bg-indigo-600 text-white py-2 px-4 rounded-full font-medium hover:bg-indigo-700 transition duration-300">
        Explore Now
      </Link>
    </div>
  </div>
));

export default AllCategoriesPage;