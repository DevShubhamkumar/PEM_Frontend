import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import { BASE_URL } from '../api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CommentText = styled.p`
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
`;

const CommentRating = styled.p`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

const CommentAuthor = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const NoCommentsMessage = styled.p`
  font-size: 18px;
  color: #777;
  text-align: center;
`;

const AdminUserProfileActivity = () => {
  const { userId, userType } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchUserComments();
  }, [userId, userType]);

  const fetchUserComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/admin/${userType}/${userId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      toast.error('An error occurred while fetching user comments.');
    }
  };

  const handleEnableDisableComment = async (commentId, isActive) => {
    try {
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
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, isActive: !isActive } : comment
        )
      );
      toast.success('Comment status updated successfully');
    } catch (error) {
      console.error('Error updating comment status:', error);
      if (error.response && error.response.status === 403) {
        toast.error('You are not authorized to update comment status.');
      } else {
        toast.error('An error occurred while updating comment status.');
      }
    }
  };

  return (
    <Container>
      <Toaster />
      <Title>{userType === 'buyer' ? 'Buyer' : 'Seller'} Comments</Title>
      <CommentList>
        {comments.length === 0 ? (
          <NoCommentsMessage>This user has not commented yet.</NoCommentsMessage>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment._id}>
              <CommentText>{comment.text}</CommentText>
              <CommentRating>Rating: {comment.rating} stars</CommentRating>
              <CommentAuthor>
                By {userType === 'buyer' ? comment.sellerId?.sellerFields?.name : comment.buyerId?.buyerFields?.name} on{' '}
                {new Date(comment.createdAt).toLocaleString()}
              </CommentAuthor>
              <Button onClick={() => handleEnableDisableComment(comment._id, comment.isActive)}>
                {comment.isActive ? 'Disable' : 'Enable'}
              </Button>
            </CommentItem>
          ))
        )}
      </CommentList>
    </Container>
  );
};

export default AdminUserProfileActivity;