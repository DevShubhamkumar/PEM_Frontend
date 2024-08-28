import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaTimes, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { Toaster, toast } from 'react-hot-toast';
import styled, { keyframes } from 'styled-components';
import { BASE_URL } from '../api';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  50% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const ShakeableNavLink = styled(NavLink)`
  animation: ${props => props.shake ? shakeAnimation : 'none'} 0.5s;
`;

const BuyerNavbar = ({ isAuthenticated, buyerData, handleLogout }) => {
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
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (buyerData.profilePicture) {
      localStorage.setItem('buyerProfilePicture', `${BASE_URL}/${buyerData.profilePicture}`);
    }
  }, [buyerData.profilePicture]);

  const profilePictureUrl = localStorage.getItem('buyerProfilePicture') || 
    (buyerData.profilePicture ? `${BASE_URL}/${buyerData.profilePicture}` : '/default-profile-picture.png');

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
      const categoriesResponse = await axios.get(`${BASE_URL}/api/categories/search?q=${searchTerm}`);
      const categories = categoriesResponse.data;
  
      let products = [];
      if (categories.length > 0) {
        const productsResponse = await axios.get(`${BASE_URL}/api/products?category=${categories[0]._id}`);
        products = productsResponse.data;
      }
  
      const searchResults = { categories, products };
      navigate('/search-results', { state: { searchResults } });
    } catch (error) {
      console.error('Error searching products and categories:', error);
      navigate('/search-results', { state: { searchResults: { categories: [], products: [] } } });
    }
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories/search?q=${value}`);
        setSearchSuggestions(response.data.slice(0, 5));
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
    handleSearch({ preventDefault: () => {} });
  };

  const handleLogoutWithClear = () => {
    localStorage.removeItem('buyerProfilePicture');
    handleLogout();
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`}>
      <Toaster />
      <div className="navbar-container">
        <div className="navbar-brand" style={{ order: 1 }}>
          <Link to="/">
            <div className="logo">
              <span className="logo-text">PEM</span>
              <span className="logo-subtext">Public E-Marketplace</span>
            </div>
          </Link>
        </div>
        <form 
          onSubmit={handleSearch} 
          className="navbar-search"
          style={{
            display: 'flex',
            order: 2,
            width: '100%',
            maxWidth: '600px',
            margin: '1rem auto',
            position: 'relative',
          }}
        >
          <div style={{
            display: 'flex',
            width: '100%',
          }}>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '16px',
                border: 'none',
                outline: 'none',
                background: 'transparent',
              }}
            />
            <button 
              type="submit"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0 1rem',
              }}
            >
              <FaSearch style={{ color: '#4a90e2', fontSize: '18px' }} />
            </button>
          </div>
          {searchSuggestions.length > 0 && (
            <ul className="search-suggestions" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '0 0 4px 4px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {searchSuggestions.map((suggestion) => (
                <li 
                  key={suggestion._id} 
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '0.5rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </form>
        <div className={`navbar-nav ${isOpen ? 'open' : ''}`} style={{ order: 3 }}>
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
              <NavLink to="/buyer/whats-new" activeClassName="active">
                What's New
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart">
                <FaShoppingCart /> Cart
              </NavLink>
            </li>
            <li>
              <NavLink to="/buyer/profile" activeClassName="active">
                <img
                  src={profilePictureUrl}
                  alt={buyerData.profilePicture ? "Profile" : "Default Profile"}
                  className="profile-picture"
                />
                {buyerData.name}
              </NavLink>
            </li>
            <li>
              <NavLink to="/buyer/orders" activeClassName="active">
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/buyer/deals" activeClassName="active">
                Deals
              </NavLink>
            </li>
            <li>
              <NavLink to="/" onClick={handleLogoutWithClear}>
                <FaSignOutAlt /> Logout
              </NavLink>
            </li>
            {/* <li>
              <button className="dark-mode-btn" onClick={toggleDarkMode}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
            </li> */}
          </ul>
        </div>
        <div className="navbar-toggle" style={{ order: 0 }}>
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BuyerNavbar;