import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaTimes, FaChevronDown } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { BASE_URL } from '../api';

const OrdersPage = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [currentReview, setCurrentReview] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchOrders = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error('User ID not found');
    }

    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/users/${userId}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const fetchComments = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/products/${productId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const { data: orders, isLoading, error } = useQuery('orders', fetchOrders, {
    onError: (error) => {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders. Please try again.');
    },
  });

  const { data: productComments } = useQuery(
    ['productComments', orders],
    async () => {
      if (!orders) return {};
      const productIds = new Set(orders.flatMap(order => 
        order.items.map(item => item.productId?._id || item.productId)
      ));
      const comments = {};
      for (const productId of productIds) {
        comments[productId] = await fetchComments(productId);
      }
      return comments;
    },
    {
      enabled: !!orders,
      onError: (error) => {
        console.error('Error fetching comments:', error);
        toast.error('Failed to fetch comments. Please try again.');
      },
    }
  );

  const reviewMutation = useMutation(
    async ({ productId, rating, text, reviewId }) => {
      const token = localStorage.getItem('token');
      const url = reviewId
        ? `${BASE_URL}/api/comments/${reviewId}`
        : `${BASE_URL}/api/comments`;
      const method = reviewId ? 'put' : 'post';
      const data = reviewId ? { rating, text } : { productId, rating, text };
      
      const response = await axios[method](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('productComments');
        toast.success(currentReview ? 'Review updated successfully' : 'Review submitted successfully');
        handleCloseModal();
      },
      onError: (error) => {
        console.error('Error submitting/updating review:', error);
        toast.error(`Failed to ${currentReview ? 'update' : 'submit'} review: ${error.response?.data?.message || error.message}`);
      },
    }
  );

  const handleItemClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleReviewClick = (productId) => {
    setCurrentProductId(productId);
    const existingReview = productComments[productId]?.find(comment => comment.author._id === getUserIdFromToken());
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

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error('Please select a rating before submitting.');
      return;
    }

    reviewMutation.mutate({
      productId: currentProductId,
      rating,
      text: comment,
      reviewId: currentReview?._id,
    });
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setCurrentReview(null);
    setRating(0);
    setComment('');
    setCurrentProductId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-3xl font-bold text-gray-800">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-3xl font-bold text-red-800">Error loading orders. Please try again.</div>
      </div>
    );
  }

  const displayedOrders = showAllOrders ? orders : orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">My Orders</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">View and manage your order history</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>


      {/* Orders Section */}
      <section className="orders-section py-20">
        <div className="container mx-auto px-4">
          {!orders || orders.length === 0 ? (
            <div className="text-center text-2xl text-gray-600">No orders found</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">Order ID: {order._id}</h3>
                      <p className="text-gray-600 mb-2">Payment Method: {order.paymentMethod}</p>
                      <p className="text-gray-600 mb-2">Delivery Status: {order.deliveryStatus}</p>
                      <p className="text-gray-600 mb-4">Order Amount: ₹{order.amount.toFixed(2)}</p>
                      <div className="space-y-4">
                        {order.items.map((item) => {
                          const productId = item.productId?._id || item.productId;
                          let imagePath = item.image || item.productId?.images?.[0] || '';
                          if (imagePath && !imagePath.startsWith('http')) {
                            imagePath = `${BASE_URL}/${imagePath}`;
                          }

                          return (
                            <div key={productId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg" onClick={() => handleItemClick(productId)}>
                              <img src={imagePath} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                              <div>
                                <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                                <p className="text-gray-600">Price: ₹{item.price.toFixed(2)}</p>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              {order.deliveryStatus.toLowerCase() === 'delivered' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewClick(productId);
                                  }}
                                  className="ml-auto bg-indigo-600 text-white py-2 px-4 rounded-full text-sm hover:bg-indigo-700 transition duration-300"
                                >
                                  {productComments && productComments[productId]?.some(comment => comment.author._id === getUserIdFromToken()) ? 'Update Review' : 'Add Review'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Reviews</h4>
                      {productComments && productComments[order.items[0].productId?._id || order.items[0].productId] ? (
                        productComments[order.items[0].productId?._id || order.items[0].productId]
                          .filter(comment => comment.author._id === getUserIdFromToken())
                          .map((comment) => (
                            <div key={comment._id} className="mb-2">
                              <p className="text-gray-600">{comment.text}</p>
                              <div className="flex items-center">
                                {[...Array(comment.rating)].map((_, index) => (
                                  <FaStar key={index} className="text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-600">No reviews yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {orders && orders.length > 3 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 inline-flex items-center"
                  >
                    {showAllOrders ? "Show Less" : "Show More"}
                    <FaChevronDown className={`ml-2 transform ${showAllOrders ? "rotate-180" : ""} transition-transform duration-300`} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <button onClick={handleCloseModal} className="float-right text-gray-600 hover:text-gray-800">
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold mb-4">{currentReview ? 'Update Your Review' : 'Add Your Review'}</h3>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  className={`cursor-pointer ${value <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleRatingClick(value)}
                />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment (optional)"
              className="w-full h-32 p-2 border rounded-md mb-4"
            />
            <button
              onClick={handleSubmitReview}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              {currentReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;