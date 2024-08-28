import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Footer from './Footer';
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [sellers, setSellers] = useState(0);
  const [buyerProducts, setBuyerProducts] = useState(0);
  const [deliveredProducts, setDeliveredProducts] = useState(0);
  const [usersLast30Days, setUsersLast30Days] = useState(0);
  const [sellersLast30Days, setSellersLast30Days] = useState(0);
  const [buyerProductsLast30Days, setBuyerProductsLast30Days] = useState(0);
  const [deliveredProductsLast30Days, setDeliveredProductsLast30Days] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');

        const [
          totalUsersResponse,
          sellersResponse,
          buyerProductsResponse,
          deliveredProductsResponse,
          usersLast30DaysResponse,
          sellersLast30DaysResponse,
          buyerProductsLast30DaysResponse,
          deliveredProductsLast30DaysResponse,
        ] = await Promise.all([
          axios.get('${BASE_URL}/api/admin/reports/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('${BASE_URL}/api/admin/reports/sellers', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('${BASE_URL}/api/admin/reports/buyer-products', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('${BASE_URL}/api/admin/reports/delivered-products', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('${BASE_URL}/api/admin/reports/users-last-30-days', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('${BASE_URL}/api/admin/reports/sellers-last-30-days', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('${BASE_URL}/api/admin/reports/buyer-products-last-30-days', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('${BASE_URL}/api/admin/reports/delivered-products-last-30-days', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setTotalUsers(totalUsersResponse.data.count);
        setSellers(sellersResponse.data.count);
        setBuyerProducts(buyerProductsResponse.data.count);
        setDeliveredProducts(deliveredProductsResponse.data.count);
        setUsersLast30Days(usersLast30DaysResponse.data.count);
        setSellersLast30Days(sellersLast30DaysResponse.data.count);
        setBuyerProductsLast30Days(buyerProductsLast30DaysResponse.data.count);
        setDeliveredProductsLast30Days(deliveredProductsLast30DaysResponse.data.count);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <Container>
      <Title>Admin Reports</Title>
      <ReportContainer>
        <ReportTitle>Total Registered Users:</ReportTitle>
        <ReportValue>{totalUsers}</ReportValue>
      </ReportContainer>
      <ReportContainer>
        <ReportTitle>Total Sellers:</ReportTitle>
        <ReportValue>{sellers}</ReportValue>
      </ReportContainer>
      <ReportContainer>
        <ReportTitle>Total Buyer Products:</ReportTitle>
        <ReportValue>{buyerProducts}</ReportValue>
      </ReportContainer>
      <ReportContainer>
        <ReportTitle>Total Delivered Products:</ReportTitle>
        <ReportValue>{deliveredProducts}</ReportValue>
      </ReportContainer>
      <ReportContainer>
        <ReportTitle>Users Registered in Last 30 Days:</ReportTitle>
        <ReportValue>{usersLast30Days}</ReportValue>
      </ReportContainer>
      <ReportContainer>
        <ReportTitle>Sellers Registered in Last 30 Days:</ReportTitle>
        <ReportValue>{sellersLast30Days}</ReportValue>
      </ReportContainer>
      <ReportContainer>
        <ReportTitle>Buyer Products Added in Last 30 Days:</ReportTitle>
        <ReportValue>{buyerProductsLast30Days}</ReportValue>
      </ReportContainer>
      <ReportContainer>
        <ReportTitle>Products Delivered in Last 30 Days:</ReportTitle>
        <ReportValue>{deliveredProductsLast30Days}</ReportValue>
      </ReportContainer>
    </Container>
  );
};

export default AdminReportsPage;