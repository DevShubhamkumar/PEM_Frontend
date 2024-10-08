import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaTimes, FaSearch } from 'react-icons/fa';
import { BASE_URL } from '../api';

const SellerManageProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ category: '', itemType: '', brand: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    discount: '',
    category: '',
    itemType: '',
    brand: '',
    images: [],
  });
  const [expandedFields, setExpandedFields] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/seller/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery('sellerData', fetchData, {
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 hour
  });

  const deleteProductMutation = useMutation(
    async (id) => {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sellerData');
      },
    }
  );

  const updateProductMutation = useMutation(
    async (updatedProduct) => {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/products/${updatedProduct.get('_id')}`,
        updatedProduct,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData('sellerData', (oldData) => ({
          ...oldData,
          products: oldData.products.map((product) =>
            product._id === data._id ? data : product
          ),
        }));
        handleCancelEdit();
      },
    }
  );

  const handleUpdate = useCallback((e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== '' && key !== 'images') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append existing images
    existingImages.forEach((image) => {
      formDataToSend.append('existingImages', image);
    });

    // Append images to delete
    imagesToDelete.forEach((image) => {
      formDataToSend.append('imagesToDelete', image);
    });

    // Append new images
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image) => {
        if (image instanceof File) {
          formDataToSend.append('newImages', image);
        }
      });
    }

    // Append the product ID
    formDataToSend.append('_id', editingProduct._id);

    updateProductMutation.mutate(formDataToSend);
  }, [formData, existingImages, imagesToDelete, editingProduct, updateProductMutation]);

  const handleDelete = async (id) => {
    deleteProductMutation.mutate(id);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      discount: product.discount || '',
      category: product.category?._id || '',
      itemType: product.itemType?._id || '',
      brand: product.brand?._id || '',
      images: [],
    });
    setExistingImages(product.images || []);
    setImagePreview([]);
    setImagesToDelete([]);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      discount: '',
      category: '',
      itemType: '',
      brand: '',
      images: [],
    });
    setImagePreview([]);
    setExistingImages([]);
    setImagesToDelete([]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFormData(prevData => ({
      ...prevData,
      images: [...prevData.images, ...files]
    }));
    setImagePreview(prevPreviews => [...prevPreviews, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prevPreviews => {
      const removedPreview = prevPreviews[index];
      if (removedPreview && removedPreview.preview) {
        URL.revokeObjectURL(removedPreview.preview);
      }
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagesToDelete(prev => [...prev, imageToRemove]);
  };

  const toggleExpand = (id, field) => {
    setExpandedFields(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field]
      }
    }));
  };

  const truncateString = (str, maxLength) => {
    if (!str) return '';
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  const renderExpandableText = (text, maxLength, id, field) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return expandedFields[id]?.[field] ? (
      <>
        {text}{' '}
        <span
          onClick={() => toggleExpand(id, field)}
          className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
        >
          (Show less)
        </span>
      </>
    ) : (
      <>
        {truncateString(text, maxLength)}{' '}
        <span
          onClick={() => toggleExpand(id, field)}
          className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
        >
          (Show more)
        </span>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error.message}</span>
      </div>
    );
  }

  const { products = [], categories = [], itemTypes = [], brands = [] } = data || {};

  const filteredProducts = products.filter(product => (
    (!filters.category || product.category?._id === filters.category) &&
    (!filters.itemType || product.itemType?._id === filters.itemType) &&
    (!filters.brand || product.brand?._id === filters.brand)
  ));

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Manage Your Products</h1>
          <p className="text-xl mb-8">Add, edit, and organize your product listings with ease.</p>
          <div className="flex space-x-4">
            <Link to="/seller/add-product" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300 inline-flex items-center">
              <FaPlus className="mr-2" /> Add New Product
            </Link>
            <button
              onClick={() => navigate('/seller/manage-categories')}
              className="bg-indigo-500 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-400 transition duration-300 inline-flex items-center"
            >
              Manage Categories
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Filter Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="category" className="mb-2 font-semibold text-gray-700">Category:</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="itemType" className="mb-2 font-semibold text-gray-700">Item Type:</label>
              <select
                id="itemType"
                name="itemType"
                value={filters.itemType}
                onChange={handleFilterChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Item Types</option>
                {itemTypes.map((itemType) => (
                  <option key={itemType._id} value={itemType._id}>{itemType.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="brand" className="mb-2 font-semibold text-gray-700">Brand:</label>
              <select
                id="brand"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    {/* Products Grid */}
    <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-64">
                  <img
                    src={product.images[0] || "https://via.placeholder.com/300x200"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 m-2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.category?.name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{truncateString(product.name, 30)}</h3>
                  <p className="text-gray-600 mb-4 h-20 overflow-y-auto">
                    {renderExpandableText(product.description, 100, product._id, 'description')}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300 flex items-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length > 8 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllProducts(!showAllProducts)}
                className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 inline-flex items-center"
              >
                {showAllProducts ? "Show Less" : "Show More"}
                <FaChevronDown className={`ml-2 transform ${showAllProducts ? "rotate-180" : ""} transition-transform duration-300`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 border w-full max-w-3xl shadow-lg rounded-lg bg-white">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h3>
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={24} />
            </button>
            <form onSubmit={handleUpdate} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Existing Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
              Add New Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {imagePreview.length > 0 && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Image Preview
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`New image ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManageProducts;