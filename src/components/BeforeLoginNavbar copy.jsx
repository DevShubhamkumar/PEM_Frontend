import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './Navbar.css';

const BeforeLoginNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }
  
    try {
      const categoriesResponse = await axios.get(`http://localhost:5002/api/categories/search?q=${searchTerm}`);
      const categories = categoriesResponse.data;
  
      let products = [];
      if (categories.length > 0) {
        const productsResponse = await axios.get(`http://localhost:5002/api/products?category=${categories[0]._id}`);
        products = productsResponse.data;
      }
  
      const searchResults = { categories, products };
      navigate('/search-results', { state: { searchResults } });
    } catch (error) {
      console.error('Error searching products and categories:', error);
      // Navigate to search results page even if there's an error
      navigate('/search-results', { state: { searchResults: { categories: [], products: [] } } });
    }
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await axios.get(`http://localhost:5002/api/categories/search?q=${value}`);
        setSearchSuggestions(response.data.slice(0, 5)); // Limit to 5 suggestions
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSearchSuggestions([]);
    handleSearch({ preventDefault: () => {} }); // Trigger search immediately
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <div className="logo">
              <span className="logo-text">PEM</span>
              <span className="logo-subtext">Public E-Marketplace</span>
            </div>
          </Link>
        </div>
        <form onSubmit={handleSearch} className={`navbar-search ${isOpen ? 'open' : ''}`}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          {searchSuggestions.length > 0 && (
            <ul className="search-suggestions">
              {searchSuggestions.map((suggestion) => (
                <li key={suggestion._id} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
          <button type="submit">
            <FaSearch />
          </button>
        </form>
        <div className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <NavLink to="/AllCategoriesPage" activeClassName="active">
                Categories
                <ul className="dropdown">
                  {categories.map((category) => (
                    <li key={category._id}>
                      <NavLink to={`/categories/${category._id}`}>{category.name}</NavLink>
                    </li>
                  ))}
                </ul>
              </NavLink>
            </li>
            <li>
              <NavLink to="/whats-new" activeClassName="active">
                What's New
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart">
                <FaShoppingCart /> Cart
              </NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Sign Up</NavLink>
            </li>
            <li>
              <NavLink to="/deals" activeClassName="active">
                Deals
              </NavLink>
            </li>
            <li>
              <button className="dark-mode-btn" onClick={toggleDarkMode}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
            </li>
          </ul>
        </div>
        <div className="navbar-toggle">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BeforeLoginNavbar;