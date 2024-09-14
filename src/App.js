import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoadingProvider, useLoading } from './components/LoadingContext';
import { AppProvider, useAppContext } from './components/AppContext';
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
import BeforeLoginNavbar from './components/BeforeLoginNavbar';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import Cart from './components/Cart';
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
import Preloader from './components/Preloader';

const App = () => {
  return (
    <AppProvider>
      <LoadingProvider>
        <Router>
          <AppContent />
        </Router>
      </LoadingProvider>
    </AppProvider>
  );
};

const AppContent = () => {
  const { isLoading } = useLoading();
  const { isAuthenticated, user, logout, authCheckComplete } = useAppContext();

  if (!authCheckComplete) {
    return <Preloader />;
  }

  const renderNavbar = () => {
    if (!isAuthenticated) {
      return <BeforeLoginNavbar />;
    }

    switch (user.role) {
      case 'buyer':
        return <BuyerNavbar isAuthenticated={isAuthenticated} buyerData={user} handleLogout={logout} />;
      case 'admin':
        return <AdminNavbar handleLogout={logout} />;
      case 'seller':
        return <SellerNavbar handleLogout={logout} sellerData={user} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderNavbar()}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterForm />} />
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
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/buyer/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole="buyer" redirectPath="/login">
              <Buyer buyerData={user} handleLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/buyer/profile" />} />
          <Route path="profile" element={<BuyerProfile buyerData={user} />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole="admin" redirectPath="/login">
              <Admin handleLogout={logout} />
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
              <Seller sellerData={user} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/seller/profile" />} />
          <Route path="profile" element={<SellerProfile sellerData={user} />} />
          <Route path="manage-products" element={<SellerManageProducts />} />
          <Route path="manage-categories" element={<ManageCategories />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;