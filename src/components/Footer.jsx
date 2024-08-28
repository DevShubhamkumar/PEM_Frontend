import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { BASE_URL } from '../api';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: #f0f0f0;
  padding: 60px 0 20px;
  font-family: 'Arial', sans-serif;
  margin-top: 40px;
`;

const FooterWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  padding: 0 20px;
`;

const FooterColumn = styled.div`
  h4 {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #3498db;
    display: inline-block;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 12px;
  }

  a {
    color: #b3b3b3;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 14px;

    &:hover {
      color: #3498db;
    }
  }
`;

const SocialIcons = styled.div`
  margin-top: 20px;

  a {
    color: #b3b3b3;
    font-size: 20px;
    margin-right: 15px;
    transition: color 0.3s ease;

    &:hover {
      color: #3498db;
    }
  }
`;

const ContactInfo = styled.div`
  margin-top: 20px;

  p {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;

    svg {
      margin-right: 10px;
      color: #3498db;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #333;
  color: #777;
  font-size: 12px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterColumn>
          <h4>About PEM</h4>
          <p>PEM is a leading e-marketplace platform connecting buyers and sellers. We strive to provide a seamless and transparent procurement experience.</p>
        </FooterColumn>
        <FooterColumn>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/AllCategoriesPage">Categories</Link></li>
            <li><Link to="/whats-new">What's New</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/deals">Deals</Link></li>
          </ul>
        </FooterColumn>
        <FooterColumn>
          <h4>User Actions</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
          </ul>
        </FooterColumn>
        <FooterColumn>
          <h4>Connect with Us</h4>
          <SocialIcons>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
          </SocialIcons>
          <ContactInfo>
            <p><FontAwesomeIcon icon={faEnvelope} /> contact@pem.com</p>
            <p><FontAwesomeIcon icon={faPhone} /> +91 86383----</p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Jammu, India</p>
          </ContactInfo>
        </FooterColumn>
      </FooterWrapper>
      <Copyright>
        <p>&copy; {new Date().getFullYear()} PEM. All rights reserved.</p>
        <p>Developed by Shubham Kumar (USN: 221VMTR01071)</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;