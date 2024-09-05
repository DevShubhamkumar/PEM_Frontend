import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from './AppContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaShieldAlt, FaGlobe, FaHandshake } from 'react-icons/fa';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });
      console.log('Login successful:', userData);

      if (userData.role === 'buyer') {
        navigate('/');
        toast.success('Login successful!');
      } else if (userData.role === 'seller') {
        navigate('/seller');
        toast.success('Login successful!');
      } else if (userData.role === 'admin') {
        navigate('/admin/dashboard');
        toast.success('Admin login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap -mx-4">
          {/* Login Form Section */}
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Welcome Back</h2>
              <p className="text-center text-gray-600 mb-8">Sign in to your account and explore our global marketplace</p>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <FaSignInAlt className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                    </span>
                    {loading ? 'Logging in...' : 'Sign in'}
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
                    to="/register"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaUserPlus className="mr-2 h-5 w-5" />
                    Create an account
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Content Section */}
          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Join Our E-Marketplace?</h3>
              <div className="space-y-6">
                <FeatureItem
                  icon={FaShieldAlt}
                  title="Secure Transactions"
                  description="Your privacy and security are our top priorities. We use state-of-the-art encryption to protect your personal and financial information."
                />
                <FeatureItem
                  icon={FaGlobe}
                  title="Global Reach"
                  description="Connect with buyers and sellers from around the world. Expand your business horizons or find unique products from different cultures."
                />
                <FeatureItem
                  icon={FaHandshake}
                  title="Trusted Community"
                  description="Join a vibrant community of verified users. Our rating system ensures transparency and builds trust among all participants."
                />
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">We're Committed to Your Success</h4>
                <p className="text-gray-600 mb-4">
                  Whether you're a buyer looking for the perfect item or a seller aiming to grow your business, our platform provides the tools and support you need to thrive in the digital marketplace.
                </p>
                <Link to="/about" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Learn more about our mission &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

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

export default LoginForm;