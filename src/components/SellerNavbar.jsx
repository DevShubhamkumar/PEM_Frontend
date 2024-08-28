import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { BASE_URL } from '../api';

const SellerNavbar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
          throw new Error('User ID or token not found');
        }

        const response = await axios.get(`${BASE_URL}/api/sellers/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response && response.data) {
          const profilePictureUrl = response.data.profilePicture
            ? response.data.profilePicture.startsWith('http')
              ? response.data.profilePicture
              : `${BASE_URL}/${response.data.profilePicture}`
            : '';

          setProfilePicUrl(profilePictureUrl);
        } else {
          throw new Error('Profile response is missing data');
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePicture();
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
          <Link to="/seller">
            <div className="logo">
              <span className="logo-text">PEM</span>
              <span className="logo-subtext">Public E-Marketplace</span>
            </div>
          </Link>
        </div>
        <div className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <NavLink to="/seller" end activeClassName="active">
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/seller/products" activeClassName="active">
                Manage Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/seller/add-product" activeClassName="active">
                Add Product
              </NavLink>
            </li>
            <li>
              <NavLink to="/seller/products/:productId/reviews" activeClassName="active">
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to="/" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </NavLink>
            </li>
            {/* <li>
              <button onClick={toggleDarkMode}>{isDarkMode ? <FaSun /> : <FaMoon />}</button>
            </li> */}
            <li>
              {profilePicUrl && <img src={profilePicUrl} alt="Profile" className="profile-pic" />}
            </li>
          </ul>
        </div>
        <div className="navbar-toggle">
          <button onClick={toggleMenu}>{isOpen ? <FaTimes /> : <GiHamburgerMenu />}</button>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;