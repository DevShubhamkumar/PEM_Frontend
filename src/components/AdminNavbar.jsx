import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

export const BASE_URL = 'https://pem-backend.onrender.com';

const AdminNavbar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
          throw new Error('User ID or token not found');
        }

        const profileResponse = await axios.get(`${BASE_URL}/api/admins/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = profileResponse.data || {};

        setAdminData(profileData);
        const profilePictureUrl = profileData.profilePicture
          ? profileData.profilePicture.startsWith('http')
            ? profileData.profilePicture
            : `${BASE_URL}/${profileData.profilePicture}`
          : '';
        setProfilePicUrl(profilePictureUrl);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchAdminData();
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
          <Link to="/admin/dashboard">
            <div className="logo">
              <span className="logo-text">PEM</span>
              <span className="logo-subtext">Public E-Marketplace</span>
            </div>
          </Link>
        </div>
        <div className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <NavLink to="/admin/manage-users" activeClassName="active">
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/manage-products" activeClassName="active">
                Manage Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/manage-orders" activeClassName="active">
                Manage Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/reports" activeClassName="active">
                Reports
              </NavLink>
            </li>
            <li>
              {profilePicUrl ? (
                <img src={profilePicUrl} alt="Profile" className="profile-picture" />
              ) : (
                <div className="empty-profile-picture"></div>
              )}
            </li>
            <li>
              <NavLink to="/" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </NavLink>
            </li>
            <li>
              <button onClick={toggleDarkMode}>{isDarkMode ? <FaSun /> : <FaMoon />}</button>
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

export default AdminNavbar;