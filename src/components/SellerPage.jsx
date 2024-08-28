import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SellerProfile from './SellerProfile';
import ManageProducts from './SellerManageProducts';
import AddProduct from './AddProduct';
import ReviewPage from './SellerReviewsPage';
import SellerNavbar from '../components/SellerNavbar';
import ManageCategories from './SellerManageCategories';
import Footer from './Footer';
import { BASE_URL } from '../api';

const Seller = ({ handleLogout, sellerData }) => {
  return (
    <div className="seller-page">
      {/* <SellerNavbar handleLogout={handleLogout} sellerData={sellerData} /> */}
      <Routes>
        <Route path="/" element={<SellerProfile />} />
        <Route path="/products" element={<ManageProducts />} />
        <Route path="/add-product" element={<AddProduct />} />
        {/* <Route path="/reviews/:productId" element={<ReviewPage />} /> */}
        <Route path="/products/:productId/reviews" element={<ReviewPage />} />
        <Route path="/manage-categories" element={<ManageCategories />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Seller;