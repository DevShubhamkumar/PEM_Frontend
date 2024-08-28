import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminProfile from './AdminProfile';
import SellerProfileControl from './SellerProfileControl';
import UserProfileControl from './AdminUserProfileControl';
import AdminUserProfileActivity from './AdminUserProfileActivity';
import SellerActivityView from './SellerActivityView';
import AdminManageProducts from './AdminManageProducts';
import SellerProducts from './SellerManageProducts';
import AdminManageOrdersPage from "./AdminManageOrdersPage";
import AdminReportsPage from "./AdminReportsPage";
import Footer from './Footer';
import { BASE_URL } from '../api';

const AdminPage = ({ handleLogout }) => {
  return (
    <div className="admin-page">
      <Routes>
        <Route path="/dashboard" element={<AdminProfile />} />
        <Route path="manage-sellers" element={<SellerProfileControl />} />
        <Route path="manage-users" element={<UserProfileControl />} />
        {/* <Route path="user-activity/:userType/:userId" element={<AdminUserProfileActivity />} /> */}
        <Route path="user-activity/:userType/:userId" element={<AdminUserProfileActivity />} />
        <Route path="manage-products" element={<AdminManageProducts />}>
          <Route path="seller/:sellerId" element={<SellerProducts />} />
        </Route>
        <Route path="manage-orders" element={<AdminManageOrdersPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AdminPage;