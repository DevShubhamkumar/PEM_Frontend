// SellerActivityView.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Admin.css';
import Footer from './Footer';
import { BASE_URL } from '../api';

const SellerActivityView = () => {
  const { sellerId } = useParams();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch seller activity data from an API or database
    const fetchActivities = async () => {
      const response = await fetch(`/api/seller-activity/${sellerId}`);
      const data = await response.json();
      setActivities(data);
    };
    fetchActivities();
  }, [sellerId]);

  const toggleActivityStatus = async (activityId, isActive) => {
    try {
      // Make an API call to enable or disable the activity
      const response = await fetch(`/api/seller-activities/${activityId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        // Update the activity status in the local state
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.id === activityId ? { ...activity, isActive: !isActive } : activity
          )
        );
      } else {
        console.error('Failed to update activity status');
      }
    } catch (error) {
      console.error('Error updating activity status:', error);
    }
  };

  return (
    <div>
      <h2>Seller Activity View</h2>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.action}</td>
              <td>{activity.timestamp}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={activity.isActive}
                    onChange={() => toggleActivityStatus(activity.id, activity.isActive)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerActivityView;