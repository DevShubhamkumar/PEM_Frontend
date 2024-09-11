import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaBox, FaCog, FaEdit, FaSave, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useAppContext } from './AppContext';
import { BASE_URL } from '../api';

const SellerProfile = () => {
  const { user, isAuthenticated, loading, error, fetchUserProfile, updateUserProfile, fetchProducts } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [sellerProfileData, setSellerProfileData] = useState({
    name: '',
    email: '',
    businessName: '',
    contactNumber: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user, fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setSellerProfileData({
        name: user.name || '',
        email: user.email || '',
        businessName: user.sellerFields?.businessName || '',
        contactNumber: user.sellerFields?.contactNumber || '',
      });
      setImagePreview(user.profilePicture ? `${BASE_URL}/${user.profilePicture}` : '');
    }
  }, [user]);

  const handleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    if (!editMode && user) {
      setSellerProfileData({
        name: user.name || '',
        email: user.email || '',
        businessName: user.sellerFields?.businessName || '',
        contactNumber: user.sellerFields?.contactNumber || '',
      });
      setImagePreview(user.profilePicture ? `${BASE_URL}/${user.profilePicture}` : '');
    }
  }, [editMode, user]);

  const handleSellerProfileUpdate = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', sellerProfileData.name);
    formData.append('email', sellerProfileData.email);
    formData.append('businessName', sellerProfileData.businessName);
    formData.append('contactNumber', sellerProfileData.contactNumber);
    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }
    await updateUserProfile(formData);
    setEditMode(false);
  }, [sellerProfileData, profileImage, updateUserProfile]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'products' && products.length === 0) {
      fetchProducts().then(setProducts);
    }
  }, [fetchProducts, products.length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="seller-profile w-full">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome, Seller {user?.name}</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Manage your profile and oversee your products</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Seller Profile Section */}
      <section className="seller-profile-section py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Your Seller Profile</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <img
                  src={imagePreview || 'https://via.placeholder.com/200x200'}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover mx-auto"
                />
              </div>
              <div className="md:w-2/3 md:pl-8">
                {editMode ? (
                  <form onSubmit={handleSellerProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={sellerProfileData.name}
                        onChange={(e) => setSellerProfileData({ ...sellerProfileData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={sellerProfileData.email}
                        onChange={(e) => setSellerProfileData({ ...sellerProfileData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <input
                        type="text"
                        value={sellerProfileData.businessName}
                        onChange={(e) => setSellerProfileData({ ...sellerProfileData, businessName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        value={sellerProfileData.contactNumber}
                        onChange={(e) => setSellerProfileData({ ...sellerProfileData, contactNumber: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
                        <FaSave className="inline-block mr-2" /> Save
                      </button>
                      <button type="button" onClick={handleEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300">
                        <FaTimes className="inline-block mr-2" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{user?.name}</h3>
                    <p className="text-gray-600 mb-1">{user?.email}</p>
                    <p className="text-gray-600 mb-1">Business: {user?.sellerFields?.businessName}</p>
                    <p className="text-gray-600 mb-4">Contact: {user?.sellerFields?.contactNumber}</p>
                    <button onClick={handleEditMode} className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
                      <FaEdit className="inline-block mr-2" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Features */}
      <section className="seller-features py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Seller Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaUserCircle}
              title="Manage Profile"
              description="Update your seller profile information and settings"
              onClick={() => handleTabChange('profile')}
            />
            <FeatureCard
              icon={FaBox}
              title="Product Management"
              description="View and manage your product listings"
              onClick={() => handleTabChange('products')}
            />
            <FeatureCard
              icon={FaCog}
              title="Account Settings"
              description="Configure your seller account settings"
              onClick={() => handleTabChange('settings')}
            />
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="tab-content py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            {activeTab === 'profile' && 'Your Profile'}
            {activeTab === 'products' && 'Product Management'}
            {activeTab === 'settings' && 'Account Settings'}
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Profile Information</h3>
                <p className="mb-2"><strong>Name:</strong> {user?.name}</p>
                <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
                <p className="mb-2"><strong>Business Name:</strong> {user?.sellerFields?.businessName}</p>
                <p className="mb-2"><strong>Contact Number:</strong> {user?.sellerFields?.contactNumber}</p>
              </div>
            )}
            {activeTab === 'products' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Your Products</h3>
                {products.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="bg-gray-50 rounded-lg p-4 shadow">
                        <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">Price: ${product.price}</p>
                        <p className="text-sm text-gray-600 mb-1">Category: {product.category}</p>
                        <p className="text-sm text-gray-600">Description: {product.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
                    Change Password
                  </button>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
                    Notification Preferences
                  </button>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
                    Privacy Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Sales?</h2>
          <p className="text-xl mb-10">Use your seller tools to manage your products and grow your business!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/dashboard" className="bg-white text-blue-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300">
              Go to Dashboard
            </Link>
            <Link to="/help" className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300">
              Need Help?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
  <div className="bg-gray-50 rounded-lg p-6 shadow-lg text-center cursor-pointer hover:bg-gray-100 transition duration-300" onClick={onClick}>
    <Icon className="text-5xl text-blue-600 mb-4 mx-auto" />
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default SellerProfile