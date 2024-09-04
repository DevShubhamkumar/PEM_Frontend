import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import Footer from './Footer';
import { BASE_URL } from '../api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCartData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedCart = localStorage.getItem('cartData');
      const storedTimestamp = localStorage.getItem('cartTimestamp');
      const currentTime = new Date().getTime();

      // Check if stored cart exists and is less than 5 minutes old
      if (storedCart && storedTimestamp && (currentTime - parseInt(storedTimestamp)) < 300000) {
        setCartItems(JSON.parse(storedCart));
      } else {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const validCartItems = response.data.filter((item) => item.productId !== null && item.productId !== undefined);
        const cartItemsWithFullUrls = validCartItems.map((item) => ({
          ...item,
          productId: {
            ...item.productId,
            images: item.productId.images.map((imagePath) => `${BASE_URL}/${imagePath}`),
          },
          sellerName: item.productId.seller?.name || 'Unknown Seller',
        }));

        setCartItems(cartItemsWithFullUrls);
        localStorage.setItem('cartData', JSON.stringify(cartItemsWithFullUrls));
        localStorage.setItem('cartTimestamp', currentTime.toString());
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setError('An error occurred while fetching the cart data.');
      toast.error('Failed to load cart data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const getDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || 0;
      const discount = item.productId?.discount || 0;
      return total + getDiscountedPrice(price, discount) * item.quantity;
    }, 0);
  };

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || 0;
      const discount = item.productId?.discount || 0;
      return total + (price * item.quantity * discount) / 100;
    }, 0);
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveCartItem(cartItemId);
        return;
      }

      const token = localStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/api/cart/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Update localStorage
      const updatedCart = cartItems.map((item) =>
        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cartData', JSON.stringify(updatedCart));

      toast.success('Cart updated successfully.');
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedCartItems = cartItems.filter((item) => item._id !== cartItemId);
      setCartItems(updatedCartItems);

      // Update localStorage
      localStorage.setItem('cartData', JSON.stringify(updatedCartItems));

      toast.success('Item removed from cart.');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const handlePlaceOrder = () => {
    navigate('/user-details');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        {error}
      </div>
    );
  }

  const deliveryCharges = getTotalPrice() > 800 ? 0 : 40;
  const totalAmount = getTotalPrice() + deliveryCharges;
  const totalSavings = getTotalDiscount() + (getTotalPrice() > 800 ? 40 : 0);

  return (
    <div className="cart-page w-full bg-gray-100">
      <Toaster />
      
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-24">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Your Shopping Cart</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Review and manage your selected items</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Cart Items */}
      <section className="cart-items py-20">
        <div className="container mx-auto px-4">
          {cartItems.length === 0 ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <Link to="/" className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img
                              src={item.productId.images[0] || "https://via.placeholder.com/300"}
                              alt={item.productId.name}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <h3 className="text-xl font-semibold mb-2">{item.productId.name}</h3>
                            <p className="text-gray-600 mb-4">{item.productId.description}</p>
                            <p className="text-sm text-gray-500 mb-2">Sold by: {item.sellerName}</p>
                            <div className="flex items-center mb-4">
                              <span className="text-2xl font-bold mr-2">
                                ₹{getDiscountedPrice(item.productId.price, item.productId.discount).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through mr-2">₹{item.productId.price}</span>
                              <span className="text-sm text-green-600">{item.productId.discount}% off</span>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                className="bg-gray-200 text-gray-800 py-1 px-3 rounded-l"
                              >
                                -
                              </button>
                              <span className="bg-gray-100 py-1 px-4">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="bg-gray-200 text-gray-800 py-1 px-3 rounded-r"
                              >
                                +
                              </button>
                              <button
                                onClick={() => handleRemoveCartItem(item._id)}
                                className="ml-4 text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{getTotalDiscount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charges</span>
                      <span>₹{deliveryCharges.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-4">You save ₹{totalSavings.toFixed(2)} on this order</p>
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-full mt-6 hover:bg-indigo-700 transition duration-300"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Safe and Secure Payments. Easy returns. 100% Authentic products.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CartPage;