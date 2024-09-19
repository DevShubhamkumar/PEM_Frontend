import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { BASE_URL } from '../api';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    discount: '',
    category: '',
    itemType: '',
    brand: '',
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const formData = new FormData();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [categoriesResponse, itemTypesResponse, brandsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/itemTypes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/brands`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategories(categoriesResponse.data);
      setItemTypes(itemTypesResponse.data);
      setBrands(brandsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  
  const validateInputs = (values) => {
    let errors = {};
    if (!values.name.trim()) errors.name = 'Name is required';
    if (!values.description.trim()) errors.description = 'Description is required';
    if (!values.price || values.price <= 0) errors.price = 'Price must be greater than zero';
    if (!values.stock || values.stock < 0) errors.stock = 'Stock cannot be negative';
    if (!values.category) errors.category = 'Category is required';
    if (!values.itemType) errors.itemType = 'Item Type is required';
    if (!values.brand) errors.brand = 'Brand is required';
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    // Append all product fields to formData
    Object.keys(product).forEach(key => {
      formData.append(key, product[key]);
    });

    // Append each image file to formData
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${BASE_URL}/api/products`, formData, config);

      console.log('Product addition response:', response.data);
      toast.success('Product added successfully');

      // Reset form
      setProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        discount: '',
        category: '',
        itemType: '',
        brand: '',
      });
      setImages([]);
    } catch (error) {
      console.error('Error adding product:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };
  


  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    setImages(files);
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories([...categories, response.data]);
      setNewCategory('');
      toast.success('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const handleCreateItemType = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/itemTypes`, { name: newItemType }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItemTypes(prevItemTypes => [...prevItemTypes, response.data.itemType || response.data]);
      setNewItemType('');
      toast.success('Item type created successfully');
    } catch (error) {
      console.error('Error creating item type:', error);
      toast.error('Failed to create item type');
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/brands`, { name: newBrand }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(prevBrands => [...prevBrands, response.data.brand || response.data]);
      setNewBrand('');
      toast.success('Brand created successfully');
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (type === 'categories') {
        setCategories(categories.filter(item => item._id !== id));
      } else if (type === 'itemTypes') {
        setItemTypes(itemTypes.filter(item => item._id !== id));
      } else if (type === 'brands') {
        setBrands(brands.filter(item => item._id !== id));
      }
      toast.success(`${type.slice(0, -1)} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${type.slice(0, -1)}:`, error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Failed to delete ${type.slice(0, -1)}`);
      }
    }
  };

  return (
    <div className="add-product-page w-full bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-down">Product Management</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Add and manage your products with ease</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="wave-bottom"></div>
      </section>
  
      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column: Categories, Item Types, and Brands sections */}
            <div className="space-y-8">
              {/* Categories Section */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Categories</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <button
                        onClick={() => handleDelete('categories', category._id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleCreateCategory} className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 flex items-center">
                    <PlusIcon size={20} className="mr-1" /> Add
                  </button>
                </form>
              </section>
  
              {/* Item Types Section */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Item Types</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {itemTypes.map((itemType) => (
                    <div key={itemType._id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm text-gray-700">{itemType.name}</span>
                      <button
                        onClick={() => handleDelete('itemTypes', itemType._id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleCreateItemType} className="flex gap-2">
                  <input
                    type="text"
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    placeholder="New item type"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 flex items-center">
                    <PlusIcon size={20} className="mr-1" /> Add
                  </button>
                </form>
              </section>
  
              {/* Brands Section */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Brands</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {brands.map((brand) => (
                    <div key={brand._id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm text-gray-700">{brand.name}</span>
                      <button
                        onClick={() => handleDelete('brands', brand._id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleCreateBrand} className="flex gap-2">
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="New brand"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 flex items-center">
                    <PlusIcon size={20} className="mr-1" /> Add
                  </button>
                </form>
              </section>
            </div>
  
            {/* Right column: Add New Product Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-indigo-600">Add New Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
  
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
  
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
  
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={product.stock}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                  </div>
                </div>
  
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={product.discount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
  
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
  
                <div>
                  <label htmlFor="itemType" className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                  <select
                    id="itemType"
                    name="itemType"
                    value={product.itemType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select an item type</option>
                    {itemTypes.map((itemType) => (
                      <option key={itemType._id} value={itemType._id}>
                        {itemType.name}
                      </option>
                    ))}
                  </select>
                  {errors.itemType && <p className="text-red-500 text-xs mt-1">{errors.itemType}</p>}
                </div>
  
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    id="brand"
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                </div>
  
                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{images.length} file(s) selected</p>
                      <ul className="list-disc list-inside">
                        {images.map((file, index) => (
                          <li key={index} className="text-sm text-gray-500">{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-500 text-white px-4 py-3 rounded-md hover:bg-indigo-600 transition duration-300 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
  
      {/* Why Choose Us Section */}
      <section className="why-choose-us py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">Why Manage Your Products with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard icon="📊" title="Easy Management" description="Streamline your product catalog with our intuitive management tools." />
            <FeatureCard icon="🚀" title="Boost Visibility" description="Increase your products' visibility with our optimized listing features." />
            <FeatureCard icon="📈" title="Sales Insights" description="Gain valuable insights into your product performance and sales trends." />
            <FeatureCard icon="🔒" title="Secure Platform" description="Rest easy knowing your product data is protected on our secure platform." />
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="cta bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-10">Start adding your products today and reach more customers than ever before!</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300"
          >
            Add Your First Product
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-5xl mb-6">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default AddProduct;