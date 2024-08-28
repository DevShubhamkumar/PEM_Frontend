import React, { useState } from 'react';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import { BASE_URL } from '../api';

const stripePromise = loadStripe('pk_test_51PM3le054EVZ2qcVpOcojJgp5SVTdyKT7rKMxBPkwfeP5JySmpedgFfFnZOTXU8BoEX1ZfmWyM0Lx38zCsjQTu6Q0057ayw7EX');

const PaymentGatewayContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PaymentGatewayHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const CardElementContainer = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background-color: #333;
    color: #fff;
    font-family: 'Roboto', sans-serif;
    padding: 16px;
    border-radius: 8px;
  }

  .Toastify__progress-bar {
    background-color: #ffcc00;
  }
`;
const CheckoutForm = ({ handlePaymentMethod, userId, totalPrice, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProcessingPayment) {
      return; // Prevent multiple submissions
    }
    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Error: Card element not found');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/create-payment-intent`, {
        amount: totalPrice,
      });

      const { clientSecret } = data;
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        console.error('Error:', paymentResult.error);
        toast.error('Payment failed. Please try again.');
      } else {
        console.log('Payment successful:', paymentResult.paymentIntent);
        handlePaymentMethod('card', paymentResult.paymentIntent.id, userId, totalPrice, cartItems);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Error processing payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          Credit Card
        </Label>
        {paymentMethod === 'card' && (
          <CardElementContainer>
            <CardElement />
          </CardElementContainer>
        )}
      </FormGroup>
      <Button type="submit" disabled={!stripe && paymentMethod === 'card'}>
        Place Order
      </Button>
    </Form>
  );
};
const PaymentGatewayPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, totalPrice, cartItems } = location.state || {};

  const handlePaymentMethod = async (method, paymentIntentId, userId, totalPrice, cartItems) => {
    if (method === 'card') {
      try {
        const token = localStorage.getItem('token');
        const serverUrl = `${BASE_URL}`;
  
        const response = await axios.post(
          `${serverUrl}/api/create-order`,
          {
            paymentMethod: 'card',
            paymentIntentId,
            userId,
            totalPrice,
            cartItems,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        const { orderId } = response.data;
  
        toast.success('Payment successful! Order placed successfully.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
  
        // Navigate to the OrderConfirmation page
        navigate(`/order-confirmation/${orderId}`);
      } catch (error) {
        console.error('Error creating order:', error);
        toast.error('Error creating order. Please try again.');
      }
    }
  };
  return (
    <PaymentGatewayContainer>
      <PaymentGatewayHeader>Payment Gateway</PaymentGatewayHeader>
      <Elements stripe={stripePromise}>
        <CheckoutForm handlePaymentMethod={handlePaymentMethod} userId={userId} totalPrice={totalPrice} cartItems={cartItems} />
      </Elements>
      <StyledToastContainer />
    </PaymentGatewayContainer>
  );
};

export default PaymentGatewayPage;