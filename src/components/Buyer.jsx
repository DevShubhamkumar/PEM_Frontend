import React from 'react';
import { Outlet } from 'react-router-dom';
import BuyerNavbar from './BuyerNavbar';
import Footer from './Footer';
import './Buyer.css';

const Buyer = ({ isAuthenticated, buyerData, handleLogout }) => {
  return (
    <div className="buyer-app">
      <Outlet />
      <Footer />
    </div>
  );
};

export default Buyer;