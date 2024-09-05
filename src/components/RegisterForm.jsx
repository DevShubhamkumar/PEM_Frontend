import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../api';
import { FaEnvelope, FaLock, FaUserPlus, FaBuilding, FaUser, FaPhone, FaHome, FaIdCard } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap -mx-4">
          {/* Registration Form Section */}
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
                {showOtpInput ? 'Verify OTP' : 'Create an Account'}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                {showOtpInput ? 'Enter the OTP sent to your email' : 'Join our global marketplace today'}
              </p>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <form onSubmit={showOtpInput ? handleVerifyOtp : handleRegister} className="space-y-6">
                {!showOtpInput ? (
                  <>
                    <InputField
                      icon={<FaEnvelope className="h-5 w-5 text-gray-400" />}
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <InputField
                      icon={<FaLock className="h-5 w-5 text-gray-400" />}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <InputField
                      icon={<FaLock className="h-5 w-5 text-gray-400" />}
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="relative">
                      <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                        className="appearance-none rounded-lg relative block w-full px-6 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-10"
                      >
                        <option value="">Select User Type</option>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserPlus className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {userType === 'buyer' && (
                      <>
                        <InputField
                          icon={<FaUser className="h-5 w-5 text-gray-400" />}
                          type="text"
                          name="name"
                          placeholder="Name"
                          value={buyerFields.name}
                          onChange={handleBuyerFieldsChange}
                          required
                        />
                        <InputField
                          icon={<FaHome className="h-5 w-5 text-gray-400" />}
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
                        <InputField
                          icon={<FaBuilding className="h-5 w-5 text-gray-400" />}
                          type="text"
                          name="companyName"
                          placeholder="Company Name"
                          value={sellerFields.companyName}
                          onChange={handleSellerFieldsChange}
                          required
                        />
                        <InputField
                          icon={<FaIdCard className="h-5 w-5 text-gray-400" />}
                          type="text"
                          name="contactPerson"
                          placeholder="Contact Person"
                          value={sellerFields.contactPerson}
                          onChange={handleSellerFieldsChange}
                          required
                        />
                        <InputField
                          icon={<FaPhone className="h-5 w-5 text-gray-400" />}
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
                  <InputField
                    icon={<FaLock className="h-5 w-5 text-gray-400" />}
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                )}
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaUserPlus className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                  </span>
                  {showOtpInput ? 'Verify OTP' : 'Register'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Content Section */}
          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Join Our Global Marketplace</h3>
              <div className="space-y-6">
                <FeatureItem
                  icon={FaUserPlus}
                  title="Easy Registration"
                  description="Create your account in minutes and start exploring our vast marketplace."
                />
                <FeatureItem
                  icon={FaBuilding}
                  title="Buyer & Seller Accounts"
                  description="Whether you're looking to buy or sell, we have the right account type for you."
                />
                <FeatureItem
                  icon={FaLock}
                  title="Secure Verification"
                  description="Our OTP system ensures that your account is protected from unauthorized access."
                />
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Platform?</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Access to a global network of buyers and sellers</li>
                  <li>Secure and transparent transactions</li>
                  <li>Dedicated support for all users</li>
                  <li>Opportunities for business growth and expansion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
      {...props}
    />
  </div>
);

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="ml-4">
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      <p className="mt-2 text-base text-gray-500">{description}</p>
    </div>
  </div>
);

export default RegisterForms;