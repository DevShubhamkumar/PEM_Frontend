import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import styled from 'styled-components';
import { FaUserCircle, FaShoppingBag, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../api';
import './Buyer.css'

// Styled components
const BuyerProfileContainer = styled.div`
  width: 100%;
`;

const HeroSection = styled.section`
  position: relative;
  background: linear-gradient(to right, #8e2de2, #4a00e0);
  color: white;
  padding: 8rem 0;
`;

const WaveBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0; 
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);

  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 70px;
  }

  .shape-fill {
    fill: #f3f4f6;
  }
`;

const ProfileSection = styled.section`
  background-color: #f3f4f6;
  padding: 5rem 0;
`;

const FeaturesSection = styled.section`
  background-color: white;
  padding: 5rem 0;
`;

const TabContentSection = styled.section`
  background-color: #f3f4f6;
  padding: 5rem 0;
`;

const CTASection = styled.section`
  background: linear-gradient(to right, #8e2de2, #4a00e0);
  color: white;
  padding: 5rem 0;
`;

// API functions
const fetchUserData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token not found');
  }
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userId = decodedToken.userId;

  const response = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userId = decodedToken.userId;

  const response = await axios.put(
    `${BASE_URL}/api/buyers/${userId}/profile`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

const BuyerProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    address: '',
    contactNumber: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const queryClient = useQueryClient();

  const { data: buyer, isLoading, isError, error } = useQuery('buyerProfile', fetchUserData, {
    onSuccess: (data) => {
      setProfileData({
        name: data.buyerFields?.name || '',
        email: data.email || '',
        address: data.buyerFields?.address || '',
        contactNumber: data.buyerFields?.contactNumber || '',
      });
      setImagePreview(data.profilePicture || 'https://via.placeholder.com/200x200');
    },
  });

  const updateProfileMutation = useMutation(updateUserProfile, {
    onSuccess: (data) => {
      queryClient.setQueryData('buyerProfile', data.user);
      setEditMode(false);
      setProfileImage(null);
    },
  });

  const handleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    if (!editMode && buyer) {
      setProfileData({
        name: buyer.buyerFields?.name || '',
        email: buyer.email || '',
        address: buyer.buyerFields?.address || '',
        contactNumber: buyer.buyerFields?.contactNumber || '',
      });
      setImagePreview(buyer.profilePicture || '');
    }
  }, [editMode, buyer]);

  const handleProfileImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleProfileSave = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('address', profileData.address);
    formData.append('contactNumber', profileData.contactNumber);
    
    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }

    updateProfileMutation.mutate(formData);
  }, [profileData, profileImage, updateProfileMutation]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <BuyerProfileContainer>
      {/* Hero Section */}
      <HeroSection>
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome, {buyer?.buyerFields?.name}</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Manage your profile and view your orders</p>
        </div>
        <WaveBottom>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </WaveBottom>
      </HeroSection>

      {/* Profile Section */}
      <ProfileSection>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Your Buyer Profile</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {updateProfileMutation.isLoading && <div className="text-center text-gray-600">Updating profile...</div>}
            {updateProfileMutation.isError && <div className="text-center text-red-600 mb-4">{updateProfileMutation.error.message}</div>}
            {updateProfileMutation.isSuccess && <div className="text-center text-green-600 mb-4">Profile updated successfully</div>}
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
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
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
                      <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300" disabled={updateProfileMutation.isLoading}>
                        <FaSave className="inline-block mr-2" /> Save
                      </button>
                      <button type="button" onClick={handleEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300" disabled={updateProfileMutation.isLoading}>
                        <FaTimes className="inline-block mr-2" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{buyer?.buyerFields?.name}</h3>
                    <p className="text-gray-600 mb-4">{buyer?.email}</p>
                    <button onClick={handleEditMode} className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                      <FaEdit className="inline-block mr-2" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ProfileSection>

      {/* Features Section */}
      <FeaturesSection>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Buyer Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaUserCircle}
              title="Manage Profile"
              description="Update your personal information and settings"
              onClick={() => handleTabChange('profile')}
            />
            <FeatureCard
              icon={FaShoppingBag}
              title="View Orders"
              description="Check your order history and status"
              onClick={() => handleTabChange('orders')}
            />
            <FeatureCard
              icon={FaMapMarkerAlt}
              title="Manage Addresses"
              description="Add or edit your delivery addresses"
              onClick={() => handleTabChange('addresses')}
            />
          </div>
        </div>
      </FeaturesSection>

      {/* Tab Content Section */}
      <TabContentSection>
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
                <p>Order history functionality to be implemented.</p>
              </div>
            )}
            {activeTab === 'addresses' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Your Addresses</h3>
                <p>Address management functionality to be implemented.</p>
                <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                  Add New Address
                </button>
              </div>
            )}
          </div>
        </div>
      </TabContentSection>

      {/* Call to Action Section */}
      <CTASection>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl mb-10">Explore our wide range of products and find great deals!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/products" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300">
              Browse Products
            </Link>
            <Link to="/cart" className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition duration-300">
              View Cart
            </Link>
          </div>
        </div>
      </CTASection>
    </BuyerProfileContainer>
  );
};

// FeatureCard component
const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
  <div className="bg-gray-50 rounded-lg p-6 shadow-lg text-center cursor-pointer hover:bg-gray-100 transition duration-300" onClick={onClick}>
    <Icon className="text-5xl text-indigo-600 mb-4 mx-auto" />
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default BuyerProfile;