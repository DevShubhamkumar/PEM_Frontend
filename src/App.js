import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingProvider, useLoading } from './components/LoadingContext';
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
import { motion } from 'framer-motion';
const App = () => {
  return (
    <LoadingProvider>
      <Router>
        <AppContent />
      </Router>
    </LoadingProvider>
  );
};

const AppContent = () => {
  const { isLoading } = useLoading();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);
  const [buyerData, setBuyerData] = React.useState({});
  const [sellerData, setSellerData] = React.useState({});
  const [userToken, setUserToken] = React.useState(null);

  React.useEffect(() => {
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

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center">
        <motion.div
          className="loader"
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 270, 270, 0],
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <svg className="w-24 h-24" viewBox="0 0 24 24">
            <motion.path
              fill="none"
              strokeWidth="2"
              stroke="white"
              d="M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </svg>
        </motion.div>
        <motion.h2
          className="text-center text-white text-3xl font-bold mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Loading your amazing marketplace...
        </motion.h2>
        <motion.p
          className="w-2/3 md:w-1/3 text-center text-white mt-4 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Hold tight! We're preparing an exceptional shopping experience just for you.
        </motion.p>
      </div>
    );
  }



  return (
    <div>
      {isAuthenticated ? (
        userRole === 'buyer' ? (
          <BuyerNavbar isAuthenticated={isAuthenticated} buyerData={buyerData} handleLogout={handleLogout} />
        ) : userRole === 'admin' ? (
          <AdminNavbar handleLogout={handleLogout} />
        ) : userRole === 'seller' ? (
          <SellerNavbar handleLogout={handleLogout} sellerData={sellerData} />
        ) : null
      ) : (
        <BeforeLoginNavbar />
      )}

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

        <Route
          path="/buyer/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole="buyer" redirectPath="/login">
              <Buyer buyerData={buyerData} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/buyer/profile" />} />
          <Route path="profile" element={<BuyerProfile buyerData={buyerData} />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole="admin" redirectPath="/login">
              <Admin handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/profile" />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="user-activity" element={<AdminUserProfileActivity />} />
        </Route>

        <Route
          path="/seller/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole="seller" redirectPath="/login">
              <Seller sellerData={sellerData} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/seller/profile" />} />
          <Route path="profile" element={<SellerProfile sellerData={sellerData} />} />
          <Route path="manage-products" element={<SellerManageProducts />} />
          <Route path="manage-categories" element={<ManageCategories />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;