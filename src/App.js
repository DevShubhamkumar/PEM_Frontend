import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import Buyer from './components/Buyer';
import Seller from './components/SellerPage';
import Admin from './components/AdminPage';
import HomePage from './components/HomePage';
import BuyerNavbar from './components/BuyerNavbar';
import AdminNavbar from './components/AdminNavbar';
import SellerNavbar from './components/SellerNavbar';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import Cart from './components/Cart';
import BeforeLoginNavbar from './components/BeforeLoginNavbar';
import CategoryProductsPage from './components/CategoryProductsPage';
import AllCategoriesPage from './components/AllCategoriesPage';
import SellerManageProducts from './components/SellerManageProducts';
import ManageCategories from './components/SellerManageCategories';
import ProductView from './components/ProductView';
import ProductDetailsPage from './components/ProductDetailsPage';
import BuyerProfile from './components/BuyerProfile';
import SearchResultsPage from './components/SearchResultsPage';
import UserDetailsPage from './components/UserDetailsPage';
import PaymentGatewayPage from './components/PaymentGatewayPage';
import OrderSummaryPage from './components/OrderSummaryPage';
import OrderConfirmation from './components/OrderConfirmation';
import OrdersPage from './components/OrderPage';
import AdminUserProfileActivity from './components/AdminUserProfileActivity';
import AdminProfile from './components/AdminProfile';
import SellerProfile from './components/SellerProfile';
import ForgotPassword from './components/ForgotPassword';
import { BASE_URL } from './api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [buyerData, setBuyerData] = useState({});
  const [sellerData, setSellerData] = useState({});
  const [userToken, setUserToken] = useState(null);

  const isBuyerLoggedIn = isAuthenticated && userRole === 'buyer';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserToken(token);
    }
  }, []);

  const handleLogin = (role, data, token) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    if (role === 'buyer') {
      setBuyerData(data);
    } else if (role === 'seller') {
      setSellerData(data);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const authAxios = axios.create({
        baseURL: `${BASE_URL}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const response = await authAxios.post('/api/logout');
      if (response.status === 200) {
        setIsAuthenticated(false);
        setUserRole(null);
        setBuyerData({});
        setSellerData({});
        setUserToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Router>
      <div>
        {isAuthenticated ? (
          userRole === 'buyer' ? (
            <>
              <BuyerNavbar
                isAuthenticated={isAuthenticated}
                buyerData={buyerData}
                handleLogout={handleLogout}
              />
              <Routes>
                <Route path="/buyer/*" element={<Buyer buyerData={buyerData} handleLogout={handleLogout} />}>
                  <Route index element={<Navigate to="/buyer/profile" />} />
                  <Route path="profile" element={<BuyerProfile buyerData={buyerData} />} />
                  <Route path="orders" element={<OrdersPage />} />
                </Route>
              </Routes>
            </>
          ) : userRole === 'admin' ? (
            <>
              <AdminNavbar handleLogout={handleLogout} />
              <Routes>
                <Route path="/admin/*" element={<Admin handleLogout={handleLogout} />}>
                  <Route index element={<Navigate to="/admin/profile" />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>
              </Routes>
            </>
          ) : userRole === 'seller' ? (
            <>
              <SellerNavbar handleLogout={handleLogout} sellerData={sellerData} />
              <Routes>
                <Route path="/seller/*" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} userRole="seller" redirectPath="/login">
                    <Seller sellerData={sellerData} />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/seller/profile" />} />
                  <Route path="profile" element={<SellerProfile sellerData={sellerData} />} />
                  <Route path="manage-products" element={<SellerManageProducts />} />
                  <Route path="manage-categories" element={<ManageCategories />} />
                </Route>
              </Routes>
            </>
          ) : null
        ) : (
          <BeforeLoginNavbar />
        )}
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user-details" element={<UserDetailsPage />} />
        <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
        <Route path="/products" element={<ProductView />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/categories/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/AllCategoriesPage" element={<AllCategoriesPage />} />
        <Route path="/categories/:categoryName/products" element={<CategoryProductsPage />} />
        <Route path="/OrderSummaryPage" element={<OrderSummaryPage />} />
        <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default App;