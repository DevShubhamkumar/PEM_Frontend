// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaUserCircle, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';
import { BASE_URL } from '../api';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
        <div className={`navbar-search ${isOpen ? 'open' : ''}`}>
          <input type="text" placeholder="Search for products..." />
          <button type="submit">
            <FaSearch />
          </button>
        </div>
        <div className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <NavLink to="/categories">
                Categories
                <ul className="dropdown">
                  <li>
                    <NavLink to="/category/electronics">Electronics</NavLink>
                  </li>
                  <li>
                    <NavLink to="/category/fashion">Fashion</NavLink>
                  </li>
                  <li>
                    <NavLink to="/category/home">Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/category/beauty">Beauty</NavLink>
                  </li>
                </ul>
              </NavLink>
            </li>
            <li>
              <NavLink to="/new-arrivals">
                What's New
                <ul className="dropdown">
                  <li>
                    <NavLink to="/new-arrivals">New Arrivals</NavLink>
                  </li>
                  <li>
                    <NavLink to="/featured">Featured</NavLink>
                  </li>
                </ul>
              </NavLink>
            </li>
            <li>
              <NavLink to="/deals">Deals</NavLink>
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
              <button onClick={toggleDarkMode}>
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

export default Navbar;