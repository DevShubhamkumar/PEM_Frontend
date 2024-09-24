import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaRegClock, FaShoppingBag, FaTruck, FaCreditCard } from 'react-icons/fa';
import { useSpring, animated, config } from 'react-spring';
import confetti from 'canvas-confetti';
import Footer from './Footer';
import { BASE_URL } from '../api';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem('token');
        const serverUrl = `${BASE_URL}`;

        const response = await axios.get(`${serverUrl}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orderData = response.data;

        if (!orderData || !orderData.items || orderData.items.length === 0) {
          setErrorMessage('No order items found.');
        } else {
          setOrder(orderData);
          // Trigger confetti effect when order data is loaded
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order data:', error);
        setErrorMessage('An error occurred while fetching the order data.');
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const fadeIn = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0)',
    config: config.gentle
  });

  const pulseAnimation = useSpring({
    from: { transform: 'scale(1)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.05)' });
        await next({ transform: 'scale(1)' });
      }
    },
    config: { duration: 1000 }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {errorMessage}</span>
      </div>
    );
  }

  const { items, amount, paymentMethod, deliveryStatus } = order;
  const paymentStatus = paymentMethod === 'cod' ? 'Pending (COD)' : 'Success';

  return (
    <animated.div style={fadeIn} className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-green-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-bounce">Order Confirmation</h1>
          <p className="text-xl mb-8 animate-pulse">Thank you for your purchase!</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <animated.div style={pulseAnimation} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-5xl mr-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h2>
          </div>
          <p className="text-center text-gray-600 text-lg mb-6">
            Your order has been received and is being processed. You will receive an email confirmation shortly.
          </p>
          <div className="flex justify-center">
            <div className="bg-green-100 text-green-800 text-lg font-semibold py-2 px-4 rounded-full animate-pulse">
              Order ID: {orderId}
            </div>
          </div>
        </animated.div>

        {/* Rest of the component remains the same */}
        {/* ... */}

      </div>

      {/* What's Next Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaRegClock}
              title="Track Your Order"
              description="Stay updated on your order status through our tracking system."
            />
            <FeatureCard
              icon={FaTruck}
              title="Prepare for Delivery"
              description="Make sure someone is available to receive your package upon delivery."
            />
            <FeatureCard
              icon={FaCheckCircle}
              title="Enjoy Your Purchase"
              description="Once received, enjoy your new items! Don't forget to leave a review."
            />
          </div>
        </div>
      </section>

      <Footer />
    </animated.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const springProps = useSpring({
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.2)' : '0 5px 10px rgba(0,0,0,0.1)',
    config: config.wobbly
  });

  return (
    <animated.div
      style={springProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer"
    >
      <Icon className="text-4xl text-purple-600 mb-4 mx-auto" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </animated.div>
  );
};

export default OrderConfirmationPage;