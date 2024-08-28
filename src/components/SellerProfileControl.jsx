// SellerProfileControl.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import Footer from './Footer';
import { BASE_URL } from '../api';

const SellerProfileControl = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    // Fetch seller data from an API or database
    const fetchSellers = async () => {
      const response = await fetch('/api/sellers');
      const data = await response.json();
      setSellers(data);
    };
    fetchSellers();
  }, []);

  const toggleSellerStatus = async (sellerId, isActive) => {
    try {
      // Make an API call to enable or disable the seller
      const response = await fetch(`/api/sellers/${sellerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        // Update the seller status in the local state
        setSellers((prevSellers) =>
          prevSellers.map((seller) =>
            seller.id === sellerId ? { ...seller, isActive: !isActive } : seller
          )
        );
      } else {
        console.error('Failed to update seller status');
      }
    } catch (error) {
      console.error('Error updating seller status:', error);
    }
  };

  return (
    <div>
      <h2>Seller Profile Control</h2>
      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Website</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller.id}>
              <td>{seller.businessName}</td>
              <td>{seller.website}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={seller.isActive}
                    onChange={() => toggleSellerStatus(seller.id, seller.isActive)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
              <Link to={`/admin/user-activity/buyer/${seller.id}`}>View Activity</Link>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerProfileControl;