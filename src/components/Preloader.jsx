import React from 'react';
import { FaShoppingCart, FaGlobe, FaShieldAlt, FaTruck } from 'react-icons/fa';

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 flex flex-col items-center justify-center z-50">
      <div className="text-white text-4xl font-bold mb-8 animate-pulse">
        E-Marketplace
      </div>
      <div className="flex space-x-4 mb-8">
        <Icon icon={FaShoppingCart} delay="0s" />
        <Icon icon={FaGlobe} delay="0.2s" />
        <Icon icon={FaShieldAlt} delay="0.4s" />
        <Icon icon={FaTruck} delay="0.6s" />
      </div>
      <div className="text-white text-xl">Loading amazing deals...</div>
    </div>
  );
};

const Icon = ({ icon: IconComponent, delay }) => (
  <div 
    className="text-white text-3xl animate-bounce"
    style={{ animationDelay: delay }}
  >
    <IconComponent />
  </div>
);

export default Preloader;