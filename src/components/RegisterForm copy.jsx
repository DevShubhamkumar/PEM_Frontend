//Login REgisterForm
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Footer from './Footer';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const RegisterForm1 = styled.form`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: 24px;
  color: #333333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border:1px solid #dddddd;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  font-size: 16px;
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
  color: red;
  margin-bottom: 10px;
`;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [buyerFields, setBuyerFields] = useState({ name: '', address: '' });
  const [sellerFields, setSellerFields] = useState({ companyName: '', contactPerson: '', contactNumber: '' });
  const [error, setError] = useState('');

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
      const response = await axios.post('http://localhost:5002/api/pem_users/register', userData);

      if (response.status === 201) {
        console.log('Registration successful');
        setError(''); // Clear the error message
        toast.success('Registration successful!'); 
        navigate('/login');
      } else {
        setError(response.data.message);
        toast.error(response.data.message); 
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(`An error occurred during registration: ${error.response?.data?.message || 'Unknown error'}`);
      toast.error(`An error occurred during registration: ${error.response?.data?.message || 'Unknown error'}`); // Show an error toast
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
      <Toaster /> {/* Add the Toaster component */}
      <RegisterForm1 onSubmit={handleRegister}>
        <FormTitle>Register</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
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
        <SubmitButton type="submit">Register</SubmitButton>
      </RegisterForm1>
    </RegisterContainer>
  );
};

export default RegisterForm;