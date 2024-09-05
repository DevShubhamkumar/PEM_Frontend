import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FaSearch, FaShoppingCart, FaTimes, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import styled, { keyframes } from 'styled-components';

import { BASE_URL } from "../api";
import { useAppContext } from "./AppContext";

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

const BeforeLoginNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [cartClicked, setCartClicked] = useState(false);
  const categoryDropdownRef = useRef(null);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const timeoutRef = useRef(null);

  const { fetchCategories } = useAppContext();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    fetchCategories().then(setCategories).catch(console.error);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCategoryMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowCategoriesDropdown(true);
  }, []);

  const handleCategoryMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowCategoriesDropdown(false);
    }, 300);
  }, []);

  const handleDropdownMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
  
    let categories = [];
    let products = [];
    let hasError = false;
  
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/api/categories/search?q=${searchTerm}`);
      categories = categoriesResponse.data;
    } catch (error) {
      console.error("Error searching categories:", error);
      toast.error("An error occurred while searching categories");
      hasError = true;
    }
  
    try {
      const productsResponse = await axios.get(`${BASE_URL}/api/search?q=${searchTerm}`);
      products = productsResponse.data;
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("An error occurred while searching products");
      hasError = true;
    }
  
    const searchResults = { categories, products };
    console.log("Search results:", searchResults);
  
    if (categories.length === 0 && products.length === 0 && !hasError) {
      toast.error(`No matching results found for "${searchTerm}"`);
    } else if (categories.length > 0 || products.length > 0) {
      navigate("/search-results", { 
        state: { searchResults, searchTerm } 
      });
    }
  
    setIsOpen(false);
  }, [searchTerm, navigate]);
  
  const handleSearchInputChange = useCallback(async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/categories/search?q=${value}`
        );
        setSearchSuggestions(response.data.slice(0, 5));

        if (response.data.length === 0 && value.length === 1) {
          setSearchSuggestions([
            { _id: "no-result", name: `No matching results for "${value}"` },
          ]);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      }
    } else {
      setSearchSuggestions([]);
    }
  }, []);

  const handleSuggestionClick = useCallback((suggestion) => {
    if (suggestion._id === "no-result") return;
    setSearchTerm(suggestion.name);
    setSearchSuggestions([]);
    handleSearch({ preventDefault: () => {} });
  }, [handleSearch]);

  const handleCartClick = useCallback((e) => {
    e.preventDefault();
    setCartClicked(true);
    toast.error("Please log in to view your cart");
    setTimeout(() => setCartClicked(false), 1000);
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

  const memoizedCategories = useMemo(() => categories, [categories]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400">
                <input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search for products..."
                  className="w-full py-2 px-4 bg-transparent text-gray-700 leading-tight focus:outline-none"
                />
                <button type="submit" className="p-2 text-[#33DDFF] focus:outline-none transition-colors duration-200">
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
              {searchSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg">
                  {searchSuggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>

          {/* Navigation links for desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div 
              className="relative group"
              ref={categoryDropdownRef}
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <NavLink to="/AllCategoriesPage" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
                Categories
              </NavLink>
              {showCategoriesDropdown && (
                <ul 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  {memoizedCategories.map((category) => (
                    <li key={category._id}>
                      <button
                        onClick={() => handleCategoryClick(category._id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <NavLink to="/about" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              About
            </NavLink>
            <NavLink to="/contact" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Contact
            </NavLink>
            <ShakeableNavLink to="/cart" shake={cartClicked} onClick={handleCartClick} className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center">
              <FaShoppingCart className="mr-1 text-[#33DDFF]" /> Cart
            </ShakeableNavLink>
            <NavLink to="/login" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center">
              <FaUser className="mr-1 text-[#33DDFF]" /> Login
            </NavLink>
            <NavLink to="/register" className="bg-[#33DDFF] text-white hover:bg-[#00BBDD] px-4 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Sign Up
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#33DDFF]"
            >
              {isOpen ? (
                <FaTimes className="block h-6 w-6 text-[#33DDFF]" />
              ) : (
                <GiHamburgerMenu className="block h-6 w-6 text-[#33DDFF]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu and search */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* Mobile search bar */}
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400">
                <input
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search for products..."
                  className="w-full py-2 px-4 bg-transparent text-gray-700 leading-tight focus:outline-none"
                />
                <button type="submit" className="p-2 text-[#33DDFF] focus:outline-none transition-colors duration-200">
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
              {searchSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg">
                  {searchSuggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>

          {/* Mobile menu items */}
          <NavLink 
            to="/AllCategoriesPage" 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide"
            onClick={handleNavLinkClick}
          >
            Categories
          </NavLink>
          {memoizedCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => {
                handleCategoryClick(category._id);
                handleNavLinkClick();
              }}
              className="text-gray-600 hover:text-[#33DDFF] block w-full text-left px-3 py-2 rounded-md text-sm font-medium tracking-wide ml-4"
            >
             {category.name}
            </button>
          ))}
          <NavLink 
            to="/about" 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide"
            onClick={handleNavLinkClick}
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide"
            onClick={handleNavLinkClick}
          >
            Contact
          </NavLink>
          <ShakeableNavLink 
            to="/cart" 
            shake={cartClicked} 
            onClick={(e) => {
              handleCartClick(e);
              handleNavLinkClick();
            }} 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide flex items-center"
          >
            <FaShoppingCart className="mr-2 text-[#33DDFF]" /> Cart
          </ShakeableNavLink>
          <NavLink 
            to="/login" 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide flex items-center"
            onClick={handleNavLinkClick}
          >
            <FaUser className="mr-2 text-[#33DDFF]" /> Login
          </NavLink>
          <NavLink 
            to="/register" 
            className="bg-[#33DDFF] text-white hover:bg-[#00BBDD] block px-3 py-2 rounded-md text-base font-semibold tracking-wide text-center transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default BeforeLoginNavbar;