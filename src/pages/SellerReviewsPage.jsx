import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../api';

const SellerReviewPage = () => {
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

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
    }
  };

  const handleReplySubmit = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/comments/${commentId}/reply`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReply('');
      setSelectedCommentId(null);
      fetchSellerComments();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const displayedComments = showAllReviews ? comments : comments.slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">Seller Reviews</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">See what our customers are saying about us</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Customer Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedComments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                      {comment.author.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{comment.author.name}</h3>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < comment.rating ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <FaQuoteLeft className="text-4xl text-indigo-500 mb-2" />
                    <p className="text-gray-600 italic">"{comment.text}"</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Posted on {new Date(comment.createdAt).toLocaleDateString()}</p>
                  
                  {comment.reply ? (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-gray-700 font-semibold mb-2">Seller's Reply:</p>
                      <p className="text-gray-600">"{comment.reply}"</p>
                    </div>
                  ) : (
                    <>
                      {selectedCommentId === comment._id ? (
                        <div>
                          <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            rows="3"
                          />
                          <button
                            onClick={() => handleReplySubmit(comment._id)}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
                          >
                            Submit Reply
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedCommentId(comment._id)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Reply to Review
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {comments.length > 4 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 inline-flex items-center"
              >
                {showAllReviews ? "Show Less" : "Show More Reviews"}
                <FaChevronDown className={`ml-2 transform ${showAllReviews ? "rotate-180" : ""} transition-transform duration-300`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Experience?</h2>
          <p className="text-xl mb-8">Your feedback helps us improve and grow. Leave a review today!</p>
          <button className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300">
            Write a Review
          </button>
        </div>
      </section>
    </div>
  );
};

export default SellerReviewPage;