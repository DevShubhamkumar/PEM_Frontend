import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { FaUser, FaStar, FaCalendarAlt, FaToggleOn, FaToggleOff, FaComments } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../api';

const fetchUserComments = async ({ userId, userType }) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/api/admin/${userType}/${userId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const toggleCommentStatus = async ({ commentId, isActive }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${BASE_URL}/api/comments/${commentId}/toggle`,
    { isActive: !isActive },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default function AdminUserProfileActivity() {
  const { userId, userType } = useParams();
  const queryClient = useQueryClient();

  const { data: comments, isLoading, error } = useQuery(
    ['userComments', userId, userType],
    () => fetchUserComments({ userId, userType }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const toggleCommentMutation = useMutation(toggleCommentStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userComments', userId, userType]);
      toast.success('Comment status updated successfully');
    },
    onError: (error) => {
      if (error.response && error.response.status === 403) {
        toast.error('You are not authorized to update comment status.');
      } else {
        toast.error('An error occurred while updating comment status.');
      }
    },
  });

  const handleEnableDisableComment = (commentId, isActive) => {
    toggleCommentMutation.mutate({ commentId, isActive });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> An error occurred while fetching user comments.</span>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <ToastContainer />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          {userType === 'buyer' ? 'Buyer' : 'Seller'} Activity Profile
        </h1>
        <div className="bg-card rounded-lg shadow-lg p-8">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <FaComments className="text-6xl text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">This user has not made any comments yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-accent rounded-lg p-6 shadow-md transition duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaUser className="text-primary text-2xl mr-3" />
                      <span className="text-lg font-semibold text-foreground">
                        {userType === 'buyer' ? comment.sellerId?.sellerFields?.name : comment.buyerId?.buyerFields?.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-2" />
                      <span className="text-muted-foreground">Rating: {comment.rating} stars</span>
                    </div>
                  </div>
                  <p className="text-foreground mb-4 bg-background p-4 rounded-lg shadow-inner">{comment.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleEnableDisableComment(comment._id, comment.isActive)}
                      className={`flex items-center px-4 py-2 rounded-full text-white font-semibold transition duration-300 ${
                        comment.isActive
                          ? 'bg-destructive hover:bg-destructive/90'
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                      disabled={toggleCommentMutation.isLoading}
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
}