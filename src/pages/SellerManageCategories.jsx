import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../api';

const SellerManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/seller/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
  
    const formData = new FormData();
    formData.append('name', categoryName.trim());
    if (categoryImage) {
      formData.append('image', categoryImage, categoryImage.name);
      console.log('Appending image to FormData:', categoryImage.name);
    } else {
      console.log('No image selected');
    }
  
    // Log the contents of the FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
  
      console.log('Sending update request for category:', updatingCategory._id);
      const response = await axios.put(
        `${BASE_URL}/api/categories/${updatingCategory._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Server response:', response.data);
  
      if (response.data && response.data._id) {
        setCategories(prevCategories => 
          prevCategories.map(category =>
            category._id === response.data._id ? response.data : category
          )
        );
  
        setSuccessMessage('Category updated successfully');
        setIsUpdating(false);
        setUpdatingCategory(null);
        setCategoryName('');
        setCategoryImage(null);
        setImagePreview(null);
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while updating the category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = (category) => {
    setIsUpdating(true);
    setUpdatingCategory(category);
    setCategoryName(category.name);
    setImagePreview(category.categoryImage);
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setUpdatingCategory(null);
    setCategoryName('');
    setCategoryImage(null);
    setImagePreview(null);
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('New file selected:', file.name);
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      console.log('No file selected');
      setCategoryImage(null);
      setImagePreview(null);
    }
  };

  const renderCategoryImage = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('http')) {
      const cacheBuster = Date.now();
      return <img 
        src={`${imageUrl}?v=${cacheBuster}`} 
        alt="Category" 
        className="w-12 h-12 rounded-full object-cover" 
        onError={(e) => {
          console.error('Error loading image:', imageUrl);
          e.target.src = '/placeholder.svg';
        }}
      />;
    }
    return <div className="w-12 h-12 bg-gray-300 rounded-full"></div>;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Manage Categories</h1>
          <p className="text-xl mb-8">Add, edit, and organize your product categories with ease.</p>
          <button
            onClick={() => handleUpdateCategory({ _id: 'new', name: '', categoryImage: '' })}
            className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300 inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Category
          </button>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>

      <section className="py-12 bg-white shadow-md">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <strong className="font-bold">Error:</strong> {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
              {successMessage}
            </div>
          )}

          {isUpdating ? (
            <form onSubmit={handleUpdateSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="flex justify-center">
                {imagePreview && <img src={imagePreview} alt="Category preview" className="w-24 h-24 rounded-full object-cover" />}
              </div>
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                  placeholder="Category Name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">
                  Category Image
                </label>
                <input
                  id="categoryImage"
                  type="file"
                  onChange={handleCategoryImageChange}
                  accept="image/*"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelUpdate}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category._id} className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {renderCategoryImage(category.categoryImage)}
                    <span className="ml-4 font-medium text-gray-800">{category.name}</span>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleUpdateCategory(category)}
                      className="text-indigo-500 hover:text-indigo-700 focus:outline-none"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 focus:outline-none">
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SellerManageCategories;