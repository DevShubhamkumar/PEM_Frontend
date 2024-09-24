import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FaShoppingCart, FaCartPlus, FaThumbsUp, FaThumbsDown, FaFacebook, FaTwitter, FaTruck, FaExchangeAlt, FaShieldAlt, FaCheck, FaInfoCircle, FaStar, FaBox, FaCreditCard, FaGift } from 'react-icons/fa';
import axios from 'axios';
import Footer from './Footer';
import { BASE_URL } from '../api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        const [productResponse, commentsResponse, relatedProductsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/products/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/products/${id}/related`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const processedProduct = {
          ...productResponse.data.product,
          images: productResponse.data.product.images.map(image => 
            image.startsWith('http') ? image : `${BASE_URL}/${image}`
          )
        };

        setProduct(processedProduct);
        setComments(commentsResponse.data);
        setRelatedProducts(relatedProductsResponse.data);

        if (token && userId) {
          setIsLoggedIn(true);
          const orderResponse = await axios.get(`${BASE_URL}/api/orders/user/${userId}/product/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          
          setCanReview(orderResponse.data.canReview);
          setIsDelivered(orderResponse.data.isDelivered);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching the data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleImageClick = (index) => setMainImageIndex(index);

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/cart`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success('Product added to cart successfully!');
      } else {
        toast.error('Failed to add product to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('An error occurred while adding the product to cart.');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please log in to leave a comment.');
      return;
    }
    if (rating === 0) {
      toast.error('Please rate the product before submitting your comment.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/comments`,
        { productId: product._id, text: newComment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Comment submitted successfully');
      setNewComment('');
      setRating(0);
      setComments([...comments, response.data]);
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error.response?.data?.message || 'An error occurred while submitting the comment.');
    }
  };

  const handleRatingClick = (ratingValue) => setRating(ratingValue);

  const handleCommentReaction = async (commentId, action) => {
    if (!isLoggedIn) {
      toast.error('Please log in to react to comments.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/comments/${commentId}/react`,
        { action },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
  
      setComments(prevComments => prevComments.map(comment => 
        comment._id === commentId 
          ? { ...comment, likeCount: response.data.likeCount, dislikeCount: response.data.dislikeCount }
          : comment
      ));
  
      toast.success(`Comment ${action === 'like' ? 'liked' : 'disliked'} successfully`);
    } catch (error) {
      console.error(`Error reacting to comment:`, error);
      toast.error('Failed to react to comment. Please try again later.');
    }
  };

  const handleShare = (platform) => {
    const url = platform === 'Facebook'
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
      : `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`;
    window.open(url, '_blank');
  };

  const formatRating = (rating) => Number(rating.toFixed(1));

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">No product found.</div>;

  const averageRating = formatRating(
    comments.reduce((total, comment) => total + comment.rating, 0) / comments.length || 0
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-24 sm:py-32">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
            {product.name}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-8 animate-fade-in-up max-w-3xl">
            Discover the perfect blend of style, functionality, and innovation.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold">₹{(product.price * (1 - product.discount /100)).toFixed(2)}</span>
            <span className="text-xl text-gray-300 line-through">₹{product.price}</span>
            <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">{product.discount}% OFF</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Section - Images */}
          <div className="lg:w-1/2">
            <div className="relative aspect-w-1 aspect-h-1 mb-4">
              <img
                src={product.images[mainImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-full h-20 object-cover cursor-pointer rounded ${index === mainImageIndex ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </div>

          {/* Right Section - Product Details */}
          <div className="lg:w-1/2">
            <div className="flex items-center mb-6">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'} text-2xl`} />
                ))}
              </div>
              <span className="text-2xl font-bold">{averageRating}</span>
              <span className="ml-2 text-gray-600">({comments.length} reviews)</span>
            </div>
            <p className="text-gray-700 text-lg mb-8">{product.description}</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <FaTruck className="text-blue-500 mr-3 text-xl" />
                <span>Free delivery on orders over ₹500</span>
              </div>
              <div className="flex items-center">
                <FaExchangeAlt className="text-blue-500 mr-3 text-xl" />
                <span>Easy 30-day return policy</span>
              </div>
              <div className="flex items-center">
                <FaShieldAlt className="text-blue-500 mr-3 text-xl" />
                <span>2-year warranty included</span>
              </div>
              <div className="flex items-center">
                <FaBox className="text-blue-500 mr-3 text-xl" />
                <span>In stock: {product.stockQuantity} units available</span>
              </div>
              <div className="flex items-center">
                <FaCreditCard className="text-blue-500 mr-3 text-xl" />
                <span>Secure payment options available</span>
              </div>
              <div className="flex items-center">
                <FaGift className="text-blue-500 mr-3 text-xl" />
                <span>Gift wrapping available for ₹50</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
              >
                -
              </button>
              <span className="text-2xl font-semibold">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
              >
                +
              </button>
            </div>
            <div className="flex space-x-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                <FaCartPlus className="mr-2" /> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Product Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['High-quality craftsmanship', 'User-friendly design', 'Exceptional customer support', 'Eco-friendly materials', 'Wide accessory compatibility', 'Energy-efficient operation'].map((feature, index) => (
              <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow">
                <FaCheck className="text-green-500 mr-3 text-xl" /> 
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Specifications */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Product Specifications</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <tbody>
                {[
                  { label: 'Brand', value: product.brand },
                  { label: 'Model', value: product.model },
                  { label: 'Color', value: product.color },
                  { label: 'Material', value: product.material },
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'Weight', value: product.weight },
                  { label: 'Warranty', value: '2 years' },
                  { label: 'Country of Origin', value: 'India' },
                ].map((spec, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 font-semibold">{spec.label}</td>
                    <td className="px-6 py-4">{spec.value || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          {comments.length > 0 ? (
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{comment.buyerId?.name || comment.author?.name || 'Anonymous'}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'} text-lg`} />
                      ))}
                      <span className="ml-2 text-lg text-gray-600">{comment.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{comment.text}</p>
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleCommentReaction(comment._id, 'like')}
                      className={`flex items-center ${isLoggedIn ? 'hover:text-blue-500' : 'cursor-not-allowed'} ${comment.likeCount > 0 ? 'text-blue-500' : 'text-gray-500'} transition duration-300 ease-in-out`}
                      disabled={!isLoggedIn}
                    >
                      <FaThumbsUp className="mr-2 text-lg" /> {comment.likeCount}
                    </button>
                    <button 
                      onClick={() => handleCommentReaction(comment._id, 'dislike')}
                      className={`flex items-center ${isLoggedIn ? 'hover:text-red-500' : 'cursor-not-allowed'} ${comment.dislikeCount > 0 ? 'text-red-500' : 'text-gray-500'} transition duration-300 ease-in-out`}
                      disabled={!isLoggedIn}
                    >
                      <FaThumbsDown className="mr-2 text-lg" /> {comment.dislikeCount}
                    </button>
                  </div>
                </div>))}
            </div>
          ) : (
            <p className="text-gray-600 italic text-center py-12 text-xl bg-white rounded-lg shadow">No reviews available yet. Be the first to review this product!</p>
          )}

          {/* Review Submission Form */}
          {isDelivered && canReview && (
            <div className="mt-12 bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-semibold mb-6">Write a Review</h3>
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-6">
                  <label htmlFor="review" className="block text-lg font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea
                    id="review"
                    rows="4"
                    className="w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about the product..."
                    required
                  ></textarea>
                </div>
                <div className="mb-6">
                  <span className="block text-lg font-medium text-gray-700 mb-2">Your Rating</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleRatingClick(i + 1)}
                        className={`text-3xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none transition duration-300 hover:scale-110`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
              <img 
                src={relatedProduct.images[0]} 
                alt={relatedProduct.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{relatedProduct.name}</h3>
                <p className="text-gray-600">{relatedProduct.description.substring(0, 100)}...</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">₹{relatedProduct.price.toFixed(2)}</span>
                  <Link 
                    to={`/product/${relatedProduct._id}`} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Social Share */}
        <div className="mt-16 flex justify-center space-x-6">
          <button
            onClick={() => handleShare('Facebook')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaFacebook className="mr-2 text-xl" /> Share on Facebook
          </button>
          <button
            onClick={() => handleShare('Twitter')}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaTwitter className="mr-2 text-xl" /> Share on Twitter
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: "What is the return policy?", a: "We offer a 30-day return policy for all products. If you're not satisfied, you can return the item for a full refund." },
              { q: "How long does shipping take?", a: "Shipping times vary depending on your location. Generally, orders are delivered within 3-7 business days." },
              { q: "Is the product covered by warranty?", a: "Yes, this product comes with a 2-year manufacturer's warranty covering defects in materials and workmanship." },
              { q: "Can I cancel my order?", a: "You can cancel your order within 24 hours of placing it. After that, it may have already been processed for shipping." }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;