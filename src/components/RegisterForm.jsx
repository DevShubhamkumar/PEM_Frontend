import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

const RegisterContainer = styled.div`
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

const StyledRegisterForm = styled.form`
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

const Select = styled.select`
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

const RegisterForms = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [buyerFields, setBuyerFields] = useState({ name: '', address: '' });
  const [sellerFields, setSellerFields] = useState({ companyName: '', contactPerson: '', contactNumber: '' });
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      email,
      password,
      userType,
    };

    if (userType === 'buyer') {
      userData.buyerFields = buyerFields;
    } else if (userType === 'seller') {
      userData.sellerFields = sellerFields;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/pem_users/register`, userData);

      if (response.status === 201) {
        console.log('Registration initiated');
        setError('');
        toast.success('OTP sent to your email. Please verify.');
        setShowOtpInput(true);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(`An error occurred during registration: ${error.response?.data?.message || 'Unknown error'}`);
      toast.error(`An error occurred during registration: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/verify-otp`, { email, otp });
      if (response.status === 200) {
        toast.success('Email verified successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleBuyerFieldsChange = (e) => {
    setBuyerFields({ ...buyerFields, [e.target.name]: e.target.value });
  };

  const handleSellerFieldsChange = (e) => {
    setSellerFields({ ...sellerFields, [e.target.name]: e.target.value });
  };

  return (
    <RegisterContainer>
      <GlobalStyle />
      <Bubble />
      <Bubble />
      <Bubble />
      <Bubble />
      <StyledRegisterForm onSubmit={showOtpInput ? handleVerifyOtp : handleRegister}>
        <FormTitle>{showOtpInput ? 'Verify OTP' : 'Register'}</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {!showOtpInput ? (
          <>
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
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Select value={userType} onChange={(e) => setUserType(e.target.value)} required>
              <option value="">Select User Type</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </Select>
            {userType === 'buyer' && (
              <>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={buyerFields.name}
                  onChange={handleBuyerFieldsChange}
                  required
                />
                <Input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={buyerFields.address}
                  onChange={handleBuyerFieldsChange}
                  required
                />
              </>
            )}
            {userType === 'seller' && (
              <>
                <Input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={sellerFields.companyName}
                  onChange={handleSellerFieldsChange}
                  required
                />
                <Input
                  type="text"
                  name="contactPerson"
                  placeholder="Contact Person"
                  value={sellerFields.contactPerson}
                  onChange={handleSellerFieldsChange}
                  required
                />
                <Input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={sellerFields.contactNumber}
                  onChange={handleSellerFieldsChange}
                  required
                />
              </>
            )}
          </>
        ) : (
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}
        <SubmitButton type="submit">{showOtpInput ? 'Verify OTP' : 'Register'}</SubmitButton>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#333' }}>
          Already have an account? <Link to="/login" style={{ color: '#6e8efb' }}>Login</Link>
        </p>
      </StyledRegisterForm>
      <ToastContainer />
    </RegisterContainer>
  );
};

export default RegisterForms;