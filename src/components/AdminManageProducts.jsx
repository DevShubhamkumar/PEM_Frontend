import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { BASE_URL } from '../api';

const AdminManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterItemType, setFilterItemType] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching data with token:', token);

      const response = await axios.get(`${BASE_URL}/api/admin/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response from server:', response.data);

      setProducts(response.data.products);
      setCategories(response.data.categories);
      setItemTypes(response.data.itemTypes);
      setBrands(response.data.brands);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleProductStatus = async (id, isEnabled) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        {
          isActive: isEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`Product ${id} is ${isEnabled ? 'enabled' : 'disabled'}`);

      setProducts(products.map((product) => (product._id === id ? response.data : product)));
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

  return (
    <div>
      <h1>Manage Products</h1>
      <div>
        {/* Filter by Category */}
        <label htmlFor="filterCategory">Filter by Category:</label>
        <select
          id="filterCategory"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Filter by Item Type */}
        <label htmlFor="filterItemType">Filter by Item Type:</label>
        <select
          id="filterItemType"
          value={filterItemType}
          onChange={(e) => setFilterItemType(e.target.value)}
        >
          <option value="">All Item Types</option>
          {itemTypes.map((itemType) => (
            <option key={itemType._id} value={itemType._id}>
              {itemType.name}
            </option>
          ))}
        </select>

        {/* Filter by Brand */}
        <label htmlFor="filterBrand">Filter by Brand:</label>
        <select
          id="filterBrand"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

       <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Discount</th>
            <th>Category</th>
            <th>Item Type</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.discount}</td>
              <td>{getCategoryName(product.category)}</td>
              <td>{getItemTypeName(product.itemType)}</td>
              <td>{getBrandName(product.brand)}</td>
              <td>
                <input
                  type="checkbox"
                  checked={product.isActive}
                  onChange={(e) => toggleProductStatus(product._id, e.target.checked)}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/add-product">Add Product</Link>
    </div>
  );
};

export default AdminManageProducts;