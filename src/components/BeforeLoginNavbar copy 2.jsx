import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaShoppingCart, FaTimes, FaUser } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { BASE_URL } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const BeforeLoginNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartClicked, setCartClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCategories = async () => {
    if (categories.length === 0) {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsSearchModalOpen(false);
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
    setIsOpen(false);
    if (!isSearchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/api/categories/search?q=${searchTerm}`);
      const categories = categoriesResponse.data;

      let products = [];
      if (categories.length > 0) {
        const productsResponse = await axios.get(`${BASE_URL}/api/products?category=${categories[0]._id}`);
        products = productsResponse.data;
      }

      const searchResults = { categories, products };

      if (categories.length === 0 && products.length === 0) {
        toast.error(`No matching results found for "${searchTerm}"`);
      } else {
        navigate('/search-results', { state: { searchResults } });
      }
    } catch (error) {
      console.error('Error searching products and categories:', error);
      toast.error("An error occurred while searching");
    }

    setIsOpen(false);
    setIsSearchModalOpen(false);
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories/search?q=${value}`);
        setSearchSuggestions(response.data.slice(0, 5));

        if (response.data.length === 0 && value.length === 1) {
          setSearchSuggestions([{ _id: 'no-result', name: `No matching results for "${value}"` }]);
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion._id === 'no-result') {
      return;
    }
    setSearchTerm(suggestion.name);
    setSearchSuggestions([]);
    handleSearch({ preventDefault: () => {} });
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setCartClicked(true);
    toast.error("Please log in to view your cart");
    setTimeout(() => setCartClicked(false), 1000);
  };

  return (
    <nav ref={navbarRef} className="navbar">
      <Toaster />
      <style>
        {`
          /* Navbar styles */
          .navbar {
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            position: sticky;
            top: 0;
            z-index: 1000;
            width: 100%;
          }

          .navbar-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          textarea:focus, input:focus {
            outline: none;
          }

          /* Logo styles */
          .navbar-brand {
            flex: 0 0 auto;
          }

          .navbar-brand a {
            text-decoration: none;
          }

          .logo {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .logo-text {
            font-size: 2rem;
            font-weight: 700;
            color: #3498db;
            letter-spacing: -1px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          .logo-subtext {
            font-size: 0.8rem;
            color: #7f8c8d;
            font-weight: 500;
            margin-top: -5px;
          }

          /* Search bar styles */
          .navbar-search {
            flex: 1 1 auto;
            max-width: 600px;
            margin: 0 2rem;
            position: relative;
          }

          .search-input-container {
            display: flex;
            align-items: center;
            background-color: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 50px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .search-input-container:focus-within {
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          }

          .navbar-search input {
            flex: 1;
            padding: 0.875rem 1.5rem;
            border: none;
            font-size: 1rem;
            background-color: transparent;
            color: #333;
          }

          .navbar-search input::placeholder {
            color: #95a5a6;
          }

          .navbar-search button {
            background-color: transparent;
            border: none;
            padding: 0.875rem 1.5rem;
            cursor: pointer;
            color: #3498db;
            transition: color 0.3s ease;
          }

          .navbar-search button:hover {
            color: #2980b9;
          }
              .navbar-search button:hover {
            background-color: transparent;
          }


          /* Search suggestions styles */
          .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
          }

          .search-suggestions li {
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .search-suggestions li:hover {
            background-color: #f8f9fa;
          }

          /* Navigation menu styles */
          .navbar-nav a {
            color: #34495e;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: color 0.3s ease;
            display: flex;
            align-items: center;
            padding: 0.5rem 0;
          }

          .navbar-nav a:hover {
            color: #3498db;
          }

          .navbar-nav a svg {
            margin-right: 0.5rem;
            color: #3498db;
          }

          /* Updated Dropdown styles */
          .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 0.5rem 0;
            min-width: 180px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }

          /* Show dropdown on hover for non-mobile devices */
          @media (min-width: 769px) {
            .nav-item:hover .dropdown-menu {
              display: block;
            }
          }

          .dropdown-menu li {
            margin: 0;
          }

          .dropdown-menu a {
            display: block;
            padding: 0.5rem 1rem;
            color: #34495e;
            font-weight: 400;
          }

          .dropdown-menu a:hover {
            background-color: #f8f9fa;
          }

          /* New styles to prevent layout shift */
          .nav-item.has-dropdown {
            position: relative;
          }

          .nav-item.has-dropdown > a::after {
            content: '▼';
            font-size: 0.7em;
            margin-left: 0.5em;
          }

          .nav-item.has-dropdown .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
          }

          .nav-item.has-dropdown:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
          }

          /* Mobile toggle button styles */
          .navbar-toggle {
            display: none;
          }

          .search-toggle, .menu-toggle {
            background: none;
            border: none;
            color: #3498db;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
            padding: 0.5rem;
          }

          /* Responsive styles */
          @media (max-width: 1024px) {
            .navbar-container {
              padding: 0.75rem 1rem;
            }

            .navbar-search {
              max-width: 400px;
              margin: 0 1rem;
            }
          }
          @media (max-width: 768px) {
            .navbar-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.75rem 1rem;
            }

            .navbar-brand {
              flex: 0 0 auto;
            }

            .navbar-controls {
              display: flex;
              align-items: center;
            }

            .navbar-search {
              display: none;
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 90%;
              max-width: 400px;
              background-color: #ffffff;
              padding: 1rem;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              z-index: 1001;
              border-radius: 8px;
            }

            .navbar-search.visible {
              display: block;
            }

            .navbar-nav {
              display: none;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background-color: #ffffff;
              padding: 1rem;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              z-index: 1000;
            }

            .navbar-nav.open {
              display: block;
            }

            .navbar-toggle {
              display: flex;
              align-items: center;
            }

            .search-toggle, .menu-toggle {
              background: none;
              border: none;
              color: #3498db;
              font-size: 1.5rem;
              cursor: pointer;
              padding: 0.5rem;
              margin-left: 110px;
            }

            .search-toggle {
              margin-right: 1rem;
            }

            .navbar-nav a {
              color: #4a4a4a;
            }
          }

          /* Animations */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .navbar-search.visible,
          .search-suggestions,
          .navbar-nav.open,
          .dropdown-menu {
            animation: fadeIn 0.3s ease-out;
          }

          /* Cart shake animation */
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }

          .shake {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <div className="logo">
              <span className="logo-text">PEM</span>
              <span className="logo-subtext">Public E-Marketplace</span>
            </div>
          </Link>
        </div>
        <form 
          onSubmit={handleSearch} 
          className={`navbar-search ${isSearchModalOpen ? 'visible' : ''}`}
        >
          <div className="search-input-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </div>
          {searchSuggestions.length > 0 && (
            <ul className="search-suggestions">
              {searchSuggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </form>
        <div className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <ul>
            <li 
              className="nav-item has-dropdown" 
              onMouseEnter={() => {
                setShowCategoriesDropdown(true);
                fetchCategories();
              }}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <NavLink to="/AllCategoriesPage" activeClassName="active">
                Categories
              </NavLink>
              <ul className="dropdown-menu">
                {isLoading ? (
                  <li>Loading categories...</li>
                ) : error ? (
                  <li>{error}</li>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category._id}>
                      <NavLink 
                        to={`/categories/${category._id}`} 
                        onClick={() => {
                          setIsOpen(false);
                          setShowCategoriesDropdown(false);
                        }}
                      >
                        {category.name}
                      </NavLink>
                    </li>
                  ))
                ) : null}
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to="/whats-new" activeClassName="active" onClick={() => setIsOpen(false)}>
                What's New
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/deals" activeClassName="active" onClick={() => setIsOpen(false)}>
                Deals
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cart" onClick={(e) => { handleCartClick(e); setIsOpen(false); }}>
                <FaShoppingCart /> Cart
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className={cartClicked ? 'shake' : ''} onClick={() => setIsOpen(false)}>
                <FaUser /> Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/register" onClick={() => setIsOpen(false)}>Sign Up</NavLink>
            </li>
          </ul>
        </div>

        <div className="navbar-toggle">
          <button onClick={toggleSearchModal} className="search-toggle">
            <FaSearch />
          </button>
          <button onClick={toggleMenu} className="menu-toggle">
            {isOpen ? <FaTimes /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BeforeLoginNavbar;