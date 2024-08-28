import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import { BASE_URL } from '../api';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #ffffff;
    min-height: 100vh;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Bubble = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #5cabff, #6e8efb);
  opacity: 0.7;
  animation: float 4s infinite ease-in-out;

  &:nth-child(1) {
    width: 120px;
    height: 120px;
    left: 10%;
    top: 10%;
    animation-duration: 8s;
  }

  &:nth-child(2) {
    width: 80px;
    height: 80px;
    right: 20%;
    top: 40%;
    animation-duration: 6s;
  }

  &:nth-child(3) {
    width: 60px;
    height: 60px;
    left: 30%;
    bottom: 30%;
    animation-duration: 7s;
  }

  &:nth-child(4) {
    width: 100px;
    height: 100px;
    right: 5%;
    bottom: 10%;
    animation-duration: 9s;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-20px) scale(1.05);
    }
  }
`;

const StyledLoginForm = styled.form`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  max-width: 400px;
  width: 100%;
  z-index: 1;
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
  border-radius: 25px;
  font-size: 16px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.25);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #6e8efb, #5cabff);
  color: #ffffff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #5cabff, #6e8efb);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  color: #6e8efb;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #5cabff;
    text-decoration: underline;
  }
`;


const authAxios = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAxios.post(`/api/login`, { email, password });
      if (response.data.token) {
        const { token, userType, userData } = response.data;
        const role = userType;
        const data = userData;
        onLogin(role, data, token);
        setError('');
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userType);
        localStorage.setItem('userId', userData._id);

        console.log('User data:', userData);

        if (role === 'buyer') {
          navigate('/');
          toast.success('Login successful!');
        } else if (role === 'seller') {
          navigate('/seller');
          toast.success('Login successful!');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
          toast.success('Login successful!');
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
  return (
    <LoginContainer>
      <GlobalStyle />
      <Bubble />
      <Bubble />
      <Bubble />
      <Bubble />
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
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#333' }}>
          Don't have an account? <Link to="/register" style={{ color: '#6e8efb' }}>Sign Up</Link>
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