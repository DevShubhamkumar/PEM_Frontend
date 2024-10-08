import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { PlusIcon, TrashIcon, XIcon } from 'lucide-react';
import { BASE_URL } from '../api';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    aboutThisItem: '',
    price: '',
    stock: '',
    discount: '',
    category: '',
    itemType: '',
    brand: '',
    attributes: {},
  });
  const [images, setImages] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [errors, setError] = useState("");
  const [loading, setloading] = useState("");

  const queryClient = useQueryClient();

  // Fetch categories, item types, and brands
  const { data: categories = [] } = useQuery('categories', () => 
    axios.get(`${BASE_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.data)
  );

  const { data: itemTypes = [] } = useQuery('itemTypes', () => 
    axios.get(`${BASE_URL}/api/itemTypes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.data)
  );

  const { data: brands = [] } = useQuery('brands', () => 
    axios.get(`${BASE_URL}/api/brands`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => res.data)
  );

  // Mutations
  const addProductMutation = useMutation(
    (formData) => axios.post(`${BASE_URL}/api/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
    {
      onSuccess: () => {
        toast.success('Product added successfully');
        setProduct({
          name: '',
          description: '',
          aboutThisItem: '',
          price: '',
          stock: '',
          discount: '',
          category: '',
          itemType: '',
          brand: '',
          attributes: {},
        });
        setImages([]);
      },
      onError: (error) => {
        console.error('Error adding product:', error.response || error);
        toast.error(error.response?.data?.message || 'Failed to add product');
      },
    }
  );

  const createCategoryMutation = useMutation(
    (newCategory) => axios.post(`${BASE_URL}/api/categories`, { name: newCategory }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        setNewCategory('');
        toast.success('Category created successfully');
      },
      onError: (error) => {
        console.error('Error creating category:', error);
        toast.error('Failed to create category');
      },
    }
  );

  const createItemTypeMutation = useMutation(
    (newItemType) => axios.post(`${BASE_URL}/api/itemTypes`, { name: newItemType }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('itemTypes');
        setNewItemType('');
        toast.success('Item type created successfully');
      },
      onError: (error) => {
        console.error('Error creating item type:', error);
        toast.error('Failed to create item type');
      },
    }
  );

  const createBrandMutation = useMutation(
    (newBrand) => axios.post(`${BASE_URL}/api/brands`, { name: newBrand }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('brands');
        setNewBrand('');
        toast.success('Brand created successfully');
      },
      onError: (error) => {
        console.error('Error creating brand:', error);
        toast.error('Failed to create brand');
      },
    }
  );

  const deleteMutation = useMutation(
    ({ type, id }) => axios.delete(`${BASE_URL}/api/${type}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(variables.type);
        toast.success(`${variables.type.slice(0, -1)} deleted successfully`);
      },
      onError: (error) => {
        console.error(`Error deleting:`, error);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error(`Failed to delete`);
        }
      },
    }
  );

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAttributeAdd = () => {
    if (attributeKey && attributeValue) {
      setProduct({
        ...product,
        attributes: {
          ...product.attributes,
          [attributeKey]: attributeValue
        }
      });
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const handleAttributeRemove = (key) => {
    const newAttributes = { ...product.attributes };
    delete newAttributes[key];
    setProduct({ ...product, attributes: newAttributes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    Object.keys(product).forEach(key => {
      if (key === 'attributes') {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    });
  
    images.forEach((image) => {
      formData.append('images', image);
    });
  
    addProductMutation.mutate(formData);
  };
  
  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    setImages(files);
  }, []);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    createCategoryMutation.mutate(newCategory);
  };

  const handleCreateItemType = (e) => {
    e.preventDefault();
    createItemTypeMutation.mutate(newItemType);
  };

  const handleCreateBrand = (e) => {
    e.preventDefault();
    createBrandMutation.mutate(newBrand);
  };

  const handleDelete = (type, id) => {
    deleteMutation.mutate({ type, id });
  };

  return (
    <div className="add-product-page w-full bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <section className="hero relative bg-gradient-to-r rom-blue-600 to-purple-700 text-white py-20">

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
                <div>
                <label htmlFor="aboutThisItem" className="block text-sm font-medium text-gray-700 mb-1">About This Item</label>
                <textarea
                  id="aboutThisItem"
                  name="aboutThisItem"
                  value={product.aboutThisItem}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Provide additional details about this item..."
                ></textarea>
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
                 {/* Dynamic Attributes Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">Product Attributes</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={attributeKey}
                onChange={(e) => setAttributeKey(e.target.value)}
                placeholder="Attribute name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
                placeholder="Attribute value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAttributeAdd}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300"
              >
                <PlusIcon size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-gray-100 rounded-md p-2">
                  <span className="text-sm text-gray-700">{key}: {value}</span>
                  <button
                    type="button"
                    onClick={() => handleAttributeRemove(key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              ))}
            </div>
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