import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Footer from './Footer';
import { BASE_URL } from '../api';

const sizes = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
};

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
    
        const serverUrl = `${BASE_URL}`;
        const response = await axios.get(`${serverUrl}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
    
        const cartItems = response.data;
    
        // Filter out cart items with null or undefined productId
        const validCartItems = cartItems.filter((item) => item.productId !== null && item.productId !== undefined);
    
        const cartItemsWithFullUrls = validCartItems.map((item) => {
          const images = item.productId.images.map((imagePath) => `${serverUrl}/${imagePath}`);
    
          let sellerName = 'Unknown Seller';
          if (item.productId.seller && item.productId.seller.name) {
            sellerName = item.productId.seller.name;
          }
    
          return {
            ...item,
            productId: {
              ...item.productId,
              images,
            },
            sellerName,
          };
        });
    
        setCartItems(cartItemsWithFullUrls);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        toast.error('An error occurred while fetching the cart data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartData();
  }, []);

  const serverUrl = '${BASE_URL}';

  const getDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const { productId, quantity } = item;
      const price = productId ? productId.price : 0;
      const discount = productId && productId.discount ? productId.discount : 0;
      const discountedPrice = price - (price * discount) / 100;
      return total + discountedPrice * quantity;
    }, 0);
  };
  
  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      const { productId, quantity } = item;
      const price = productId ? productId.price : 0;
      const discount = productId && productId.discount ? productId.discount : 0;
      return total + (price * quantity * discount) / 100;
    }, 0);
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveCartItem(cartItemId);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${serverUrl}/api/cart/${cartItemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      toast.error('An error occurred while updating the cart item quantity.');
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${serverUrl}/api/cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item._id !== cartItemId)
      );
      toast.success('Cart item removed successfully.');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('An error occurred while removing the cart item.');
    }
  };

  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <Toaster />
        <CartHeader>
          <h2>Cart</h2>
        </CartHeader>
        <EmptyCartMessage>Your cart is empty.</EmptyCartMessage>
      </CartContainer>
    );
  }

  const deliveryCharges = getTotalPrice() > 800 ? 0 : 40;
  const totalAmount = getTotalPrice() + deliveryCharges;
  const totalSavings = getTotalDiscount() + (getTotalPrice() > 800 ? 40 : 0);

  const handlePlaceOrder = () => {
    navigate('/user-details');
  };

  return (
    <CartContainer>
      <Toaster />
      <CartHeader>
        <h2>Cart</h2>
      </CartHeader>
      <CartBody>
        <CartItemList>
          {cartItems.map((item) => (
            <CartItem key={item._id}>
              <ImageContainer>
                {item.productId.images && item.productId.images.length > 0 ? (
                  <ProductImage src={item.productId.images[0]} alt={item.productId.name} />
                ) : (
                  <ProductImage src="https://via.placeholder.com/150" alt={item.productId.name} />
                )}
              </ImageContainer>
              <ProductDetails>
                <ProductName>{item.productId.name}</ProductName>
                <ProductDescription>{item.productId.description}</ProductDescription>
                <SellerName>Sold by: {item.sellerName}</SellerName>
                <PriceDetails>
                  <OriginalPrice>₹{item.productId.price}</OriginalPrice>
                  <Discount>
                    {item.productId.discount}% off
                    <DiscountAmount>
                      (₹{((item.productId.price * item.productId.discount) / 100).toFixed(2)})
                    </DiscountAmount>
                  </Discount>
                  <DiscountedPrice>
                    ₹{(item.productId.price - (item.productId.price * item.productId.discount) / 100).toFixed(2)}
                  </DiscountedPrice>
                </PriceDetails>
                <QuantityControlContainer>
                  <QuantityControl>
                    <QuantityButton
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </QuantityButton>
                    <Quantity>{item.quantity}</Quantity>
                    <QuantityButton onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                      +
                    </QuantityButton>
                  </QuantityControl>
                  <RemoveButton onClick={() => handleRemoveCartItem(item._id)}>Remove</RemoveButton>
                </QuantityControlContainer>
              </ProductDetails>
            </CartItem>
          ))}
        </CartItemList>
        <OrderSummaryContainer>
          <OrderSummary>
            <h3>Order Summary</h3>
            <SummaryItem>
              <span>Total Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </SummaryItem>
            <SummaryItem>
              <span>Total Discount</span>
              <DiscountAmount>-₹{getTotalDiscount().toFixed(2)}</DiscountAmount>
            </SummaryItem>
            <SummaryItem>
              <span>Delivery Charges</span>
              <span>₹{deliveryCharges.toFixed(2)}</span>
            </SummaryItem>
            <SummaryTotal>
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </SummaryTotal>
            <Savings>
              <span>You have saved ₹{totalSavings.toFixed(2)}!</span>
            </Savings>
            <SecurityMessage>
              **Safe and Secure Payments. Easy returns. 100% Authentic products.
            </SecurityMessage>
            <PlaceOrderButton onClick={handlePlaceOrder}>Place Order</PlaceOrderButton>
          </OrderSummary>
        </OrderSummaryContainer>
      </CartBody>
    </CartContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: red;
`;

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CartHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const CartBody = styled.div`
  display: flex;
  justify-content: space-between;
  
  ${media.tablet`
    flex-direction: column;
  `}
`;

const CartItemList = styled.div`
  width: 70%;
  
  ${media.tablet`
    width: 100%;
    margin-bottom: 20px;
  `}
`;

const CartItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  
  ${media.mobile`
    flex-direction: column;
  `}
`;

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  margin-right: 20px;
  
  ${media.mobile`
    width: 100%;
    height: auto;
    margin-right: 0;
    margin-bottom: 20px;
  `}
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  margin-top: 0;
`;

const ProductDescription = styled.p`
  margin-bottom: 10px;
`;

const SellerName = styled.p`
  margin-bottom: 10px;
`;

const PriceDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const OriginalPrice = styled.span`
  margin-right: 10px;
  text-decoration: line-through;
  color: #888;
`;

const Discount = styled.span`
  color: green;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const DiscountAmount = styled.span`
  margin-left: 5px;
`;

const DiscountedPrice = styled.span`
  font-weight: bold;
  margin-left: 10px;
`;

const QuantityControlContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const QuantityButton = styled.button`
  padding: 5px 15px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  border-radius: 4px;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  ${media.mobile`
    padding: 10px 20px;
  `}
`;

const Quantity = styled.span`
  padding: 0 10px;
  font-size: 16px;
`;

const RemoveButton = styled.button`
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #ff3333;
  }

  ${media.mobile`
    padding: 10px 15px;
  `}
`;

const OrderSummaryContainer = styled.div`
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px);
  width: 28%;
  
  ${media.tablet`
    position: static;
    width: 100%;
    height: auto;
  `}
`;

const OrderSummary = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SummaryTotal = styled(SummaryItem)`
  font-weight: bold;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
`;

const Savings = styled.div`
  color: green;
  font-weight: bold;
  margin-top: 10px;
`;

const SecurityMessage = styled.p`
  margin-top: 20px;
  font-style: italic;
  font-size: 14px;
  color: #666;
`;
const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #45a049;
  }
`;

const EmptyCartMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
`;

export default CartPage;