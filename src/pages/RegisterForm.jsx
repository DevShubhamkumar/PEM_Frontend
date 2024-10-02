import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../api';
import { FaEnvelope, FaLock, FaUserPlus, FaBuilding, FaUser, FaPhone, FaHome, FaIdCard, FaSignInAlt, FaShieldAlt, FaGlobe, FaHandshake } from 'react-icons/fa';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [loading, setLoading] = useState(false);
  const [welcomeText, setWelcomeText] = useState('Join Our Global Marketplace');

  useEffect(() => {
    const texts = [
      'Join Our Global Marketplace',
      'Start Your E-Commerce Journey',
      'Connect with Global Opportunities',
      'Secure Your Business Future',
      'Become Part of Our Trusted Network'
    ];
    let index = 0;
    const interval = setInterval(() => {
      setWelcomeText(texts[index]);
      index = (index + 1) % texts.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const userData = {
      email,
      password,
      userType,
      ...(userType === 'buyer' ? { buyerFields } : {}),
      ...(userType === 'seller' ? { sellerFields } : {}),
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/pem_users/register`, userData);

      if (response.status === 201) {
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
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/verify-otp`, { email, otp });
      if (response.status === 200) {
        toast.success('Email verified successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerFieldsChange = (e) => {
    setBuyerFields({ ...buyerFields, [e.target.name]: e.target.value });
  };

  const handleSellerFieldsChange = (e) => {
    setSellerFields({ ...sellerFields, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full space-y-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Registration Form Section */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={welcomeText}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6 text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}
                  >
                    {welcomeText}
                  </motion.h2>
                </AnimatePresence>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-gray-600 mb-8"
                >
                  Create your account to access our powerful e-commerce platform
                </motion.p>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
                    <p>{error}</p>
                  </div>
                )}
                <form className="space-y-6" onSubmit={showOtpInput ? handleVerifyOtp : handleRegister}>
                  {!showOtpInput ? (
                    <>
                      <InputField
                        icon={FaEnvelope}
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <InputField
                        icon={FaLock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <InputField
                        icon={FaLock}
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
                          className="appearance-none rounded-lg relative block w-full px-9 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10 transition duration-300 ease-in-out shadow-sm"
                        >
                          <option value="">Select User Type</option>
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserPlus className="h-5 w-5 text-indigo-500" />
                        </div>
                      </div>
                      {userType === 'buyer' && (
                        <>
                          <InputField
                            icon={FaUser}
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={buyerFields.name}
                            onChange={handleBuyerFieldsChange}
                            required
                          />
                          <InputField
                            icon={FaHome}
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
                            icon={FaBuilding}
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            value={sellerFields.companyName}
                            onChange={handleSellerFieldsChange}
                            required
                          />
                          <InputField
                            icon={FaIdCard}
                            type="text"
                            name="contactPerson"
                            placeholder="Contact Person"
                            value={sellerFields.contactPerson}
                            onChange={handleSellerFieldsChange}
                            required
                          />
                          <InputField
                            icon={FaPhone}
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
                      icon={FaLock}
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  )}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <FaUserPlus className="h-5 w-5 text-indigo-300 group-hover:text-indigo-400" />
                      </span>
                      {loading ? 'Processing...' : (showOtpInput ? 'Verify OTP' : 'Register')}
                    </button>
                  </div>
                </form>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      to="/login"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                    >
                      <FaSignInAlt className="mr-2 h-5 w-5" />
                      Sign in to your account
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Content Section */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
                  style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}
                >
                  Empowering Your E-Commerce Journey
                </motion.h3>
                <div className="space-y-6">
                  <FeatureItem
                    icon={FaShieldAlt}
                    title="Advanced Security Measures"
                    description="Benefit from our cutting-edge encryption and fraud prevention systems, ensuring your transactions and data remain protected."
                  />
                  <FeatureItem
                    icon={FaGlobe}
                    title="Expansive Global Network"
                    description="Tap into a vast international market, connecting with verified buyers and sellers across continents to maximize your business potential."
                  />
                  <FeatureItem
                    icon={FaHandshake}
                    title="Trusted Business Ecosystem"
                    description="Join our curated community of professionals. Our comprehensive vetting process and feedback system foster a reliable trading environment."
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-8"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Dedicated to Your Success</h4>
                  <p className="text-gray-600 mb-4">
                    Whether you're expanding your enterprise or sourcing premium products, our platform offers the advanced tools and expert support necessary to excel in today's competitive digital marketplace.
                  </p>
                  <Link to="/about" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-300 ease-in-out">
                    Explore our commitment to excellence &rarr;
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-indigo-500" />
    </div>
    <input
      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10 transition duration-300 ease-in-out shadow-sm"
      {...props}
    />
  </div>
);

const FeatureItem = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-start"
  >
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="ml-4">
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      <p className="mt-2 text-base text-gray-600">{description}</p>
    </div>
  </motion.div>
);

export default RegisterForms;