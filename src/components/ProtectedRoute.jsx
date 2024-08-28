import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { BASE_URL } from '../api';

const ProtectedRoute = ({ isAuthenticated, userRole, redirectPath, children }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (userRole !== null && isAuthenticated) {
    return children;
  }

  return null;
};

export default ProtectedRoute;