import React, { useState, useEffect, useCallback } from 'react';
import { FaUsers, FaStore, FaShoppingCart, FaTruck, FaUserPlus, FaStoreAlt, FaCartPlus, FaShippingFast } from 'react-icons/fa';
import { useAppContext } from './AppContext';


const AdminReportsPage = () => {
  const { fetchAdminReports, loading, error } = useAppContext();
  const [reports, setReports] = useState({
    users: 0,
    sellers: 0,
    buyer_products: 0,
    delivered_products: 0,
    users_last_30_days: 0,
    sellers_last_30_days: 0,
    buyer_products_last_30_days: 0,
    delivered_products_last_30_days: 0,
  });

  const loadReports = useCallback(async () => {
    try {
      const fetchedReports = await fetchAdminReports();
      setReports(fetchedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  }, [fetchAdminReports]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const reportItems = [
    { title: 'Total Registered Users', value: reports.users, icon: FaUsers, color: 'blue' },
    { title: 'Total Sellers', value: reports.sellers, icon: FaStore, color: 'green' },
    { title: 'Total Buyer Products', value: reports.buyer_products, icon: FaShoppingCart, color: 'yellow' },
    { title: 'Total Delivered Products', value: reports.delivered_products, icon: FaTruck, color: 'red' },
    { title: 'Users Registered in Last 30 Days', value: reports.users_last_30_days, icon: FaUserPlus, color: 'purple' },
    { title: 'Sellers Registered in Last 30 Days', value: reports.sellers_last_30_days, icon: FaStoreAlt, color: 'indigo' },
    { title: 'Buyer Products Added in Last 30 Days', value: reports.buyer_products_last_30_days, icon: FaCartPlus, color: 'pink' },
    { title: 'Products Delivered in Last 30 Days', value: reports.delivered_products_last_30_days, icon: FaShippingFast, color: 'teal' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Loading reports...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-red-600">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="admin-reports-page w-full bg-gray-100">
      <section className="reports-header relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Admin Reports Dashboard</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Get insights into your e-marketplace performance</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <section className="reports-grid py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reportItems.map((item, index) => (
              <ReportCard key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

  
    </div>
  );
};

const ReportCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl`}>
    <div className={`bg-${color}-100 p-6`}>
      <Icon className={`text-5xl text-${color}-600 mb-4`} />
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{value.toLocaleString()}</p>
    </div>
  </div>
);

export default AdminReportsPage;
