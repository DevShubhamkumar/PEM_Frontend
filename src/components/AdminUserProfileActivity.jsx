import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaStar, FaCalendarAlt, FaToggleOn, FaToggleOff, FaComments } from 'react-icons/fa';

const BASE_URL = 'https://pem-backend.onrender.com';

const AdminUserProfileActivity = () => {
  const { userId, userType } = useParams();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUserComments();
  }, [userId, userType]);

  const fetchUserComments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/admin/${userType}/${userId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      showToast('error', 'An error occurred while fetching user comments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableDisableComment = async (commentId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/api/comments/${commentId}/toggle`,
        { isActive: !isActive },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, isActive: !isActive } : comment
        )
      );
      showToast('success', 'Comment status updated successfully');
    } catch (error) {
      console.error('Error updating comment status:', error);
      if (error.response && error.response.status === 403) {
        showToast('error', 'You are not authorized to update comment status.');
      } else {
        showToast('error', 'An error occurred while updating comment status.');
      }
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-600">
          {userType === 'buyer' ? 'Buyer' : 'Seller'} Activity Profile
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">This user has not commented yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 rounded-lg p-6 shadow-md transition duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaUser className="text-indigo-500 text-2xl mr-3" />
                      <span className="text-lg font-semibold text-gray-800">
                        {userType === 'buyer' ? comment.sellerId?.sellerFields?.name : comment.buyerId?.buyerFields?.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-2" />
                      <span className="text-gray-600">Rating: {comment.rating} stars</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 bg-white p-4 rounded-lg shadow-inner">{comment.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleEnableDisableComment(comment._id, comment.isActive)}
                      className={`flex items-center px-4 py-2 rounded-full text-white font-semibold transition duration-300 ${
                        comment.isActive
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {comment.isActive ? (
                        <>
                          <FaToggleOn className="mr-2" /> Disable
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="mr-2" /> Enable
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfileActivity;