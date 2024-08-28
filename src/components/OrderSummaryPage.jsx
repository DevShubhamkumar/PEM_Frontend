import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Footer from './Footer';
import { BASE_URL } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const CartItemContainer = styled.div`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CartItemDetails = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CartItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;

  @media (max-width: 576px) {
    margin-bottom: 1rem;
  }
`;

const CartItemInfo = styled.div`
  flex: 1;
`;

const CartItemName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const CartItemPrice = styled.p`
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 0.5rem;
`;

const CartItemQuantity = styled.p`
  color: #666;
`;

const TotalPrice = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
  text-align: right;
  margin-top: 1rem;
`;

const AddressContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
`;

const AddressDetails = styled.div`
  line-height: 1.6;
`;

const OrderSummaryContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
`;

const Total = styled(SummaryItem)`
  font-weight: bold;
  font-size: 1.3rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
`;

const PaymentMethodContainer = styled.div`
  margin-top: 1.5rem;
`;

const PaymentMethodLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const PaymentMethodInput = styled.input`
  margin-right: 0.5rem;
`;

const PaymentButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const OrderSummaryPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const serverUrl = `${BASE_URL}`;

        // Fetch cart data
        const cartResponse = await axios.get(`${serverUrl}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartItems = cartResponse.data;
        const validCartItems = cartItems.filter((item) => item.productId !== null && item.productId !== undefined);

        const cartItemsWithFullUrls = validCartItems.map((item) => {
          let images = [];
          if (item.productId && item.productId.images) {
            images = item.productId.images.map((imagePath) => 
              imagePath.startsWith('http') ? imagePath : `${serverUrl}/${imagePath}`
            );
          }
          return {
            ...item,
            productId: {
              ...item.productId,
              images,
              price: item.productId.price || 0,
            },
            sellerId: {
              ...item.sellerId,
            },
          };
        });

        const totalPrice = cartItemsWithFullUrls.reduce(
          (total, item) =>
            total +
            (item.productId
              ? item.productId.price * item.quantity -
                (item.productId.price * item.quantity * item.productId.discount) / 100
              : 0),
          0
        );

        setCartItems(cartItemsWithFullUrls);
        setTotalPrice(totalPrice);

        const userId = cartResponse.data.userId || localStorage.getItem('userId');
        setUserId(userId);

        // Get selected address from local storage
        const storedAddress = localStorage.getItem('selectedAddress');
        if (storedAddress) {
          setSelectedAddress(JSON.parse(storedAddress));
        } else {
          // If no address is selected, fetch the user's addresses
          const userResponse = await axios.get(`${serverUrl}/api/users/${userId}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userAddresses = userResponse.data.addresses;
          if (userAddresses && userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0]);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('An error occurred while fetching the data.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCreateOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const serverUrl = `${BASE_URL}`;
  
      if (paymentMethod === 'cod') {
        const response = await axios.post(
          `${serverUrl}/api/create-order`,
          {
            paymentMethod: 'cod',
            userId,
            totalPrice,
            cartItems,
            address: selectedAddress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const { orderId } = response.data;
        navigate(`/order-confirmation/${orderId}`);
      } else if (paymentMethod === 'card') {
        navigate('/payment-gateway', { 
          state: { 
            userId, 
            totalPrice, 
            cartItems,
            address: selectedAddress,
          } 
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order. Please try again later.');
    }
  };

  const deliveryFee = totalPrice > 800 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <Container>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Title>Order Summary</Title>
          <Section>
            <Title>Cart Items</Title>
            {cartItems.map((item) => (
              <CartItemContainer key={item._id}>
                <CartItemDetails>
                  <CartItemImage src={item.productId.images[0]} alt={item.productId.name} />
                  <CartItemInfo>
                    <CartItemName>{item.productId.name}</CartItemName>
                    <CartItemPrice>₹{item.productId.price.toFixed(2)}</CartItemPrice>
                    <CartItemQuantity>Quantity: {item.quantity}</CartItemQuantity>
                  </CartItemInfo>
                </CartItemDetails>
              </CartItemContainer>
            ))}
            <TotalPrice>Total Price: ₹{totalPrice.toFixed(2)}</TotalPrice>
          </Section>
          <Section>
            <Title>Delivery Address</Title>
            {selectedAddress ? (
              <AddressContainer>
                <AddressDetails>
                  <p>{selectedAddress.fullName}</p>
                  <p>{selectedAddress.address}</p>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}
                  </p>
                  <p>Phone: {selectedAddress.phoneNumber}</p>
                  {selectedAddress.landmark && <p>Landmark: {selectedAddress.landmark}</p>}
                </AddressDetails>
              </AddressContainer>
            ) : (
              <p>No address selected. Please select an address from your profile.</p>
            )}
          </Section>
          <OrderSummaryContainer>
            <Title>Order Summary</Title>
            <SummaryItem>
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </SummaryItem>
            <SummaryItem>
              <span>Delivery Charges</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </SummaryItem>
            <Total>
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </Total>
            <PaymentMethodContainer>
              <PaymentMethodLabel>
                <PaymentMethodInput
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={handlePaymentMethodChange}
                />
                Cash on Delivery
              </PaymentMethodLabel>
              <PaymentMethodLabel>
                <PaymentMethodInput
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={handlePaymentMethodChange}
                />
                Online Payment
              </PaymentMethodLabel>
            </PaymentMethodContainer>
            <PaymentButton onClick={handleCreateOrder} disabled={!paymentMethod}>
              Proceed to Payment
            </PaymentButton>
          </OrderSummaryContainer>
          <Footer />
        </>
      )}
    </Container>
  );
};

export default OrderSummaryPage;