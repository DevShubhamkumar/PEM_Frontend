import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #f0f0f0;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoginForm = styled.form`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: 24px;
  color: #333333;
  font-family: 'Montserrat', sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f5f5f5;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  margin-bottom: 10px;
  font-weight: bold;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;
  &:hover {
    text-decoration: underline;
  }
`;
const authAxios = axios.create({
  baseURL: 'http://localhost:5002',
  headers: {
    'Content-Type': 'application/json',
  },
});

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAxios.get('/api/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.valid) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAxios.post('/api/login', { email, password });
      if (response.data.token) {
        const { token, userType, userData } = response.data;
        onLogin(userType, userData, token);
        setError('');
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userType);
        localStorage.setItem('userId', userData._id);

        setIsAuthenticated(true);
        toast.success('Login successful!');

        if (userType === 'buyer') {
          navigate('/', { replace: true });
        } else if (userType === 'seller') {
          navigate('/seller', { replace: true });
        } else if (userType === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        }
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      setError(`Login error: ${error.response?.data?.message || 'Network Error'}`);
      toast.error(`Login error: ${error.response?.data?.message || 'Network Error'}`);
      console.error('Login error:', error);
    }
  };

  if (isAuthenticated) {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'buyer') return <Navigate to="/" replace />;
    if (userRole === 'seller') return <Navigate to="/seller" replace />;
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <LoginContainer>
    <GlobalStyle />
    <StyledLoginForm onSubmit={handleLogin}>
        <FormTitle>Login</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ForgotPasswordLink to="/forgot-password">Forgot Password?</ForgotPasswordLink>
        <SubmitButton type="submit">Login</SubmitButton>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#007bff' }}>Sign Up</Link>
        </p>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </StyledLoginForm>
    </LoginContainer>
  );
};

export default LoginForm;