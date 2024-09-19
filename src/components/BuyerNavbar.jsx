import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import styled from 'styled-components';

import { BASE_URL } from "../api";
import { useAppContext } from "./AppContext";

const AnimatedDropdown = styled.ul`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1000;
  position: absolute;
  width: 100%;
  max-height: none;
  overflow-y: visible;
`;

const CategoryDropdown = styled(AnimatedDropdown)`
  left: 0;
  width: 200px;
  padding: 10px 0;
`;

const NavbarDropdown = styled(AnimatedDropdown)`
  top: 100%;
  left: 0;
  width: 100%;
  padding: 10px 0;
`;

const NoResultsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
  text-align: center;
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 1rem;
  z-index: 100;
  transition: all 0.3s ease-in-out;
  opacity: ${props => props.isOpen ? 1 : 0};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-20px)'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0 0 10px 10px;
`;

const HamburgerButton = styled.button`
  width: 30px;
  height: 30px;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #33DDFF;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;

    &:nth-child(1) {
      top: ${props => props.isOpen ? '14px' : '5px'};
      transform: ${props => props.isOpen ? 'rotate(135deg)' : 'none'};
    }

    &:nth-child(2) {
      top: 14px;
      opacity: ${props => props.isOpen ? '0' : '1'};
      left: ${props => props.isOpen ? '-60px' : '0'};
    }

    &:nth-child(3) {
      top: ${props => props.isOpen ? '14px' : '23px'};
      transform: ${props => props.isOpen ? 'rotate(-135deg)' : 'none'};
    }
  }
