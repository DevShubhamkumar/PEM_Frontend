import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSearch, FaStar, FaChevronDown, FaChevronUp, FaFilter, FaTimes, FaShoppingCart, FaTruck, FaShieldAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import debounce from 'lodash/debounce';

// New ProductSkeleton component
const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="md:flex">
      <div className="md:w-1/3">
        <div className="h-64 bg-gray-300"></div>
      </div>
      <div className="md:w-2/3 p-6">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

export default function CategoryProductsPage() {
  const { categoryId } = useParams();
  const { 
    fetchCategoryProducts, 
    fetchCategories, 
    loading, 
    error, 
    addToCart 
  } = useAppContext();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    brands: true,
    ratings: true,
    discounts: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedProducts, categories] = await Promise.all([
          fetchCategoryProducts(categoryId),
          fetchCategories()
        ]);
        setProducts(fetchedProducts);
        const category = categories.find(cat => cat._id === categoryId);
        setCategoryName(category ? category.name : '');
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [categoryId, fetchCategoryProducts, fetchCategories]);

  const filterProducts = useCallback(() => {
    const filtered = products.filter((product) => {
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand.name);
      const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.totalRating));
      const matchesDiscount = selectedDiscounts.length === 0 || selectedDiscounts.some(discount => product.discount >= discount);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesPrice && matchesBrand && matchesRating && matchesDiscount && matchesSearch;
    });

    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'rating':
          return b.totalRating - a.totalRating;
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [products, priceRange, selectedBrands, selectedRatings, selectedDiscounts, searchTerm, sortBy]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      const suggestions = products
        .filter(product => 
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.description.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 5)
        .map(product => product.name);
      setSearchSuggestions(suggestions);
    }, 300),
    [products]
  );

  useEffect(() => {
    if (searchTerm.length > 2) {
      debouncedSearch(searchTerm);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterProducts();
    setSearchSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    filterProducts();
    setSearchSuggestions([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterToggle = () => setIsFilterOpen(!isFilterOpen);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const handleDiscountChange = (discount) => {
    setSelectedDiscounts(prev => 
      prev.includes(discount) ? prev.filter(d => d !== discount) : [...prev, discount]
    );
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const uniqueBrands = useMemo(() => 
    Array.from(new Set(products.map(p => p.brand.name))),
    [products]
  );

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedDiscounts([]);
    setPriceRange({ min: 0, max: 2000000 });
    setSearchTerm('');
    setSortBy('featured');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">{categoryName}</h1>
          <p className="text-xl mb-8 max-w-2xl">Discover amazing products in our curated {categoryName} collection</p>
          <div className="relative w-full max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                ref={searchInputRef}
              />
              <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <FaSearch className="text-gray-400 text-xl" />
              </button>
            </form>
            {searchSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white w-full mt-2 text-black rounded-lg shadow-lg">
                {searchSuggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className={`lg:w-1/4 bg-white p-6 rounded-lg shadow-lg ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Filters</h2>
              <button
                onClick={handleFilterToggle}
                className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-8">
              <button
                onClick={() => toggleFilter('price')}
                className="flex items-center justify-between w-full text-left text-xl font-semibold mb-4 focus:outline-none"
              >
                Price Range
                {expandedFilters.price ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedFilters.price && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      name="min"
                      value={priceRange.min}
                      onChange={handlePriceChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      name="max"
                      value={priceRange.max}
                      onChange={handlePriceChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="10000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Brands */}
            <div className="mb-8">
              <button
                onClick={() => toggleFilter('brands')}
                className="flex items-center justify-between w-full text-left text-xl font-semibold mb-4 focus:outline-none"
              >
                Brands
                {expandedFilters.brands ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedFilters.brands && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uniqueBrands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="mr-2 form-checkbox text-blue-500"
                      />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Ratings */}
            <div className="mb-8">
              <button
                onClick={() => toggleFilter('ratings')}
                className="flex items-center justify-between w-full text-left text-xl font-semibold mb-4 focus:outline-none"
              >
                Ratings
                {expandedFilters.ratings ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedFilters.ratings && (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingChange(rating)}
                        className="mr-2 form-checkbox text-blue-500"
                      />
                      <div className="flex">
                        {[...Array(rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <FaStar key={i} className="text-gray-300" />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Discounts */}
            <div className="mb-8">
              <button
                onClick={() => toggleFilter('discounts')}
                className="flex items-center justify-between w-full text-left text-xl font-semibold mb-4 focus:outline-none"
              >
                Discounts
                {expandedFilters.discounts ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedFilters.discounts && (
                <div className="space-y-2">
                  {[10, 20, 30, 40, 50].map(discount => (
                    <label key={discount} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDiscounts.includes(discount)}
                        onChange={() => handleDiscountChange(discount)}
                        className="mr-2 form-checkbox text-blue-500"
                      />
                      <span className="text-gray-700">{discount}% or more</span>
                    </label>
                  ))}
                </div>)}
            </div>

            <button
              onClick={clearAllFilters}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
            >
              Clear All Filters
            </button>
          </div>

          {/* Products */}
          <div className="lg:w-3/4">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto p-3 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="latest">Latest Products</option>
              </select>
              <button
                onClick={handleFilterToggle}
                className="w-full sm:w-auto lg:hidden bg-blue-500 text-white px-6 py-3 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
              >
                <FaFilter className="mr-2" />
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            <div className="space-y-8">
              {isLoading ? (
                // Display skeleton loaders while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : (
                currentProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative">
                        <img
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-64 object-cover"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 m-2 rounded">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="md:w-2/3 p-6">
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">{product.name}</h3>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl font-bold text-blue-600">₹{product.price.toFixed(2)}</span>
                          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-semibold">{product.totalRating.toFixed(1)}</span>
                            <span className="text-gray-500 ml-1">({product.totalRatingsCount} reviews)</span>
                          </div>
                        </div>
                        <p className="text-gray-500 mb-4">Brand: <span className="font-semibold">{product.brand.name}</span></p>
                        <div className="flex space-x-4">
                          <Link 
                            to={`/products/${product._id}`} 
                            className="bg-blue-500 text-white px-6 py-3 rounded-full inline-block hover:bg-blue-600 transition duration-300"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-green-500 text-white px-6 py-3 rounded-full inline-block hover:bg-green-600 transition duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-4 py-2 rounded-full ${
                    currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition duration-300`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Why Shop with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <FaShoppingCart className="text-blue-500 text-5xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Wide Selection</h3>
              <p className="text-gray-600">Discover a vast array of products in our {categoryName} category</p>
            </div>
            <div className="text-center">
              <FaTruck className="text-green-500 text-5xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">Enjoy quick and reliable shipping on all your purchases</p>
            </div>
            <div className="text-center">
              <FaShieldAlt className="text-red-500 text-5xl mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Secure Shopping</h3>
              <p className="text-gray-600">Shop with confidence using our secure payment methods</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}