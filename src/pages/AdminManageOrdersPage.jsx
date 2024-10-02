import React, { useState } from 'react';
import { FaEye, FaTruck, FaBox, FaCheckCircle } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../api';

const fetchOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateOrderStatus = async ({ orderId, newStatus }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${BASE_URL}/api/orders/status`,
    { orderId, deliveryStatus: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

const AdminManageOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError, error } = useQuery('orders', fetchOrders);

  const updateStatusMutation = useMutation(updateOrderStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('orders');
    },
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, newStatus });
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
    : orders?.filter((order) => order.deliveryStatus === statusFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Loading orders...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-red-600">Error: {error.message}</h1>
      </div>
    );
  }

  return (
    <div className="admin-manage-orders-page w-full bg-gray-100">
      <section className="orders-header relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Manage Orders</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Efficiently handle and process customer orders</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <section className="orders-content py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">Filter by status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredOrders?.map((order) => (
                <OrderItem
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
};
const OrderItem = ({ order, onStatusChange, onViewDetails }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-indigo-600 truncate">
            Order ID: {order._id}
          </p>
          <div className="ml-2 flex-shrink-0 flex">
            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.deliveryStatus]}`}>
              {order.deliveryStatus}
            </p>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500">
              <FaBox className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {order.items.length} item(s)
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              <FaTruck className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {order.userId && order.userId.email}
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <p className="font-medium text-gray-900">₹{order.amount.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <select
            value={order.deliveryStatus}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button
            onClick={() => onViewDetails(order)}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaEye className="mr-2" /> View Details
          </button>
        </div>
      </div>
    </li>
  );
};

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Order Details
                </h3>
                <div className="mt-2">
                  {order.items.map((item) => (
                    <div key={item.productId._id} className="flex items-center py-4 border-b">
                      <img
                        className="h-20 w-20 rounded-md object-cover mr-4"
                        src={item.images && item.images.length > 0
                          ? (item.images[0].startsWith('http')
                            ? item.images[0]
                            : `${window.location.origin}/${item.images[0]}`)
                          : 'https://via.placeholder.com/150'}
                        alt={item.productName}
                      />
                      <div>
                        <h4 className="text-lg font-semibold">{item.productName}</h4>
                        <p className="text-gray-600">Price: ₹{item.price.toFixed(2)}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageOrdersPage;