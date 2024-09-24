import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaTruck, FaCreditCard, FaMoneyBillWave, FaSpinner, FaChevronDown } from 'react-icons/fa';
import Footer from './Footer';
import { BASE_URL } from '../api';

const OrderSummaryPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const serverUrl = `${BASE_URL}`;

        // Fetch cart items
        const cartResponse = await axios.get(`${serverUrl}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartItems = cartResponse.data;
        const validCartItems = cartItems.filter((item) => item.productId !== null && item.productId !== undefined);

        const cartItemsWithFullUrls = validCartItems.map((item) => ({
          ...item,
          productId: {
            ...item.productId,
            images: item.productId?.images?.map((imagePath) => 
              imagePath.startsWith('http') ? imagePath : `${serverUrl}/${imagePath}`
            ) || [],
          },
        }));

        setCartItems(cartItemsWithFullUrls);
        setUserId(cartResponse.data[0]?.userId || localStorage.getItem('userId'));

        // Fetch user address
        const storedAddress = localStorage.getItem('selectedAddress');
        if (storedAddress) {
          setSelectedAddress(JSON.parse(storedAddress));
        } else {
          const userResponse = await axios.get(`${serverUrl}/api/users/${userId}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userAddresses = userResponse.data.addresses;
          if (userAddresses?.length > 0) {
            setSelectedAddress(userAddresses[0]);
            localStorage.setItem('selectedAddress', JSON.stringify(userAddresses[0]));
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching the data. Please try again.');
        setIsLoading(false);
        toast.error('Failed to load order summary. Please refresh the page.');
      }
    };

    fetchData();
  }, [userId]);

  const totalPriceCalculation = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + (item.productId?.price || 0) * item.quantity * (1 - (item.productId?.discount || 0) / 100),
      0
    );
  }, [cartItems]);

  useEffect(() => {
    setTotalPrice(totalPriceCalculation);
  }, [totalPriceCalculation]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address.');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const serverUrl = `${BASE_URL}`;
  
      if (paymentMethod === 'cod') {
        const response = await axios.post(
          `${serverUrl}/api/create-order`,
          { paymentMethod: 'cod', userId, totalPrice, cartItems, address: selectedAddress },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate(`/order-confirmation/${response.data.orderId}`);
      } else if (paymentMethod === 'card') {
        navigate('/payment-gateway', { 
          state: { userId, totalPrice, cartItems, address: selectedAddress } 
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order. Please try again later.');
    }
  };

  const deliveryFee = totalPrice > 800 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-purple-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">Order Summary</h1>
          <p className="text-xl mb-8 animate-fade-in-up">Review your order details and complete your purchase</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaShoppingCart className="mr-2 text-purple-600" />
              Cart Items
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center border-b pb-4">
                    <img src={item.productId.images[0]} alt={item.productId.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.productId.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.productId.brand?.name} | {item.productId.category?.name}
                      </p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-purple-600 font-semibold">
                        ₹{((item.productId.price * (1 - item.productId.discount / 100)) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaTruck className="mr-2 text-purple-600" />
                Delivery Address
              </h2>
              {selectedAddress ? (
                <div>
                  <p className="font-semibold">{selectedAddress.fullName}</p>
                  <p>{selectedAddress.address}</p>
                  <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}</p>
                  <p>Phone: {selectedAddress.phoneNumber}</p>
                  {selectedAddress.landmark && <p>Landmark: {selectedAddress.landmark}</p>}
                </div>
              ) : (
                <p className="text-red-500">No address selected. Please add an address in your profile.</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-purple-600" />
                Payment Method
              </h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio text-purple-600"
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio text-purple-600"
                  />
                  <span>Online Payment</span>
                </label>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaMoneyBillWave className="mr-2 text-purple-600" />
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCreateOrder}
              disabled={!paymentMethod || cartItems.length === 0}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose Our E-Marketplace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={FaShoppingCart}
              title="Wide Selection"
              description="Browse through a vast array of products from trusted sellers."
            />
            <FeatureCard
              icon={FaTruck}
              title="Fast Delivery"
              description="Get your orders delivered quickly and efficiently."
            />
            <FeatureCard
              icon={FaCreditCard}
              title="Secure Payments"
              description="Shop with confidence using our secure payment options."
            />
            <FeatureCard
              icon={FaMoneyBillWave}
              title="Great Deals"
              description="Enjoy competitive prices and exciting offers on various products."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center">
    <Icon className="text-4xl text-purple-600 mb-4 mx-auto" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default OrderSummaryPage;