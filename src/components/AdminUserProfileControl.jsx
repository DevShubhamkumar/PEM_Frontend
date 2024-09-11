import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserTag, FaToggleOn, FaToggleOff, FaChartBar } from 'react-icons/fa';

const BASE_URL = 'https://pem-backend.onrender.com';

const UserProfileControl = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('all');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let url = `${BASE_URL}/api/admin_users`;

      if (userType === 'buyer') {
        url = `${BASE_URL}/api/admin_buyers`;
      } else if (userType === 'seller') {
        url = `${BASE_URL}/api/admin_sellers`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [userType]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserStatus = useCallback(async (userId, userType, isActive) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${userType}/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, status: isActive ? 'rejected' : 'approved' }
            : user
        )
      );

      console.log('User status updated successfully');
    } catch (error) {
      console.error('Error updating user status:', error);
      setError(error.message);
    }
  }, []);

  const handleViewActivity = useCallback((user) => {
    navigate(`/admin/user-activity/${user.userType}/${user._id}`);
  }, [navigate]);

  const handleUserTypeChange = useCallback((e) => {
    setUserType(e.target.value);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">User Profile Control</h1>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
          Filter by user type:
        </label>
        <select
          id="userType"
          value={userType}
          onChange={handleUserTypeChange}
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="all">All</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
        </select>
      </div>
      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-indigo-500 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">User Type</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Enable/Disable</th>
                <th className="py-3 px-6 text-center">View Activity</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      <span className="font-medium">
                        {user.userType === 'buyer'
                          ? user.buyerFields?.name || ''
                          : user.sellerFields?.companyName || ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      <FaUserTag className="mr-2" />
                      <span>{user.userType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span className={`${user.status === 'approved' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'} py-1 px-3 rounded-full text-xs`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.userType, user.status === 'approved')}
                      className={`${user.status === 'approved' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-1 px-3 rounded`}
                    >
                      {user.status === 'approved' ? <FaToggleOn className="inline mr-1" /> : <FaToggleOff className="inline mr-1" />}
                      {user.status === 'approved' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleViewActivity(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                    >
                      <FaChartBar className="inline mr-1" />
                      View Activity
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfileControl;