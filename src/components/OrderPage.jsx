import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaTimes, FaChevronDown } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { BASE_URL } from '../api';

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
  const [showAllOrders, setShowAllOrders] = useState(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error('User ID not found in token');
        toast.error('User ID not found');
        return;
      }
  
      const token = localStorage.getItem('token');
      const serverUrl = `${BASE_URL}`;
  
      const response = await axios.get(`${serverUrl}/api/users/${userId}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setOrders(response.data);
  
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
        response = await axios.put(
          `${serverUrl}/api/comments/${currentReview._id}`,
          { rating, text: comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${serverUrl}/api/comments`,
          { productId: currentProductId, rating, text: comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success(currentReview ? 'Review updated successfully' : 'Review submitted successfully');
      handleCloseModal();
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-3xl font-bold text-gray-800">Loading orders...</div>
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
          {orders.length === 0 ? (
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
                                  {reviewedProducts[productId] ? 'Update Review' : 'Add Review'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Reviews</h4>
                      {productComments[order.items[0].productId?._id || order.items[0].productId] && 
                       productComments[order.items[0].productId?._id || order.items[0].productId].length > 0 ? (
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
              {orders.length > 3 && (
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