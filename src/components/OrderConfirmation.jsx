import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaRegClock } from 'react-icons/fa';
import Footer from './Footer';
import { BASE_URL } from '../api';

const FullWidthContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 2rem 1rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background-color: #2c3e50;
  color: #ffffff;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
`;

const Content = styled.div`
  padding: 2rem;
`;

const ThankYouMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px rgba(21, 87, 36, 0.1);

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
`;

const PaymentStatusMessage = styled.div`
  background-color: ${props => props.status === 'Success' ? '#d4edda' : '#fff3cd'};
  color: ${props => props.status === 'Success' ? '#155724' : '#856404'};
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  svg {
    margin-right: 10px;
    font-size: 1.5rem;
  }
`;

const OrderItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const OrderItemContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }
`;

const OrderItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const OrderItemDetails = styled.div`
  flex: 1;
`;

const OrderItemName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #34495e;
`;

const OrderItemPrice = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const OrderItemQuantity = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
`;

const TotalPrice = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 2rem;
  color: #2c3e50;
  text-align: right;
  padding: 1rem;
  background-color: #f1f8ff;
  border-radius: 8px;
`;

const OrderDetailsContainer = styled.div`
  margin-top: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const OrderDetail = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: #34495e;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    font-weight: 600;
    margin-right: 5px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #3498db;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(114, 28, 36, 0.1);
`;

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem('token');
        const serverUrl = `${BASE_URL}`;

        const response = await axios.get(`${serverUrl}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orderData = response.data;

        if (!orderData || !orderData.items || orderData.items.length === 0) {
          setErrorMessage('No order items found.');
        } else {
          setOrder(orderData);
          setShowThankYouMessage(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order data:', error);
        setErrorMessage('An error occurred while fetching the order data.');
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (isLoading) {
    return (
      <FullWidthContainer>
        <ContentWrapper>
          <LoadingSpinner>Loading...</LoadingSpinner>
        </ContentWrapper>
      </FullWidthContainer>
    );
  }

  if (errorMessage) {
    return (
      <FullWidthContainer>
        <ContentWrapper>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </ContentWrapper>
      </FullWidthContainer>
    );
  }

  const { items, amount, paymentMethod, deliveryStatus } = order;

  const paymentStatus = paymentMethod === 'cod' ? 'Pending (COD)' : 'Success';

  return (
    <FullWidthContainer>
      <ContentWrapper>
        <Header>
          <Title>Order Confirmation</Title>
          <Subtitle>Thank you for your purchase!</Subtitle>
        </Header>
        <Content>
          {showThankYouMessage && (
            <ThankYouMessage>
              <h3>Thank you for your order!</h3>
              <p>Your order has been placed successfully.</p>
            </ThankYouMessage>
          )}
          <PaymentStatusMessage status={paymentStatus === 'Success' ? 'Success' : 'Pending'}>
            {paymentStatus === 'Success' ? <FaCheckCircle /> : <FaRegClock />}
            Payment Status: {paymentStatus}
          </PaymentStatusMessage>
          <OrderItemsGrid>
            {items.map((item) => (
              <OrderItemContainer key={item.productId}>
                <OrderItemImage
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0]
                      : 'https://via.placeholder.com/150'
                  }
                  alt={item.productName}
                />
                <OrderItemDetails>
                  <OrderItemName>{item.productName}</OrderItemName>
                  <OrderItemPrice>₹{item.price.toFixed(2)}</OrderItemPrice>
                  <OrderItemQuantity>Quantity: {item.quantity}</OrderItemQuantity>
                </OrderItemDetails>
              </OrderItemContainer>
            ))}
          </OrderItemsGrid>
          <TotalPrice>Total Price: ₹{amount.toFixed(2)}</TotalPrice>
          <OrderDetailsContainer>
            <OrderDetail><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</OrderDetail>
            <OrderDetail><strong>Delivery Status:</strong> {deliveryStatus}</OrderDetail>
            <OrderDetail><strong>Order ID:</strong> {orderId}</OrderDetail>
          </OrderDetailsContainer>
        </Content>
      </ContentWrapper>
      <Footer />
    </FullWidthContainer>
  );
};

export default OrderConfirmation;