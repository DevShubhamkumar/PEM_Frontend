import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../context/AppContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaShieldAlt, FaGlobe, FaHandshake } from 'react-icons/fa';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, isAuthenticated, user } = useAppContext();
  const [welcomeText, setWelcomeText] = useState('Welcome to Our Global Marketplace');

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const texts = [
      'Welcome to Our Global Marketplace',
      'Discover Endless Possibilities',
      'Connect with Global Opportunities',
      'Secure Your Business Future',
      'Join Our Trusted E-Commerce Network'
    ];
    let index = 0;
    const interval = setInterval(() => {
      setWelcomeText(texts[index]);
      index = (index + 1) % texts.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'buyer':
        navigate('/');
        break;
      case 'seller':
        navigate('/seller');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });
      console.log('Login successful:', userData);
      toast.success('Login successful!');
      redirectBasedOnRole(userData.role);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login. Please try again.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full space-y-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Login Form Section */}
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
                  Access your account to leverage our powerful e-commerce platform
                </motion.p>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
                    <p>{error}</p>
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10 transition duration-300 ease-in-out shadow-sm"
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
                        <FaLock className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10 transition duration-300 ease-in-out shadow-sm"
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
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-300 ease-in-out"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-300 ease-in-out">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <FaSignInAlt className="h-5 w-5 text-indigo-300 group-hover:text-indigo-400" />
                      </span>
                      {loading ? 'Signing in...' : 'Sign in'}
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
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                    >
                      <FaUserPlus className="mr-2 h-5 w-5" />
                      Create an account
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

export default LoginForm;