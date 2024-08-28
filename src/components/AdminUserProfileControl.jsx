import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import Footer from './Footer';
import { BASE_URL } from '../api';

const UserProfileControl = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        let url = '${BASE_URL}/api/admin_users';

        if (userType === 'buyer') {
          url = '${BASE_URL}/api/admin_buyers';
        } else if (userType === 'seller') {
          url = '${BASE_URL}/api/admin_sellers';
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
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userType]);

  const toggleUserStatus = async (userId, userType, isActive) => {
    try {
      const payload = JSON.stringify({ isActive: !isActive });
      console.log('Request payload:', payload);

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

      // Update the users state with the updated user status
      const updatedUsers = users.map((user) => {
        if (user._id === userId) {
          return {
            ...user,
            status: isActive ? 'rejected' : 'approved',
          };
        }
        return user;
      });
      setUsers(updatedUsers);

      console.log('User status updated successfully');
    } catch (error) {
      console.error('Error updating user status:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleViewActivity = (user) => {
    console.log('User object:', user);
    navigate(`/admin/user-activity/${user.userType}/${user._id}`);
    console.log('Navigating to:', `/admin/user-activity/${user.userType}/${user._id}`);
  };

  return (
    <div>
      <h2>User Profile Control</h2>
      <div>
        <label>
          Filter by user type:
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="all">All</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
          </select>
        </label>
      </div>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Status</th>
              <th>Enable/Disable</th>
              <th>View Activity</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.userType === 'buyer'
                    ? user.buyerFields?.name || ''
                    : user.sellerFields?.companyName || ''}
                </td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>{user.status}</td>
                <td>
                  <button
                    onClick={() => toggleUserStatus(user._id, user.userType, user.status === 'approved')}
                  >
                    {user.status === 'approved' ? 'Disable' : 'Enable'}
                  </button>
                </td>
                <td>
                <button onClick={() => handleViewActivity(user)}>
      View Activity
    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserProfileControl;
