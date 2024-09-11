import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaShoppingBag, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../api';

const BuyerProfile = () => {
  const [buyer, setBuyer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    address: '',
    contactNumber: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        const profileResponse = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse && profileResponse.data) {
          setBuyer(profileResponse.data);
          setProfileData({
            name: profileResponse.data.buyerFields?.name || '',
            email: profileResponse.data.email || '',
            address: profileResponse.data.buyerFields?.address || '',
            contactNumber: profileResponse.data.buyerFields?.contactNumber || '',
          });
          setImagePreview(profileResponse.data.profilePicture ? `${BASE_URL}/${profileResponse.data.profilePicture}` : null);
        } else {
          throw new Error('Profile response is missing data');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    if (!editMode && buyer && buyer.buyerFields) {
      setProfileData({
        name: buyer.buyerFields.name || '',
        email: buyer.email || '',
        address: buyer.buyerFields.address || '',
        contactNumber: buyer.buyerFields.contactNumber || '',
      });
      const profilePictureUrl = buyer.profilePicture
        ? buyer.profilePicture.startsWith('http')
          ? buyer.profilePicture
          : `${BASE_URL}/${buyer.profilePicture}`
        : '';
      setImagePreview(profilePictureUrl);
    }
  }, [editMode, buyer]);

  const handleProfileImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('address', profileData.address);
    formData.append('contactNumber', profileData.contactNumber);
    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/users/${userId}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setBuyer(response.data);
      setEditMode(false);
      setProfileImage(null);
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="buyer-profile w-full">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome, {buyer?.buyerFields?.name}</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Manage your profile and view your orders</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Buyer Profile Section */}
      <section className="buyer-profile-section py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Your Buyer Profile</h2>
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
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                      <input type="file" accept="image/*" onChange={handleProfileImageChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        value={profileData.contactNumber}
                        onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
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
                    <h3 className="text-2xl font-semibold mb-2">{buyer?.buyerFields?.name}</h3>
                    <p className="text-gray-600 mb-4">{buyer?.email}</p>
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

      {/* Buyer Features */}
      <section className="buyer-features py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Buyer Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaUserCircle}
              title="Manage Profile"
              description="Update your buyer profile information and settings"
              onClick={() => handleTabChange('profile')}
            />
            <FeatureCard
              icon={FaShoppingBag}
              title="View Orders"
              description="Check your order history and track current orders"
              onClick={() => handleTabChange('orders')}
            />
            <FeatureCard
              icon={FaMapMarkerAlt}
              title="Manage Addresses"
              description="Add, edit, or remove your delivery addresses"
              onClick={() => handleTabChange('addresses')}
            />
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="tab-content py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            {activeTab === 'profile' && 'Your Profile'}
            {activeTab === 'orders' && 'Your Orders'}
            {activeTab === 'addresses' && 'Your Addresses'}
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Profile Information</h3>
                <p className="mb-2"><strong>Name:</strong> {buyer?.buyerFields?.name}</p>
                <p className="mb-2"><strong>Email:</strong> {buyer?.email}</p>
                <p className="mb-2"><strong>Address:</strong> {buyer?.buyerFields?.address}</p>
                <p className="mb-2"><strong>Contact Number:</strong> {buyer?.buyerFields?.contactNumber}</p>
              </div>
            )}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Your Orders</h3>
                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-gray-50 rounded-lg p-4 shadow">
                        <h4 className="text-lg font-semibold mb-2">Order #{order._id}</h4>
                        <p className="text-sm text-gray-600 mb-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Total: ${order.totalAmount}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'addresses' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Your Addresses</h3>
                {addresses.length === 0 ? (
                  <p>No addresses found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((address) => (
                      <div key={address._id} className="bg-gray-50 rounded-lg p-4 shadow">
                        <h4 className="text-lg font-semibold mb-2">{address.fullName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                        <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pinCode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
 {/* Call to Action */}
 <section className="cta bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-xl mb-10">Explore our amazing products and find great deals!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/products" className="bg-white text-blue-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300">
              Browse Products
            </Link>
            <Link to="/cart" className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300">
              View Cart
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

export default BuyerProfile;