import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import { BASE_URL } from '../api';

const ActivityPage = () => {
  const { userType, userId } = useParams();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/${userType}/${userId}/activities`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        const activitiesData = await response.json();
        setActivities(activitiesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [userType, userId]);

  const toggleActivityStatus = async (activityId, isActive) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${userType}/${userId}/activities/${activityId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Server responded with non-JSON data');
      }

      const data = await response.json();

      if (response.ok) {
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity._id === activityId ? { ...activity, isActive: !isActive } : activity
          )
        );
      } else {
        throw new Error(data.message || 'Error updating activity status');
      }
    } catch (error) {
      console.error('Error updating activity status:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Activity Page</h2>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Activity Name</th>
              <th>Status</th>
              <th>Enable/Disable</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.name}</td>
                <td>{activity.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => toggleActivityStatus(activity._id, activity.isActive)}>
                    {activity.isActive ? 'Disable' : 'Enable'}
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

export default ActivityPage;