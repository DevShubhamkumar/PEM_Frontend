// src/Login/UnauthorizedPage.js
import React from 'react';
import Footer from './Footer';
import { BASE_URL } from '../api';

const UnauthorizedPage = () => {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You are not authorized to access this page.</p>
    </div>
  );
};

export default UnauthorizedPage;