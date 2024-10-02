import React, { useState } from 'react';
import './Admin.css'
import { BASE_URL } from '../api';

const ReviewControl = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);

  const handleReviewChange = (e) => {
    setNewReview(e.target.value);
  };

  const handleRatingChange = (e) => {
    setNewRating(e.target.value);
  };

  const handleAddReview = () => {
    if (newReview.trim() !== '') {
      setReviews([
        ...reviews,
        { id: Date.now(), content: newReview, rating: newRating, timestamp: new Date().toLocaleString() },
      ]);
      setNewReview('');
      setNewRating(0);
    }
  };

  return (
    <div>
      <h2>Review Control</h2>
      <div>
        <textarea
          value={newReview}
          onChange={handleReviewChange}
          placeholder="Add a new review..."
        ></textarea>
        <input
          type="number"
          min="1"
          max="5"
          value={newRating}
          onChange={handleRatingChange}
          placeholder="Rating (1-5)"
        />
        <button onClick={handleAddReview}>Add Review</button>
      </div>
      <div>
        {reviews.map((review) => (
          <div key={review.id}>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
            <p>Timestamp: {review.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewControl;