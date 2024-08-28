import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaCartPlus, FaStar } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Footer from './Footer';

const Container = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 40px);
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  position: sticky;
  top: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;

  &.active {
    border-color: #007bff;
  }
`;

const MainImageContainer = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  padding: 20px;
`;

const MainProductImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const RightSection = styled.div`
  flex: 1;
  padding-left: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 40px);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
`;

const Title = styled.h2`
 font-size: 24px;
 margin-bottom: 10px;
`;

const Description = styled.p`
 margin-bottom: 20px;
`;

const PriceContainer = styled.div`
 margin-bottom: 20px;
`;

const OriginalPrice = styled.span`
 color: #666;
 text-decoration: line-through;
 margin-right: 10px;
`;

const DiscountedPrice = styled.span`
 font-size: 20px;
 font-weight: bold;
`;

const Discount = styled.span`
 color: #ff0000;
 margin-left: 10px;
`;

const ButtonContainer = styled.div`
 display: flex;
 gap: 10px;
 margin-bottom: 20px;
`;

const AddToCartButton = styled.button`
 background-color: #28a745;
 color: #fff;
 border: none;
 padding: 10px 20px;
 border-radius: 4px;
 cursor: pointer;
 transition: background-color 0.3s ease;
 display: flex;
 align-items: center;
 justify-content: center;

 &:hover {
   background-color: #1e7e34;
 }

 svg {
   margin-right: 8px;
 }
`;

const BuyNowButton = styled.button`
 background-color: #ffc107;
 color: #000;
 border: none;
 padding: 10px 20px;
 border-radius: 4px;
 cursor: pointer;
 transition: background-color 0.3s ease;
 display: flex;
 align-items: center;
 justify-content: center;

 &:hover {
   background-color: #e0a800;
 }

 svg {
   margin-right: 8px;
 }
`;

const RatingContainer = styled.div`
 display: flex;
 align-items: center;
 margin-bottom: 10px;
`;

const TotalRating = styled.div`
 font-size: 18px;
 font-weight: bold;
 margin-right: 10px;
`;

const ReviewCount = styled.div`
 font-size: 14px;
 color: #666;
`;

const StarRating = styled.div`
 display: flex;
 align-items: center;
 margin-right: 10px;
`;

const StarIcon = styled(FaStar)`
 color: ${(props) => (props.active ? '#ffd700' : '#ddd')};
 cursor: pointer;
`;

const CommentSection = styled.div`
 margin-top: 40px;
`;

const CommentList = styled.ul`
 list-style: none;
 padding: 0;
`;

const CommentItem = styled.li`
 border: 1px solid #ddd;
 padding: 10px;
 margin-bottom: 10px;
`;

const RatingInput = styled.div`
 display: flex;
 align-items: center;
 margin-bottom: 10px;
`;

const RatingButton = styled.button`
 background-color: #007bff;
 color: #fff;
 border: none;
 padding: 5px 10px;
 border-radius: 4px;
 cursor: pointer;
 margin-left: 10px;
`;

const CommentInput = styled.textarea`
 width: 100%;
 padding: 10px;
 border: 1px solid #ddd;
 border-radius: 4px;
 resize: vertical;
 margin-bottom: 10px;
`;

const SubmitButton = styled.button`
 background-color: #007bff;
 color: #fff;
 border: none;
 padding: 10px 20px;
 border-radius: 4px;
 cursor: pointer;

 &:hover {
   background-color: #0056b3;
 }
`;

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userComment, setUserComment] = useState(null);
  const [editingComment, setEditingComment] = useState(false);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [sellerComment, setSellerComment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const serverUrl = 'http://localhost:5002';

        let productData;

        if (location.state && location.state.product) {
          productData = location.state.product;
        } else {
          const response = await fetch(`${serverUrl}/api/products/${productId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            setError(`API error: ${response.statusText}`);
            return;
          }

          const data = await response.json();

          if (data && data.product) {
            productData = data.product;
          } else {
            setError('Invalid API response data');
          }
        }

        if (productData) {
          console.log('Fetched productData:', productData);
          setProduct(productData);

          if (productData._id) {
            fetchComments(productData._id);
            fetchSellerComment(productData._id);
          } else {
            console.error('Product ID is undefined');
          }
        } else {
          setError('No product data found');
        }

        // Check if the product is delivered
        if (userId) {
          const ordersResponse = await axios.get(`${serverUrl}/api/users/${userId}/orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const orders = ordersResponse.data;
          console.log('orders fetching=====> ', orders);

          const orderWithProduct = orders.find((order) =>
            order.items.some(
              (item) =>
                item.productId &&
                item.productId._id &&
                productData._id &&
                item.productId._id.toString() === productData._id.toString() &&
                order.deliveryStatus === 'delivered'
            )
          );

          console.log('orderWithProduct', orderWithProduct);

          if (orderWithProduct) {
            console.log('Setting isDelivered to true');
            setIsDelivered(true);
          } else {
            console.log('Setting isDelivered to false');
            setIsDelivered(false);
          }
        }

        // Check if the user is logged in
        if (token && userId) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('An error occurred while fetching the product data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, location.state]);

  const fetchComments = async (productId) => {
    try {
      console.log('Fetching comments for productId:', productId);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5002/api/products/${productId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchSellerComment = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5002/api/products/${productId}/seller/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Seller comment response:', response);

      if (response.status === 200) {
        setSellerComment(response.data);
      } else {
        console.error('Seller comment API returned an error:', response.status, response.data);
        setSellerComment(null);
      }
    } catch (error) {
      console.error('Error fetching seller comment:', error);
      setSellerComment(null);
    }
  };

  const handleImageClick = (index) => {
    setMainImageIndex(index);
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5002/api/cart',
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Add to cart response:', response);

      if (response.status === 201 || response.status === 200) {
        toast.success('Product added to cart successfully!');
      } else {
        const errorMessage = response.data.message || 'Failed to add product to cart.';
        console.error('Error adding product to cart:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('An error occurred while adding the product to cart.');
    }
  };

  const handleBuyNow = () => {
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
        'http://localhost:5002/api/comments',
        { 
          productId: product._id, 
          text: newComment, 
          rating 
        },
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

  const handleRatingClick = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleEditComment = () => {
    setEditingComment(true);
    setEditedCommentText(userComment.text);
  };

  const handleSaveEditedComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5002/api/comments/${userComment._id}`,
        { text: editedCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserComment(response.data);
      setEditingComment(false);
      toast.success('Comment updated successfully');
      const updatedComments = comments.map((comment) =>
        comment._id === userComment._id ? response.data : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isLoggedIn) {
      toast.error('Please log in to like comments.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5002/api/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId
            ? { ...comment, likeCount: response.data.likeCount, likedBy: response.data.likedBy }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment. Please try again later.');
    }
  };

  const formatRating = (rating) => {
    return Number(rating.toFixed(1));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  const averageRating = formatRating(
    comments.reduce((total, comment) => total + comment.rating, 0) / comments.length || 0
  );

  const serverUrl = 'http://localhost:5002';

  return (
    <Container>
      <Toaster />
      <LeftSection>
        <ImageContainer>
          <ThumbnailsContainer>
            {product.images.map((imagePath, index) => (
              <Thumbnail
                key={index}
                src={`${serverUrl}/${imagePath}`}
                alt={product.name}
                onClick={() => handleImageClick(index)}
                className={index === mainImageIndex ? 'active' : ''}
              />
            ))}
          </ThumbnailsContainer>
        </ImageContainer>
        <MainImageContainer>
          <MainProductImage
            src={`${serverUrl}/${product.images[mainImageIndex]}`}
            alt={product.name}
          />
        </MainImageContainer>
      </LeftSection>
      <RightSection>
        <Title>{product.name}</Title>
        <Description>{product.description}</Description>
        <PriceContainer>
          <OriginalPrice>₹{product.price}</OriginalPrice>
          <DiscountedPrice>₹{(product.price * (1 - product.discount / 100)).toFixed(2)}</DiscountedPrice>
          <Discount>{product.discount}% off</Discount>
        </PriceContainer>
        <ButtonContainer>
          <AddToCartButton onClick={handleAddToCart}>
            <FaShoppingCart />
            Add to Cart
          </AddToCartButton>
          <BuyNowButton onClick={handleBuyNow}>
            <FaCartPlus />
            Buy Now
          </BuyNowButton>
        </ButtonContainer>
        <RatingContainer>
          <TotalRating>{averageRating}</TotalRating>
          <ReviewCount>({comments.length} reviews)</ReviewCount>
          <StarRating>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} active={i < Math.round(averageRating)} />
            ))}
          </StarRating>
        </RatingContainer>
        <CommentSection>
          <h3>Comments</h3>
          <CommentList>
            {comments.map((comment) => (
              <CommentItem key={comment._id}>
                <h4>{comment.author.name || 'Anonymous'}</h4>
                <RatingContainer>
                  <StarRating>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} active={i < comment.rating} />
                    ))}
                  </StarRating>
                  <span>{comment.rating} stars</span>
                </RatingContainer>
                <p>{comment.text}</p>
                <p>Posted on: {new Date(comment.createdAt).toLocaleString()}</p>
                {isLoggedIn && (
                  <button onClick={() => handleLikeComment(comment._id)}>
                    Like ({comment.likeCount})
                  </button>
                )}
              </CommentItem>
            ))}
          </CommentList>
          {isDelivered ? (
            isLoggedIn ? (
              !userComment ? (
                <form onSubmit={handleCommentSubmit}>
                  <RatingInput>
                    <StarRating>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          active={i < rating}
                          onClick={() => handleRatingClick(i + 1)}
                        />
                      ))}
                    </StarRating>
                    <span>{rating} stars</span>
                  </RatingInput>
                  <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                  />
                  <SubmitButton type="submit">Submit Comment</SubmitButton>
                </form>
              ) : !editingComment ? (
                <div>
                  <h4>Your Comment</h4>
                  <RatingContainer>
                    <StarRating>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} active={i < userComment.rating} />
                      ))}
                    </StarRating>
                    <span>{userComment.rating} stars</span>
                  </RatingContainer>
                  <p>{userComment.text}</p>
                  <button onClick={handleEditComment}>
                    <FaEdit /> Edit Comment
                  </button>
                </div>
              ) : (
                <div>
                  <h4>Edit Your Comment</h4>
                  <CommentInput
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                  />
                  <SubmitButton onClick={handleSaveEditedComment}>Save Changes</SubmitButton>
                </div>
              )
            ) : (
              <p>Please log in to leave a comment.</p>
            )
          ) : (
            <p>Comments are only available for delivered products.</p>
          )}
        </CommentSection>
        {sellerComment && (
          <div>
            <h3>Seller Comment</h3>
            <p>{sellerComment.comment}</p>
            <p>Posted on: {new Date(sellerComment.createdAt).toLocaleString()}</p>
          </div>
        )}
      </RightSection>
    </Container>
  );
};

export default ProductDetailsPage; this is older code and in this its checking product is dleivered then only user can commetn or rate pass that part of code new code rest all same 