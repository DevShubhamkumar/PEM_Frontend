import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaUsers, FaCog, FaEdit, FaSave, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useAppContext } from './AppContext';
import { BASE_URL } from '../api';

const AdminProfile = () => {
  const { user, isAuthenticated, loading, error, fetchUserProfile, updateUserProfile, fetchUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [adminProfileData, setAdminProfileData] = useState({
    name: '',
    email: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user, fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setAdminProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      setImagePreview(user.profilePicture ? `${BASE_URL}/${user.profilePicture}` : '');
    }
  }, [user]);

  const handleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    if (!editMode && user) {
      setAdminProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      setImagePreview(user.profilePicture ? `${BASE_URL}/${user.profilePicture}` : '');
    }
  }, [editMode, user]);

  const handleAdminProfileUpdate = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', adminProfileData.name);
    formData.append('email', adminProfileData.email);
    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }
    await updateUserProfile(formData);
    setEditMode(false);
  }, [adminProfileData, profileImage, updateUserProfile]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) {
      fetchUsers().then(setUsers);
    }
  }, [fetchUsers, users.length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-profile w-full">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome, Admin {user?.name}</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Manage your profile and oversee user activities</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Admin Profile Section */}
      <section className="admin-profile-section py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Your Admin Profile</h2>
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
                  <form onSubmit={handleAdminProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={adminProfileData.name}
                        onChange={(e) => setAdminProfileData({ ...adminProfileData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={adminProfileData.email}
                        onChange={(e) => setAdminProfileData({ ...adminProfileData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
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
                    <p className="text-gray-600 mb-4">{user?.email}</p>
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

      {/* Admin Features */}
      <section className="admin-features py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaUserCircle}
              title="Manage Profile"
              description="Update your admin profile information and settings"
              onClick={() => handleTabChange('profile')}
            />
            <FeatureCard
              icon={FaUsers}
              title="User Management"
              description="View and manage user accounts on the platform"
              onClick={() => handleTabChange('users')}
            />
            <FeatureCard
              icon={FaCog}
              title="Platform Settings"
              description="Configure global settings for the e-marketplace"
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
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'settings' && 'Platform Settings'}
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Profile Information</h3>
                <p className="mb-2"><strong>Name:</strong> {user?.name}</p>
                <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
                <p className="mb-2"><strong>Role:</strong> Administrator</p>
              </div>
            )}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Registered Users</h3>
                {users.length === 0 ? (
                  <p>No users found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                      <div key={user._id} className="bg-gray-50 rounded-lg p-4 shadow">
                        <h4 className="text-lg font-semibold mb-2">{user.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">Email: {user.email}</p>
                        <p className="text-sm text-gray-600">Role: {user.userType}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Platform Settings</h3>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make Changes?</h2>
          <p className="text-xl mb-10">Use your admin powers to improve the e-marketplace experience!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/dashboard" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300">
              Go to Dashboard
            </Link>
            <Link to="/help" className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition duration-300">
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
    <Icon className="text-5xl text-indigo-600 mb-4 mx-auto" />
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default AdminProfile;