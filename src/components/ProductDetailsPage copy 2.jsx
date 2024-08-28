import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaShoppingCart, FaCartPlus, FaEdit, FaStar } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const RightSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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
  border: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #007bff;
  }
`;

const MainImageContainer = styled.div`
  flex-grow: 1;
`;

const MainProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const OriginalPrice = styled.span`
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountedPrice = styled.span`
  font-size: 28px;
  font-weight: bold;
  color: #e53935;
`;

const Discount = styled.span`
  font-size: 16px;
  color: #4caf50;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease;
`;

const AddToCartButton = styled(Button)`
  background-color: #ff9800;
  color: white;

  &:hover {
    background-color: #f57c00;
  }
`;

const BuyNowButton = styled(Button)`
  background-color: #4caf50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const TotalRating = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const ReviewCount = styled.span`
  color: #666;
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
`;

const StarIcon = styled(FaStar)`
  color: ${props => props.active ? '#ffc107' : '#e0e0e0'};
  cursor: pointer;
`;

const CommentSection = styled.div`
  margin-top: 30px;
`;

const CommentList = styled.div`
  margin-bottom: 20px;
`;

const CommentItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
  margin-bottom: 10px;
`;

const SubmitButton = styled(Button)`
  background-color: #2196f3;
  color: white;

  &:hover {
    background-color: #1e88e5;
  }
`;

const EditButton = styled(Button)`
  background-color: #ff9800;
  color: white;

  &:hover {
    background-color: #f57c00;
  }
`;

const LikeButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;

  &:hover {
    background-color: #bdbdbd;
  }
`;

const LikedUsersModal = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;


const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedComments, setLikedComments] = useState({});
  const [showLikedUsers, setShowLikedUsers] = useState({});

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
    navigate('/cart');
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
      setLikedComments(prev => ({ ...prev, [commentId]: response.data.isLiked }));
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment. Please try again later.');
    }
  };

  const handleShowLikedUsers = (commentId) => {
    const comment = comments.find(c => c._id === commentId);
    if (comment && comment.likedBy) {
      setShowLikedUsers(prev => ({ ...prev, [commentId]: comment.likedBy }));
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
        <Description>{product.description}</Description>
        <PriceContainer>
          <OriginalPrice>₹{product.price}</OriginalPrice>
          <DiscountedPrice>₹{(product.price * (1 - product.discount /100)).toFixed(2)}</DiscountedPrice>
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
      </RightSection>
    </Container>
  );
};

export default ProductDetailsPage;