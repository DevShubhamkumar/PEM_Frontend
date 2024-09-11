import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaFrownOpen, FaSearch, FaChevronRight, FaStar } from 'react-icons/fa';
import Footer from './Footer';
import { BASE_URL } from '../api';

const SearchResultsPage = ({ serverUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchResults = location.state?.searchResults || { categories: [], products: [] };
  const categoryInfo = location.state?.categoryInfo;

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
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaFrownOpen className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Results Found</h2>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, we couldn't find any matching products or categories for your search.
            </p>
            <Link to="/" className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Results</h1>
            <p className="text-xl mb-8">Discover amazing products and categories that match your search</p>
            {categoryInfo && (
              <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-filter backdrop-blur-lg">
                <h2 className="text-2xl font-semibold mb-2">{categoryInfo.name}</h2>
                <p className="text-lg">{categoryInfo.description}</p>
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        {searchResults.categories.length > 0 && (
          <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Matching Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.categories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <img src={getImageUrl(category)} alt={category.name} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.name}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex items-center text-indigo-600">
                        <span className="font-medium">Explore Category</span>
                        <FaChevronRight className="ml-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        {searchResults.products.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Matching Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {searchResults.products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                    onClick={() => handleProductClick(product)}
                  >
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name.slice(0, 50)}{product.name.length > 50 ? '...' : ''}</h3>
                      <p className="text-gray-600 mb-2">Category: {product.category.name}</p>
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <span className="text-gray-600 ml-2">(5.0)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-indigo-600">{formatPrice(product.price)}</span>
                        <button className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Didn't Find What You're Looking For?</h2>
            <p className="text-xl mb-8">Try refining your search or explore our full catalog for more options!</p>
            <Link to="/categories" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300 inline-flex items-center">
              <FaSearch className="mr-2" />
              Explore All Categories
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;