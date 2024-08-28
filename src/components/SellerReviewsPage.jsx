import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { BASE_URL } from '../api';


const Container = styled.div`
  max-width: 1000px;
  margin: 60px auto;
  padding: 40px;
  background-color: #f7f9fc;
  border-radius: 16px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 40px;
  text-align: center;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CommentItem = styled.li`
  border: none;
  padding: 32px;
  margin-bottom: 40px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }
`;

const CommentText = styled.p`
  font-size: 18px;
  margin-bottom: 16px;
  color: #34495e;
  line-height: 1.6;
`;

const CommentRating = styled.p`
  font-size: 16px;
  color: #f39c12;
  margin-bottom: 12px;
  font-weight: 600;
`;

const CommentAuthor = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 20px;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 16px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 20px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }
`;

const ReplySection = styled.div`
  background-color: #ecf0f1;
  padding: 24px;
  border-radius: 8px;
  margin-top: 24px;
`;

const SellerReviewPage = () => {
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const replyInputRef = useRef(null);

  useEffect(() => {
    fetchSellerComments();
  }, []);

  const fetchSellerComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/seller/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching seller comments:', error);
      toast.error('Failed to fetch comments. Please try again.');
    }
  };
  const handleReplySubmit = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const reply = replyInputRef.current.value;
      console.log('Submitting reply:', { commentId, reply });
      
      const response = await axios.post(
        `${BASE_URL}/api/comments/${commentId}/reply`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Reply submission response:', response.data);
      setReply('');
      setSelectedCommentId(null);
      fetchSellerComments();
      toast.success('Reply submitted successfully');
    } catch (error) {
      console.error('Error submitting reply:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || 'Failed to submit reply. Please try again.');
    }
  };

  return (
    <Container>
      <Toaster />
      <Title>Customer Reviews</Title>
      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment._id}>
            <CommentText>"{comment.text}"</CommentText>
            <CommentRating>Rating: {comment.rating} ★★★★★</CommentRating>
            <CommentAuthor>
              By {comment.author.name} on {new Date(comment.createdAt).toLocaleString()}
            </CommentAuthor>
            {comment.reply ? (
              <ReplySection>
                <CommentText>Seller Reply: "{comment.reply}"</CommentText>
                <CommentAuthor>By {comment.buyerId.name}</CommentAuthor>
              </ReplySection>
            ) : (
              <>
                {selectedCommentId === comment._id ? (
                  <>
                    <ReplyInput
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write your reply..."
                      ref={replyInputRef}
                    />
                    <Button onClick={() => handleReplySubmit(comment._id)}>
                      Submit Reply
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setSelectedCommentId(comment._id)}>
                    Reply to Review
                  </Button>
                )}
              </>
            )}
          </CommentItem>
        ))}
      </CommentList>
    </Container>
  );
};

export default SellerReviewPage;