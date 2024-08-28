import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = {
  colors: {
    primary: '#4a90e2',
    secondary: '#f5a623',
    background: '#f0f4f8',
    text: '#333',
    error: '#e74c3c',
    white: '#ffffff',
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    background-image: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.white} 100%);
  }
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StyledLink = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  background-color: ${({ theme }) => theme.colors.error}15;
  padding: 0.5rem;
  border-radius: 4px;
`;

const LoginForm = () => {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement login logic here
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Implement forgot password logic here
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Implement reset password logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageContainer>
        <FormContainer>
          {view === 'login' && (
            <StyledForm onSubmit={handleLogin}>
              <FormTitle>Welcome Back</FormTitle>
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
              <StyledLink onClick={() => setView('forgotPassword')} style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}>
                Forgot Password?
              </StyledLink>
              <SubmitButton type="submit">Log In</SubmitButton>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: theme.fontSizes.small }}>
                Don't have an account? <Link to="/register" style={{ color: theme.colors.primary, textDecoration: 'none' }}>Sign Up</Link>
              </p>
            </StyledForm>
          )}
          
          {view === 'forgotPassword' && (
            <StyledForm onSubmit={handleForgotPassword}>
              <FormTitle>Forgot Password</FormTitle>
              <Input
                type="email"
                placeholder="Enter your email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
              <SubmitButton type="submit">Send Reset Code</SubmitButton>
              <StyledLink onClick={() => setView('login')} style={{ alignSelf: 'center', marginTop: '1rem' }}>
                Back to Login
              </StyledLink>
            </StyledForm>
          )}
          
          {view === 'resetPassword' && (
            <StyledForm onSubmit={handleResetPassword}>
              <FormTitle>Reset Password</FormTitle>
              <Input
                type="text"
                placeholder="Enter reset code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <SubmitButton type="submit">Reset Password</SubmitButton>
              <StyledLink onClick={() => setView('login')} style={{ alignSelf: 'center', marginTop: '1rem' }}>
                Back to Login
              </StyledLink>
            </StyledForm>
          )}
        </FormContainer>
        <ToastContainer />
      </PageContainer>
    </ThemeProvider>
  );
};

export default LoginForm;