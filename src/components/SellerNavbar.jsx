import React, { useState, useEffect, useCallback } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes, css } from 'styled-components';

export const BASE_URL = 'https://pem-backend.onrender.com';

const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GlassMorphism = css`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const MobileMenu = styled.div`
  ${GlassMorphism}
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 100;
  transition: all 0.3s ease-in-out;
  opacity: ${props => props.isOpen ? 1 : 0};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-20px)'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
`;

const MobileMenuItem = styled.div`
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateX(-20px);
  animation: ${fadeInAnimation} 0.3s ease-out forwards;
  animation-delay: ${props => props.delay}s;
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

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const SellerNavbar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

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

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  const handleNavLinkClick = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const handleProfileClick = () => {
    navigate('/seller');
  };

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/seller" className="flex flex-col items-start">
              <span className="text-2xl md:text-3xl font-black tracking-wider font-arial" style={{ color: "#33DDFF", fontWeight: "900" }}>
                PEM
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Public E-Marketplace
              </span>
            </Link>
          </div>

          {/* Navigation links for desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/seller" end className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Profile
            </NavLink>
            <NavLink to="/seller/products" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Manage Products
            </NavLink>
            <NavLink to="/seller/add-product" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Add Product
            </NavLink>
            <NavLink to="/seller/products/:productId/reviews" className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200">
              Reviews
            </NavLink>
            <button onClick={handleLogout} className="text-gray-800 hover:text-[#33DDFF] px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors duration-200 flex items-center">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
            {profilePicUrl && <ProfilePic src={profilePicUrl} alt="Profile" onClick={handleProfileClick} />}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            {profilePicUrl && <ProfilePic src={profilePicUrl} alt="Profile" onClick={handleProfileClick} />}
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
        <MobileMenuItem delay={0.1}>
          <NavLink 
            to="/seller" 
            end
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            Profile
          </NavLink>
        </MobileMenuItem>
        <MobileMenuItem delay={0.2}>
          <NavLink 
            to="/seller/products" 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            Manage Products
          </NavLink>
        </MobileMenuItem>
        <MobileMenuItem delay={0.3}>
          <NavLink 
            to="/seller/add-product" 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            Add Product
          </NavLink>
        </MobileMenuItem>
        <MobileMenuItem delay={0.4}>
          <NavLink 
            to="/seller/products/:productId/reviews" 
            className="text-gray-800 hover:text-[#33DDFF] block px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            Reviews
          </NavLink>
        </MobileMenuItem>
        <MobileMenuItem delay={0.5}>
          <button 
            onClick={() => {
              handleLogout();
              handleNavLinkClick();
            }} 
            className="text-gray-800 hover:text-[#33DDFF] block w-full text-left px-3 py-2 rounded-md text-base font-semibold tracking-wide transition-colors duration-200"
          >
            <FaSignOutAlt className="inline mr-2" /> Logout
          </button>
        </MobileMenuItem>
      </MobileMenu>
    </nav>
  );
};

export default SellerNavbar;