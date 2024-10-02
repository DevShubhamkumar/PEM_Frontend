import React, { useState, useEffect } from 'react';
import './Admin.css'
import Footer from './Footer';
import { BASE_URL } from '../api';


const ReviewUserActivityView = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch review user activity data from an API or database
    const fetchActivities = async () => {
      const response = await fetch('/api/review-user-activity');
      const data = await response.json();
      setActivities(data);
    };
    fetchActivities();
  }, []);

  return (
    <div>
      <h2>Review User Activity View</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.user}</td>
              <td>{activity.action}</td>
              <td>{activity.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewUserActivityView;