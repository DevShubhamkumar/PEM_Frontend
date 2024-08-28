import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FaShoppingCart, FaCartPlus, FaThumbsUp, FaThumbsDown, FaFacebook, FaTwitter, FaTruck, FaExchangeAlt, FaShieldAlt, FaHeart, FaRegHeart, FaCheck, FaInfoCircle } from 'react-icons/fa';
import styled from 'styled-components';
import Footer from './Footer';



// Styled components (keeping the existing ones and adding/modifying as needed)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.div``;

const RightSection = styled.div``;

const ImageContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-bottom: 10px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
`;

const MainImageContainer = styled.div`
  flex: 1;
`;

const MainProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  margin-bottom: 20px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const OriginalPrice = styled.span`
  font-size: 18px;
  text-decoration: line-through;
  color: #888;
  margin-right: 10px;
`;

const DiscountedPrice = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin-right: 10px;
`;

const Discount = styled.span`
  font-size: 16px;
  color: #28a745;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const BuyNowButton = styled(AddToCartButton)`
  background-color: #28a745;
  
  &:hover {
    background-color: #218838;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TotalRating = styled.span`
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
`;

const ReviewCount = styled.span`
  color: #888;
`;

const StarRating = styled.div`
  display: flex;
  margin-left: 10px;
`;

const StarIcon = styled.span`
  color: ${props => props.active ? '#ffc107' : '#e4e5e9'};
  font-size: 20px;
`;

const CommentSection = styled.div`
  margin-top: 30px;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentItem = styled.li`
  border-bottom: 1px solid #eee;
  padding: 10px 0;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.active ? '#007bff' : '#6c757d'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  margin-right: 10px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const DislikeButton = styled(LikeButton)`
  color: ${props => props.active ? '#dc3545' : '#6c757d'};
`;

const CommentForm = styled.form`
  margin-top: 20px;
  
  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    padding: 10px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    
    &:hover {
      background-color: #0056b3;
    }
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  margin: 0 10px;
`;

const ProductHighlights = styled.ul`
  margin-bottom: 20px;
`;

const SocialShare = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const ShareButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProductInfo = styled.div`
  margin-bottom: 20px;
`;

const ProductInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProductInfoIcon = styled.span`
  margin-right: 10px;
  color: #007bff;
`;
const NoReviews = styled.p`
  font-style: italic;
  color: #666;
  text-align: center;
  padding: 20px 0;
`;

// New styled components
const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const FeatureIcon = styled.span`
  margin-right: 10px;
  color: #28a745;
`;

const SpecificationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #dee2e6;
`;

const WishlistButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.active ? '#dc3545' : '#6c757d'};
  font-size: 24px;
  margin-left: 10px;
`;

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
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        const serverUrl = 'http://localhost:5002';
        const productResponse = await axios.get(`${serverUrl}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProduct(productResponse.data.product);
        const commentsResponse = await axios.get(`${serverUrl}/api/products/${id}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(commentsResponse.data);

        if (token && userId) {
          setIsLoggedIn(true);
          const orderResponse = await axios.get(`${serverUrl}/api/orders/user/${userId}/product/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCanReview(orderResponse.data.canReview);
          setIsDelivered(orderResponse.data.isDelivered);

          const wishlistResponse = await axios.get(`${serverUrl}/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsInWishlist(wishlistResponse.data.some(item => item.productId === id));
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

  const handleImageClick = (index) => {
    setMainImageIndex(index);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5002/api/cart',
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201 || response.status === 200) {
        toast.success('Product added to cart successfully!');
      } else {
        toast.error('Failed to add product to cart.');
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
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to leave a comment.');
      return;
    }
    if (rating === 0) {
      toast.error('Please rate the product before submitting your comment.');
      return;
    }
    try {
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

  const handleCommentReaction = async (commentId, action) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please log in to react to comments.');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5002/api/comments/${commentId}/react`,
        { action },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      // Update the comment's like and dislike counts
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
    let url;
    switch (platform) {
      case 'Facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        break;
      case 'Twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

 // New function to handle wishlist toggling
 const handleWishlistToggle = async () => {
  if (!isLoggedIn) {
    toast.error('Please log in to add to wishlist.');
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5002/api/wishlist/toggle',
      { productId: product._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsInWishlist(response.data.isInWishlist);
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    toast.error('Failed to update wishlist. Please try again later.');
  }
};


  const formatRating = (rating) => {
    return Number(rating.toFixed(1));
  };
  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  if (!product) {
    return <Container>No product found.</Container>;
  }

  const averageRating = formatRating(
    comments.reduce((total, comment) => total + comment.rating, 0) / comments.length || 0
  );

  const serverUrl = 'http://localhost:5002';
  return (
    <>
      <Container>
        <Toaster />
        <SocialShare>
          <ShareButton onClick={() => handleShare('Facebook')}><FaFacebook /> Share</ShareButton>
          <ShareButton onClick={() => handleShare('Twitter')}><FaTwitter /> Tweet</ShareButton>
        </SocialShare>
        <ProductGrid>
          <LeftSection>
            <ImageContainer>
              <ThumbnailsContainer>
                {product.images.map((imagePath, index) => (
                  <Thumbnail
                    key={index}
                    src={`${serverUrl}/${imagePath}`}
                    alt={product.name}
                    onClick={() => handleImageClick(index)}
                    active={index === mainImageIndex}
                  />
                ))}
              </ThumbnailsContainer>
              <MainImageContainer>
                <MainProductImage
                  src={`${serverUrl}/${product.images[mainImageIndex]}`}
                  alt={product.name}
                />
              </MainImageContainer>
            </ImageContainer>
          </LeftSection>
          <RightSection>
            <Title>{product.name}</Title>
            <RatingContainer>
              <TotalRating>{averageRating}</TotalRating>
              <ReviewCount>({comments.length} reviews)</ReviewCount>
              <StarRating>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} active={i < Math.round(averageRating)}>★</StarIcon>
                ))}
              </StarRating>
            </RatingContainer>
            <PriceContainer>
              <OriginalPrice>₹{product.price}</OriginalPrice>
              <DiscountedPrice>₹{(product.price * (1 - product.discount /100)).toFixed(2)}</DiscountedPrice>
              <Discount>{product.discount}% off</Discount>
            </PriceContainer>
            <Description>{product.description}</Description>
            <ProductInfo>
              <ProductInfoItem>
                <ProductInfoIcon><FaTruck /></ProductInfoIcon>
                Free delivery on orders over ₹500
              </ProductInfoItem>
              <ProductInfoItem>
                <ProductInfoIcon><FaExchangeAlt /></ProductInfoIcon>
                Easy 30-day return policy
              </ProductInfoItem>
              <ProductInfoItem>
                <ProductInfoIcon><FaShieldAlt /></ProductInfoIcon>
                2-year warranty included
              </ProductInfoItem>
            </ProductInfo>
            <FeatureList>
              <FeatureItem><FeatureIcon><FaCheck /></FeatureIcon> High-quality craftsmanship for lasting durability</FeatureItem>
              <FeatureItem><FeatureIcon><FaCheck /></FeatureIcon> Designed with user convenience and functionality in mind</FeatureItem>
              <FeatureItem><FeatureIcon><FaCheck /></FeatureIcon> Backed by exceptional customer support and a satisfaction guarantee</FeatureItem>
              <FeatureItem><FeatureIcon><FaCheck /></FeatureIcon> Eco-friendly materials and sustainable production processes</FeatureItem>
              <FeatureItem><FeatureIcon><FaCheck /></FeatureIcon> Compatible with a wide range of accessories and complementary products</FeatureItem>
            </FeatureList>
            <QuantitySelector>
              <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
              <QuantityInput type="number" value={quantity} readOnly />
              <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
            </QuantitySelector>
            <ButtonContainer>
              <AddToCartButton onClick={handleAddToCart}>
                <FaShoppingCart />
                Add to Cart
              </AddToCartButton>
              <BuyNowButton onClick={handleBuyNow}>
                <FaCartPlus />
                Buy Now
              </BuyNowButton>
              <WishlistButton onClick={handleWishlistToggle} active={isInWishlist}>
                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
              </WishlistButton>
            </ButtonContainer>
          </RightSection>
        </ProductGrid>
        
        <h3>Product Specifications</h3>
        <SpecificationsTable>
          <tbody>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>{product.brand || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>{product.model || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Color</TableCell>
              <TableCell>{product.color || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Material</TableCell>
              <TableCell>{product.material || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Dimensions</TableCell>
              <TableCell>{product.dimensions || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Weight</TableCell>
              <TableCell>{product.weight || 'N/A'}</TableCell>
            </TableRow>
          </tbody>
        </SpecificationsTable>

        <ProductInfo>
          <h3>Additional Information</h3>
          <ProductInfoItem>
            <ProductInfoIcon><FaInfoCircle /></ProductInfoIcon>
            Made in India
          </ProductInfoItem>
          <ProductInfoItem>
            <ProductInfoIcon><FaInfoCircle /></ProductInfoIcon>
            Energy-efficient design
          </ProductInfoItem>
          <ProductInfoItem>
            <ProductInfoIcon><FaInfoCircle /></ProductInfoIcon>
            Complies with international safety standards
          </ProductInfoItem>
        </ProductInfo>

        <CommentSection>
          <h3>Customer Reviews</h3>
          {comments.length > 0 ? (
            <CommentList>
              {comments.map((comment) => (
                <CommentItem key={comment._id}>
                  <h4>{comment.buyerId?.name || comment.author?.name || 'Anonymous'}</h4>
                  <RatingContainer>
                    <StarRating>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} active={i < comment.rating}>★</StarIcon>
                      ))}
                    </StarRating>
                    <span>{comment.rating}</span>
                  </RatingContainer>
                  <p>{comment.text}</p>
                  <LikeButton 
                    onClick={() => handleCommentReaction(comment._id, 'like')}
                    disabled={!isLoggedIn}
                  >
                    <FaThumbsUp /> {comment.likeCount}
                  </LikeButton>
                  <DislikeButton 
                    onClick={() => handleCommentReaction(comment._id, 'dislike')}
                    disabled={!isLoggedIn}
                  >
                    <FaThumbsDown /> {comment.dislikeCount}
                  </DislikeButton>
                </CommentItem>
              ))}
            </CommentList>
          ) : (
            <NoReviews>Currently no reviews available</NoReviews>
          )}
          {isDelivered && canReview && (
            <CommentForm onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review here..."
                required
              />
              <div>
                {[...Array(5)].map((_, i) => (
                  <StarRating key={i}>
                    <StarIcon
                      onClick={() => handleRatingClick(i + 1)}
                      active={i < rating}
                    >
                      ★
                    </StarIcon>
                  </StarRating>
                ))}
              </div>
              <button type="submit">Submit Review</button>
            </CommentForm>
          )}
        </CommentSection>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;