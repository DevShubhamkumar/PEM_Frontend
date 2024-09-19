import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaBox, FaCog, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../api';

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    businessName: '',
    contactNumber: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
          throw new Error('User ID or token not found');
        }
    
        const [profileResponse, productsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/sellers/${userId}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/seller/data`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
    
        const profileData = profileResponse.data || {};
        const productsData = productsResponse.data || {};
    
        setSeller(profileData);
        setProfileData({
          name: profileData.sellerFields?.name || '',
          email: profileData.email || '',
          businessName: profileData.sellerFields?.businessName || '',
          contactNumber: profileData.sellerFields?.contactNumber || '',
        });
    
        // Use the profilePicture URL directly from the backend
        setImagePreview(profileData.profilePicture || '');
        setProducts(productsData.products || []);
    
        setLoading(false);
      } catch (error) {
        setError(error.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    if (!editMode && seller) {
      setProfileData({
        name: seller.sellerFields?.name || '',
        email: seller.email || '',
        businessName: seller.sellerFields?.businessName || '',
        contactNumber: seller.sellerFields?.contactNumber || '',
      });
      setImagePreview(seller.profilePicture || '');
    }
    setError(null);
    setSuccessMessage('');
  }, [editMode, seller]);

  const handleProfileUpdate = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('businessName', profileData.businessName);
    formData.append('contactNumber', profileData.contactNumber);
    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }

    try {
      const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const response = await axios.put(
      `${BASE_URL}/api/sellers/${userId}/profile`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedProfile = response.data;
    console.log('updatedProfile', updatedProfile);

    setSeller(updatedProfile);
    setProfileData({
      name: updatedProfile.sellerFields?.name || '',
      email: updatedProfile.email || '',
      businessName: updatedProfile.sellerFields?.businessName || '',
      contactNumber: updatedProfile.sellerFields?.contactNumber || '',
    });
    // Use the profilePicture URL directly from the updated profile
    setImagePreview(updatedProfile.profilePicture || '');
    setSuccessMessage('Profile updated successfully');
    setEditMode(false);
  } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || 'An error occurred while updating the profile');
    } finally {
      setLoading(false);
    }
  }, [profileData, profileImage]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="seller-profile w-full">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome, {seller?.sellerFields?.name}</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Manage your seller profile and products</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Seller Profile Section */}
      <section className="seller-profile-section py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Your Seller Profile</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {loading && <div className="text-center text-gray-600">Updating profile...</div>}
            {error && <div className="text-center text-red-600 mb-4">{error}</div>}
            {successMessage && <div className="text-center text-green-600 mb-4">{successMessage}</div>}
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <img
                  src={imagePreview || 'https://via.placeholder.com/200x200'}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x200';
                  }}
                />
              </div>
              <div className="md:w-2/3 md:pl-8">
                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <input
                        type="text"
                        value={profileData.businessName}
                        onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        value={profileData.contactNumber}
                        onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300" disabled={loading}>
                        <FaSave className="inline-block mr-2" /> Save
                      </button>
                      <button type="button" onClick={handleEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300" disabled={loading}>
                        <FaTimes className="inline-block mr-2" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{seller?.sellerFields?.name}</h3>
                    <p className="text-gray-600 mb-1">{seller?.email}</p>
                    <p className="text-gray-600 mb-1">Business: {seller?.sellerFields?.businessName}</p>
                    <p className="text-gray-600 mb-4">Contact: {seller?.sellerFields?.contactNumber}</p>
                    <button onClick={handleEditMode} className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
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
              description="View and manage your products on the platform"
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
                <p className="mb-2"><strong>Name:</strong> {seller?.sellerFields?.name}</p>
                <p className="mb-2"><strong>Email:</strong> {seller?.email}</p>
                <p className="mb-2"><strong>Business Name:</strong> {seller?.sellerFields?.businessName}</p>
                <p className="mb-2"><strong>Contact Number:</strong> {seller?.sellerFields?.contactNumber}</p>
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
                        <p className="text-sm text-gray-600">{product.description}</p>
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
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                    Change Password
                  </button>
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                    Notification Preferences
                  </button>
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                    Privacy Settings
                  </button>
                  <button className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                    Payment Methods
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Sales?</h2>
          <p className="text-xl mb-10">Use our tools to improve your seller experience and reach more customers!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/dashboard" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300">
              Go to Dashboard
            </Link>
            <Link to="/add-product" className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition duration-300">
              Add New Product
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
  <div className="bg-gray-50 rounded-lg p-6 shadow-lg text-center cursor-pointer hover:bg-gray-100 transition duration-300" onClick={onClick}>
    <Icon className="text-5xl text-indigo-600 mb-4 mx-auto" />
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default SellerProfile;