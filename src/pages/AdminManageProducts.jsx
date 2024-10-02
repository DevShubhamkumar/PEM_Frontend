import React, { useState } from 'react';
import { FaToggleOn, FaToggleOff, FaTrash } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../api';
import toast, { Toaster } from 'react-hot-toast';

const fetchAdminData = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/api/admin/data`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const toggleProductStatus = async ({ productId, isActive }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${BASE_URL}/api/products/${productId}/toggle-status`,
    { isActive },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

const deleteProduct = async (productId) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${BASE_URL}/api/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return productId;
};

const AdminManageProducts = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterItemType, setFilterItemType] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery('adminData', fetchAdminData);

  const toggleStatusMutation = useMutation(toggleProductStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminData');
      toast.success('Product status updated successfully');
    },
    onError: () => {
      toast.error('Error updating product status');
    },
  });

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminData');
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Error deleting product');
    },
  });

  const handleToggleProductStatus = async (id, isActive) => {
    try {
      await toggleStatusMutation.mutateAsync({ productId: id, isActive });
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this product?</p>
        <div>
          <button
            onClick={() => {
              deleteMutation.mutate(id);
              toast.dismiss(t.id);
            }}
            className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const filteredProducts = data?.products.filter((product) => {
    const categoryMatch = filterCategory === '' || product.category.toString() === filterCategory;
    const itemTypeMatch = filterItemType === '' || product.itemType.toString() === filterItemType;
    const brandMatch = filterBrand === '' || product.brand.toString() === filterBrand;
    return categoryMatch && itemTypeMatch && brandMatch;
  });

  const getCategoryName = (categoryId) => {
    const category = data?.categories.find((cat) => cat._id === categoryId);
    return category ? category.name : '';
  };

  const getItemTypeName = (itemTypeId) => {
    const itemType = data?.itemTypes.find((type) => type._id === itemTypeId);
    return itemType ? itemType.name : '';
  };

  const getBrandName = (brandId) => {
    const brand = data?.brands.find((b) => b._id === brandId);
    return brand ? brand.name : '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Loading products...</h1>
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
    <div className="admin-manage-products-page w-full bg-gray-100">
      <Toaster position="top-right" />
      <section className="products-header relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in-down">Manage Products</h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 animate-fade-in-up">View, manage, and delete products from your catalog</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>
 
      <section className="products-content py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FilterSelect
              id="filterCategory"
              label="Filter by Category"
              value={filterCategory}
              onChange={setFilterCategory}
              options={data.categories}
            />
            <FilterSelect
              id="filterItemType"
              label="Filter by Item Type"
              value={filterItemType}
              onChange={setFilterItemType}
              options={data.itemTypes}
            />
            <FilterSelect
              id="filterBrand"
              label="Filter by Brand"
              value={filterBrand}
              onChange={setFilterBrand}
              options={data.brands}
            />
          </div>


          <div className="bg-white shadow overflow-hidden sm:rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Description', 'Price', 'Stock', 'Discount', 'Category', 'Item Type', 'Brand', 'Status', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{product.description.substring(0, 50)}...</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">₹{product.price.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{product.stock}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{product.discount}%</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{getCategoryName(product.category)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{getItemTypeName(product.itemType)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">{getBrandName(product.brand)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleProductStatus(product._id, !product.isActive)}
                        className={`${
                          product.isActive ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'
                        } transition duration-150 ease-in-out`}
                      >
                        {product.isActive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                      </button>
                    </td>
                    <td className="px-6 sm:px-6 py-4 whitespace-nowrap text-m font-medium">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

const FilterSelect = ({ id, label, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}:
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option._id} value={option._id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default AdminManageProducts;
