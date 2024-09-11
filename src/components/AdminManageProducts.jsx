import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useAppContext } from './AppContext';

const AdminManageProducts = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterItemType, setFilterItemType] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const { 
    products, 
    categories, 
    itemTypes, 
    brands, 
    loading, 
    error, 
    fetchAdminData, 
    deleteProduct, 
    toggleProductStatus 
  } = useAppContext();

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleToggleProductStatus = async (id, isEnabled) => {
    try {
      await toggleProductStatus(id, isEnabled);
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch = filterCategory === '' || product.category.toString() === filterCategory;
    const itemTypeMatch = filterItemType === '' || product.itemType.toString() === filterItemType;
    const brandMatch = filterBrand === '' || product.brand.toString() === filterBrand;

    return categoryMatch && itemTypeMatch && brandMatch;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : '';
  };

  const getItemTypeName = (itemTypeId) => {
    const itemType = itemTypes.find((type) => type._id === itemTypeId);
    return itemType ? itemType.name : '';
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b._id === brandId);
    return brand ? brand.name : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Loading products...</h1>
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
    <div className="admin-manage-products-page w-full bg-gray-100">
      <section className="products-header relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">Manage Products</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Efficiently manage your product catalog</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <section className="products-content py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FilterSelect
              id="filterCategory"
              label="Filter by Category"
              value={filterCategory}
              onChange={setFilterCategory}
              options={categories}
            />
            <FilterSelect
              id="filterItemType"
              label="Filter by Item Type"
              value={filterItemType}
              onChange={setFilterItemType}
              options={itemTypes}
            />
            <FilterSelect
              id="filterBrand"
              label="Filter by Brand"
              value={filterBrand}
              onChange={setFilterBrand}
              options={brands}
            />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Description', 'Price', 'Stock', 'Discount', 'Category', 'Item Type', 'Brand', 'Status', 'Actions'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.description.substring(0, 50)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.discount}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getCategoryName(product.category)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getItemTypeName(product.itemType)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getBrandName(product.brand)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleProductStatus(product._id, !product.isActive)}
                        className={`${
                          product.isActive ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'
                        } transition duration-150 ease-in-out`}
                      >
                        {product.isActive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/edit-product/${product._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <FaEdit />
                      </Link>
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

          <div className="mt-8 flex justify-center">
            <Link
              to="/add-product"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" /> Add Product
            </Link>
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