`;

const BuyerNavbar = ({ isAuthenticated, buyerData, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const categoryDropdownRef = useRef(null);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { fetchCategories } = useAppContext();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile) {
        setIsOpen(false);
        setShowCategoriesDropdown(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    fetchCategories().then(setCategories).catch(console.error);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fetchCategories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  const performSearch = useCallback(async (searchTerm) => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/categories/search?q=${searchTerm}`),
        axios.get(`${BASE_URL}/api/search?q=${searchTerm}`)
      ]);

      const categories = categoriesResponse.data;
      const products = productsResponse.data;

      const searchResults = { categories, products };

      if (categories.length === 0 && products.length === 0) {
        toast.error(`No matching results found for "${searchTerm}"`);
      } else {
        navigate("/search-results", { 
          state: { searchResults, searchTerm } 
        });
      }
    } catch (error) {
      console.error("Error searching products and categories:", error);
      toast.error("An error occurred while searching");
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    await performSearch(searchTerm);
    setIsOpen(false);
  };
    
  const handleSuggestionClick = useCallback(async (suggestion) => {
    setSearchTerm(suggestion.name);
    setSearchSuggestions([]);
    await performSearch(suggestion.name);
  }, [performSearch]);

  const handleSearchInputChange = useCallback(async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(value.trim().length > 0);

    if (value.trim()) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/categories/search?q=${value}`
        );
        setSearchSuggestions(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  }, []);

  const handleCategoryClick = useCallback((categoryId) => {
    navigate(`/categories/${categoryId}`);
    setShowCategoriesDropdown(false);
    if (isMobile) {
      setIsOpen(false);
    }
  }, [navigate, isMobile]);

  const handleNavLinkClick = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const handleLogoutWithClear = useCallback(() => {
    localStorage.removeItem('buyerProfilePicture');
    handleLogout();
  }, [handleLogout]);

  const memoizedCategories = useMemo(() => categories, [categories]);

  const profilePictureUrl = useMemo(() => {
    return localStorage.getItem('buyerProfilePicture') || 
      (buyerData.profilePicture ? `${BASE_URL}/${buyerData.profilePicture}` : '/default-profile-picture.png');
  }, [buyerData.profilePicture]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-start">
              <span className="text-2xl md:text-3xl font-black tracking-wider font-arial" style={{ color: "#33DDFF", fontWeight: "900" }}>
                PEM
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Public E-Marketplace
              </span>
            </Link>
          </div>

          {/* Search bar for desktop */}
          <div className="hidden md:block flex-grow max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400 shadow-md">
                <input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search for products..."
                  className="w-full py-3 px-6 bg-transparent text-gray-700 leading-tight focus:outline-none"
                />
                <button type="submit" className="p-3 text-[#33DDFF] hover:bg-gray-200 focus:outline-none transition-colors duration-200">
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
              {isSearching && (
                <NavbarDropdown className="mt-2">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((suggestion) => (
                      <li
                        key={suggestion._id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      >
                        {suggestion.name}
                      </li>
                    ))
                  ) : (
                    <NoResultsMessage>
                      <FaSearch />
                      <p>No matching results found for "{searchTerm}"</p>
                    </NoResultsMessage>
                  )}
                </NavbarDropdown>
              )}
            </form>
          </div>

          {/* Navigation links for desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <div 
              className="relative group"
              ref={categoryDropdownRef}
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <NavLink to="/AllCategoriesPage" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
                Categories
              </NavLink>
              {showCategoriesDropdown && (
                <CategoryDropdown>
                  {memoizedCategories.map((category) => (
                    <li key={category._id}>
                      <button
                        onClick={() => handleCategoryClick(category._id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </CategoryDropdown>
              )}
            </div>
            <NavLink to="/about" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              About
            </NavLink>
            <NavLink to="/contact" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Contact
            </NavLink>
            <NavLink to="/cart" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center">
              <FaShoppingCart className="mr-1 text-[#33DDFF]" /> Cart
            </NavLink>
            <NavLink to="/buyer/profile" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center">
              <img
                src={profilePictureUrl}
                alt={buyerData.profilePicture ? "Profile" : "Default Profile"}
                className="w-8 h-8 rounded-full mr-2"
              />
              {buyerData.name}
            </NavLink>
            <NavLink to="/buyer/orders" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Orders
            </NavLink>
            <button onClick={handleLogoutWithClear} className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center">
              <FaSignOutAlt className="mr-1 text-[#33DDFF]" /> Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <HamburgerButton
              onClick={toggleMenu}
              isOpen={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <span></span>
              <span></span>
              <span></span>
            </HamburgerButton>
          </div>
        </div>
      </div>
{/* Mobile menu */}
<MobileMenu isOpen={isOpen}>
        <form onSubmit={handleSearch} className="relative mb-4">
          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400 shadow-md">
            <input
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search for products..."
              className="w-full py-3 px-6 bg-transparent text-gray-700 leading-tight focus:outline-none"
            />
            <button type="submit" className="p-3 text-[#33DDFF] hover:bg-gray-200 focus:outline-none transition-colors duration-200">
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
          {isSearching && (
            <NavbarDropdown className="mt-2">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-6 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                  >
                    {suggestion.name}
                  </li>
                ))
              ) : (
                <NoResultsMessage>
                  <FaSearch />
                  <p>No matching results found for "{searchTerm}"</p>
                </NoResultsMessage>
              )}
            </NavbarDropdown>
          )}
        </form>
        
        <NavLink 
          to="/AllCategoriesPage" 
          className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
          onClick={handleNavLinkClick}
        >
          Categories
        </NavLink>
        <NavLink 
          to="/about" 
          className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
          onClick={handleNavLinkClick}
        >
          About
        </NavLink>
        <NavLink 
          to="/contact" 
          className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
          onClick={handleNavLinkClick}
        >
          Contact
        </NavLink>
        <NavLink 
          to="/cart" 
          className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide flex items-center transition-colors duration-200"
          onClick={handleNavLinkClick}
        >
          <FaShoppingCart className="mr-2 text-[#33DDFF]" /> Cart
        </NavLink>
        <NavLink 
          to="/buyer/profile" 
          className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide flex items-center transition-colors duration-200"
          onClick={handleNavLinkClick}
        >
          <img
            src={profilePictureUrl}
            alt={buyerData.profilePicture ? "Profile" : "Default Profile"}
            className="w-8 h-8 rounded-full mr-2"
          />
          {buyerData.name}
        </NavLink>
        <NavLink 
          to="/buyer/orders" 
          className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
          onClick={handleNavLinkClick}
        >
          Orders
        </NavLink>
        <button 
          onClick={() => {
            handleLogoutWithClear();
            handleNavLinkClick();
          }} 
          className="text-gray-800 hover:text-[#33DDFF] block w-full text-left px-3 py-2 rounded-md text-base font-semibold tracking-wide flex items-center transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-2 text-[#33DDFF]" /> Logout
        </button>
      </MobileMenu>
    </nav>
  );
};

export default BuyerNavbar;