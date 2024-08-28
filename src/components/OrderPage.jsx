import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';
import { FaStar, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../api';


const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const OrderContainer = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const OrderDetails = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;

  h3 {
    color: #2c3e50;
    font-size: 1.4rem;
    margin-bottom: 10px;
  }

  p {
    color: #7f8c8d;
    margin: 5px 0;
    font-size: 1rem;
  }
`;

const OrderItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const OrderItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  }
`;

const OrderItemDetails = styled.div`
  display: flex;
  align-items: center;
`;

const OrderItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
`;

const OrderItemInfo = styled.div`
  flex: 1;
`;

const OrderItemName = styled.p`
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #34495e;
  font-size: 1.1rem;
`;

const OrderItemPrice = styled.p`
  color: #e74c3c;
  margin: 0 0 5px 0;
  font-weight: bold;
  font-size: 1rem;
`;

const OrderItemQuantity = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const NoOrders = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #95a5a6;
  margin-top: 50px;
`;

const ReviewButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  position: relative;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StarIcon = styled(FaStar)`
  color: ${props => props.active ? '#f1c40f' : '#bdc3c7'};
  cursor: pointer;
  font-size: 30px;
  margin: 0 5px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 120px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }
`;

const CommentContainer = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

const Comment = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  color: #34495e;
  margin-right: 10px;
`;

const CommentText = styled.p`
  margin: 5px 0;
  color: #7f8c8d;
`;

const CommentRating = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const CloseButton = styled(FaTimes)`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  font-size: 24px;
  color: #7f8c8d;
  transition: color 0.3s ease;

  &:hover {
    color: #34495e;
  }
`;
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewedProducts, setReviewedProducts] = useState({});
  const [productComments, setProductComments] = useState({});
  const [currentReview, setCurrentReview] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded payload:', payload);
      return payload.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = getUserIdFromToken();
      console.log('UserId from token:', userId);
  
      if (!userId) {
        console.error('User ID not found in token');
        toast.error('User ID not found');
        return;
      }
  
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Add this line
  
      const serverUrl = `${BASE_URL}`;
  
      console.log('Sending request to:', `${serverUrl}/api/users/${userId}/orders`); // Add this line
  
      const response = await axios.get(`${serverUrl}/api/users/${userId}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Fetched orders:', response.data);
      setOrders(response.data);
  
  
      // Fetch comments for each product in the orders
      const productIds = new Set(response.data.flatMap(order => 
        order.items.map(item => item.productId?._id || item.productId)
      ));
  
      for (const productId of productIds) {
        fetchComments(productId);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const fetchComments = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const serverUrl = `${BASE_URL}`;
  
      const response = await axios.get(`${serverUrl}/api/products/${productId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setProductComments(prev => ({ ...prev, [productId]: response.data }));
  
      const userId = getUserIdFromToken();
      const userReview = response.data.find(comment => comment.author._id === userId);
      if (userReview) {
        setReviewedProducts(prev => ({ ...prev, [productId]: userReview }));
      }
    } catch (error) {
      console.error(`Error fetching comments for product ${productId}:`, error);
      toast.error(`Failed to fetch comments for product ${productId}. Please try again.`);
    }
  };
  

  const handleItemClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleReviewClick = (productId) => {
    setCurrentProductId(productId);
    const existingReview = reviewedProducts[productId];
    if (existingReview) {
      setCurrentReview(existingReview);
      setRating(existingReview.rating);
      setComment(existingReview.text);
    } else {
      setCurrentReview(null);
      setRating(0);
      setComment('');
    }
    setShowReviewModal(true);
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating before submitting.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const serverUrl = `${BASE_URL}`;

      let response;
      if (currentReview) {
        // Update existing review
        response = await axios.put(
          `${serverUrl}/api/comments/${currentReview._id}`,
          {
            rating,
            text: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new review
        response = await axios.post(
          `${serverUrl}/api/comments`,
          {
            productId: currentProductId,
            rating,
            text: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log('Review submission/update response:', response.data);

      toast.success(currentReview ? 'Review updated successfully' : 'Review submitted successfully');
      handleCloseModal();

      // Refetch comments after submitting or updating a review
      fetchComments(currentProductId);
    } catch (error) {
      console.error('Error submitting/updating review:', error);
      toast.error(`Failed to ${currentReview ? 'update' : 'submit'} review: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setCurrentReview(null);
    setRating(0);
    setComment('');
    setCurrentProductId(null);
  };

  if (isLoading) {
    return <Container><Title>Loading orders...</Title></Container>;
  }

  return (
    <Container>
      <Toaster />
      <Title>My Orders</Title>
      {orders.length === 0 ? (
        <NoOrders>No orders found</NoOrders>
      ) : (
        orders.map((order) => (
          <OrderContainer key={order._id}>
            <OrderDetails>
              <h3>Order ID: {order._id}</h3>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Delivery Status: {order.deliveryStatus}</p>
              <p>Order Amount: ₹{order.amount.toFixed(2)}</p>
            </OrderDetails>
            <OrderItems>
              {order.items.map((item) => {
                const productId = item.productId?._id || item.productId;
                let imagePath = item.image || item.productId?.images?.[0] || '';

                if (imagePath && !imagePath.startsWith('http')) {
                  imagePath = `${BASE_URL}/${imagePath}`;
                }

                return (
                  <OrderItem
                    key={productId}
                    onClick={() => handleItemClick(productId)}
                  >
                    <OrderItemDetails>
                      <OrderItemImage src={imagePath} alt={item.name} />
                      <OrderItemInfo>
                        <OrderItemName>{item.name}</OrderItemName>
                        <OrderItemPrice>₹{item.price.toFixed(2)}</OrderItemPrice>
                        <OrderItemQuantity>Quantity: {item.quantity}</OrderItemQuantity>
                      </OrderItemInfo>
                    </OrderItemDetails>
                    {order.deliveryStatus.toLowerCase() === 'delivered' && (
                      <ReviewButton onClick={(e) => {
                        e.stopPropagation();
                        handleReviewClick(productId);
                      }}>
                        {reviewedProducts[productId] ? 'Update Review' : 'Add Review'}
                      </ReviewButton>
                    )}
                    <CommentContainer>
  <h4>Your Product Comments</h4>
  {productComments[productId] && productComments[productId].length > 0 ? (
    productComments[productId]
      .filter(comment => comment.author._id === getUserIdFromToken())
      .map((comment) => (
        <Comment key={comment._id}>
          <CommentAuthor>{comment.author.name}:</CommentAuthor>
          <CommentText>{comment.text}</CommentText>
          <CommentRating>
            {[...Array(comment.rating)].map((_, index) => (
              <FaStar key={index} color="#f1c40f" />
            ))}
          </CommentRating>
        </Comment>
      ))
  ) : (
    <p>No comments yet.</p>
  )}
</CommentContainer>

                  </OrderItem>
                );
              })}
            </OrderItems>
          </OrderContainer>
        ))
      )}
      {showReviewModal && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={handleCloseModal} />
            <h3>{currentReview ? 'Update Your Review' : 'Add Your Review'}</h3>
            <StarRating>
              {[1, 2, 3, 4, 5].map((value) => (
                <StarIcon
                  key={value}
                  active={value <= rating}
                  onClick={() => handleRatingClick(value)}
                />
              ))}
            </StarRating>
            <CommentInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment (optional)"
            />
            <SubmitButton onClick={handleSubmitReview}>
              {currentReview ? 'Update Review' : 'Submit Review'}
            </SubmitButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default OrdersPage;