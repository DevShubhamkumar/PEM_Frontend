import React, { useState } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const Container = styled.div`
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

const Form = styled.form`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  max-width: 400px;
  width: 100%;
  z-index: 1;
`;

const Title = styled.h2`
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

const Button = styled.button`
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

const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/forgot-password`, { email });
      if (response.status === 200) {
        toast.success('OTP sent to your email. Please check your inbox.');
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) return;

    try {
      const response = await axios.post('${BASE_URL}/api/reset-password', {
        email,
        resetToken: otp,
        newPassword
      });
      if (response.status === 200) {
        toast.success('Password reset successfully. You can now login with your new password.');
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <Bubble />
      <Bubble />
      <Bubble />
      <Bubble />
      <Form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
        <Title>{step === 1 ? 'Forgot Password' : 'Reset Password'}</Title>
        {step === 1 && (
          <>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
            <Button type="submit">Send OTP</Button>
          </>
        )}
        {step === 2 && (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
            <Button type="submit">Reset Password</Button>
          </>
        )}
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default ForgotPassword;