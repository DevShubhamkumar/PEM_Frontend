import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { BASE_URL } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const ReportContainer = styled.div`
  margin-bottom: 30px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ReportTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #555;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ReportValue = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #2196f3;
`;

const AdminReportsPage = () => {
  const [reports, setReports] = useState({
    totalUsers: 0,
    sellers: 0,
    buyerProducts: 0,
    deliveredProducts: 0,
    usersLast30Days: 0,
    sellersLast30Days: 0,
    buyerProductsLast30Days: 0,
    deliveredProductsLast30Days: 0,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const endpoints = [
          'users',
          'sellers',
          'buyer-products',
          'delivered-products',
          'users-last-30-days',
          'sellers-last-30-days',
          'buyer-products-last-30-days',
          'delivered-products-last-30-days',
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            axios.get(`${BASE_URL}/api/admin/reports/${endpoint}`, { headers })
          )
        );

        const newReports = responses.reduce((acc, response, index) => {
          const key = endpoints[index].replace(/-/g, '_');
          acc[key] = response.data.count;
          return acc;
        }, {});

        setReports(newReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Consider adding user-friendly error handling here
      }
    };

    fetchReports();
  }, []);

  const reportItems = [
    { title: 'Total Registered Users', value: reports.users },
    { title: 'Total Sellers', value: reports.sellers },
    { title: 'Total Buyer Products', value: reports.buyer_products },
    { title: 'Total Delivered Products', value: reports.delivered_products },
    { title: 'Users Registered in Last 30 Days', value: reports.users_last_30_days },
    { title: 'Sellers Registered in Last 30 Days', value: reports.sellers_last_30_days },
    { title: 'Buyer Products Added in Last 30 Days', value: reports.buyer_products_last_30_days },
    { title: 'Products Delivered in Last 30 Days', value: reports.delivered_products_last_30_days },
  ];

  return (
    <Container>
      <Title>Admin Reports</Title>
      {reportItems.map((item, index) => (
        <ReportContainer key={index}>
          <ReportTitle>{item.title}:</ReportTitle>
          <ReportValue>{item.value}</ReportValue>
        </ReportContainer>
      ))}
    </Container>
  );
};

export default AdminReportsPage;