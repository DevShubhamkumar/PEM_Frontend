import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Footer from './Footer';
import { BASE_URL } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ProductImage = styled.img`
  max-width: 300px;
  width: 100%;
  max-height: 200px; /* Adjust this value as needed */
  height: auto;
  margin-bottom: 10px;
`;
const ProductDetails = styled.div`
  h3 {
    margin-top: 0;
  }

  p {
    margin: 5px 0;
  }
`;
const AdminManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetched orders data:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }

      console.log('Sending PUT request to update order status:', orderId, newStatus);

      const response = await axios.put(
        `${BASE_URL}/api/orders/status`,
        { orderId, deliveryStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Order status update response:', response.data);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  return (
    <Container>
      <Title>Manage Orders</Title>
      <FilterContainer>
        <label htmlFor="statusFilter">Filter by status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </FilterContainer>
      <Table>
        <thead>
          <tr>
            <Th>Order ID</Th>
            <Th>Customer</Th>
            <Th>Amount</Th>
            <Th>Delivery Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <Td>{order._id}</Td>
              <Td>{order.userId && order.userId.email}</Td>
              <Td>{order.amount}</Td>
              <Td>
                <select
                  value={order.deliveryStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </Td>
              <Td>
                <Button onClick={() => handleViewDetails(order)}>
                  View Details
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedOrder && (
  <ModalOverlay>
    <ModalContent>
      {selectedOrder.items.map((item) => (
        <div key={item.productId._id}>
          <ProductImage
            src={
              item.images.length > 0
                ? item.images.map((imagePath) => {
                    if (imagePath.startsWith('http')) {
                      return imagePath; // If the image path is already a full URL, return it as is
                    } else {
                      const serverUrl = window.location.origin; // Get the server URL dynamically
                      return `${serverUrl}/${imagePath}`; // Otherwise, construct the full URL
                    }
                  })[0]
                : 'https://via.placeholder.com/150' // Fallback placeholder image
            }
            alt={item.productName}
          />
          <ProductDetails>
            <h3>{item.productName}</h3>
            <p>Price: {item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </ProductDetails>
        </div>
      ))}
      <Button onClick={closeModal}>Close</Button>
    </ModalContent>
  </ModalOverlay>
)}
    </Container>
  );
};

export default AdminManageOrdersPage;