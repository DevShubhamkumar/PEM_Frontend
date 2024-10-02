import React, { createContext, useReducer, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  authCheckComplete: false, 
  searchTerm: '',
  searchResults: { categories: [], products: [] },
  categoryInfo: null,
  categoriesPage: 1,
  cart: [],
  users: [],
  products: [],
  categories: [],
  itemTypes: [],
  brands: [],
  orders: [],
  profileImage: null,
  categoryProducts: {},
  currentProduct: null,
  productComments: [],
  relatedProducts: [],

};

function appReducer(state, action) {
  switch (action.type) {
    case 'AUTH_CHECK_START':
      return { ...state, loading: true, authCheckComplete: false };
    case 'AUTH_CHECK_COMPLETE':
      return { ...state, loading: false, authCheckComplete: true };
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, cart: [] };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, loading: false, error: null };
    case 'SET_CATEGORY_INFO':
      return { ...state, categoryInfo: action.payload };
    case 'SET_CATEGORIES_PAGE':
      return { ...state, categoriesPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(item => item._id === action.payload._id);
      if (existingItemIndex !== -1) {
        const updatedCart = state.cart.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: action.payload.quantity } : item
        );
        return { ...state, cart: updatedCart };
      } else {
        return { ...state, cart: [...state.cart, action.payload] };
      }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item._id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_ITEM_TYPES':
      return { ...state, itemTypes: action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'UPDATE_PROFILE_IMAGE':
      return { ...state, profileImage: action.payload };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload)
      };
    case 'SET_CATEGORY_PRODUCTS':
      return {
        ...state,
        categoryProducts: {
          ...state.categoryProducts,
          [action.payload.categoryId]: action.payload.products,
        },
      };
      case 'SET_CURRENT_PRODUCT':
        return { ...state, currentProduct: action.payload };
      case 'SET_PRODUCT_COMMENTS':
        return { ...state, productComments: action.payload };
      case 'SET_RELATED_PRODUCTS':
        return { ...state, relatedProducts: action.payload };
      default:
        return state;
    }
  }
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const categoriesCache = useRef(null);
  const categoriesPromise = useRef(null);
  const searchCache = useRef({});
  const userProfileCache = useRef(null);
  const usersCache = useRef(null);
  const reportsCache = useRef(null);
  const sellerDataCache = useRef(null);
  const sellerDataPromise = useRef(null);
  
  const verifyTokenAndFetchUser = useCallback(async () => {
    dispatch({ type: 'AUTH_CHECK_START' });
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (!token || !userId) {
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'AUTH_CHECK_COMPLETE' });
      return;
    }
  
    try {
      const response = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { ...response.data, role: response.data.userType }
        });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Error verifying token and fetching user data:', error);
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'AUTH_CHECK_COMPLETE' });
    }
  }, []);
  
  const login = useCallback(async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, credentials);
      const { token, userType, userData } = response.data;
      
      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userType);
        localStorage.setItem('userId', userData._id);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { ...userData, role: userType } });
        return { ...userData, role: userType };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message || error.message });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  }, []);

  useEffect(() => {
    verifyTokenAndFetchUser();
  }, [verifyTokenAndFetchUser]);

  const setSearchTerm = useCallback((term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const setCategoriesPage = useCallback((page) => {
    dispatch({ type: 'SET_CATEGORIES_PAGE', payload: page });
  }, []);

  const fetchCategories = useCallback(async () => {
    if (categoriesCache.current) {
      dispatch({ type: 'SET_CATEGORIES', payload: categoriesCache.current });
      return categoriesCache.current;
    }

    if (categoriesPromise.current) {
      return categoriesPromise.current;
    }

    categoriesPromise.current = axios.get(`${BASE_URL}/api/categories`)
      .then(response => {
        categoriesCache.current = response.data;
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
        categoriesPromise.current = null;
        return response.data;
      })
      .catch(error => {
        categoriesPromise.current = null;
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
        throw error;
      });

    return categoriesPromise.current;
  }, []);
  
  const fetchProductDetails = useCallback(async (productId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('token');
      const [productResponse, commentsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/products/${productId}/comments`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const processedProduct = {
        ...productResponse.data.product,
        images: productResponse.data.product.images.map(image => 
          image.startsWith('http') ? image : `${BASE_URL}/${image}`
        )
      };

      dispatch({ type: 'SET_CURRENT_PRODUCT', payload: processedProduct });
      dispatch({ type: 'SET_PRODUCT_COMMENTS', payload: commentsResponse.data });

      // Fetch related products
      const relatedProductsResponse = await axios.get(`${BASE_URL}/api/products/${productId}/related`, { headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: 'SET_RELATED_PRODUCTS', payload: relatedProductsResponse.data });

    } catch (error) {
      console.error('Error fetching product details:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch product details' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addComment = useCallback(async (productId, comment, rating) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/comments`,
        { productId, text: comment, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: 'SET_PRODUCT_COMMENTS', payload: [...state.productComments, response.data] });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, [state.productComments]);

  const reactToComment = useCallback(async (commentId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/comments/${commentId}/react`,
        { action },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      
      const updatedComments = state.productComments.map(comment => 
        comment._id === commentId 
          ? { ...comment, likeCount: response.data.likeCount, dislikeCount: response.data.dislikeCount }
          : comment
      );
      
      dispatch({ type: 'SET_PRODUCT_COMMENTS', payload: updatedComments });
      return response.data;
    } catch (error) {
      console.error('Error reacting to comment:', error);
      throw error;
    }
  }, [state.productComments]);

  const performSearch = useCallback(async (query, categoryId = null) => {
    const cacheKey = `${query}-${categoryId || ''}`;
  
    if (searchCache.current[cacheKey]) {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: searchCache.current[cacheKey] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      let url = `${BASE_URL}/api/search?q=${query}`;
      if (categoryId) {
        url += `&category=${categoryId}`;
      }

      const response = await axios.get(url);
      searchCache.current[cacheKey] = response.data;
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data });

      if (categoryId) {
        const categoryResponse = await axios.get(`${BASE_URL}/api/categories/${categoryId}`);
        dispatch({ type: 'SET_CATEGORY_INFO', payload: categoryResponse.data });
      } else {
        dispatch({ type: 'SET_CATEGORY_INFO', payload: null });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch search results. Please try again.' });
      console.error('Search error:', error);
    }
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: { categories: [], products: [] } });
    dispatch({ type: 'SET_CATEGORY_INFO', payload: null });
  }, []);

  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const fetchUserProfile = useCallback(async () => {
    if (userProfileCache.current) {
      dispatch({ type: 'SET_USER', payload: userProfileCache.current });
      return userProfileCache.current;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) {
        throw new Error('User ID or token not found');
      }

      const response = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      userProfileCache.current = response.data;
      dispatch({ type: 'SET_USER', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch user profile' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateUserProfile = useCallback(async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userType = localStorage.getItem('userRole');
      const endpoint = userType === 'admin' 
        ? `${BASE_URL}/api/admin/profile` 
        : `${BASE_URL}/api/sellers/${userId}/profile`;
      
      const response = await axios.put(
        endpoint,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      dispatch({ type: 'SET_USER', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message || 'Failed to update user profile' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);
  
  const fetchUsers = useCallback(async () => {
    if (usersCache.current) {
      return usersCache.current;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      usersCache.current = response.data;
      dispatch({ type: 'SET_USERS', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch users' });
      throw error;
    }
  }, []);
  
  const fetchAdminReports = useCallback(async () => {
    if (reportsCache.current) {
      return reportsCache.current;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
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

      const reports = responses.reduce((acc, response, index) => {
        const key = endpoints[index].replace(/-/g, '_');
        acc[key] = response.data.count;
        return acc;
      }, {});

      reportsCache.current = reports;
      dispatch({ type: 'SET_LOADING', payload: false });
      return reports;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch admin reports' });
      throw error;
    }
  }, []);

  const fetchAdminData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/admin/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'SET_PRODUCTS', payload: response.data.products });
      dispatch({ type: 'SET_CATEGORIES', payload: response.data.categories });
      dispatch({ type: 'SET_ITEM_TYPES', payload: response.data.itemTypes });
      dispatch({ type: 'SET_BRANDS', payload: response.data.brands });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'SET_ORDERS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    
  }, []);
  
  
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/orders/status`,
        { orderId, deliveryStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        dispatch({
          type: 'SET_ORDERS',
          payload: state.orders.map((order) =>
            order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
          ),
        });
        return response.data;
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.orders]);
  
  const deleteProduct = useCallback(async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: 'DELETE_PRODUCT',
        payload: productId,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const toggleProductStatus = useCallback(async (productId, isActive) => {
    try {
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
      
      if (response.status === 200) {
        dispatch({
          type: 'UPDATE_PRODUCT',
          payload: response.data,
        });
        return response.data;
      } else {
        throw new Error('Failed to update product status');
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const fetchCategoryProducts = useCallback(async (categoryId) => {
    if (state.categoryProducts[categoryId]) {
      return state.categoryProducts[categoryId];
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products?category=${categoryId}`);
      const products = await Promise.all(
        response.data.map(async (product) => {
          const commentsResponse = await axios.get(`${BASE_URL}/api/products/${product._id}/comments`);
          const comments = commentsResponse.data;
          const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length || 0;
          const totalRatingsCount = comments.length;

          const images = product.images && product.images.length > 0
            ? product.images.map(image => 
                image ? (image.startsWith('http') ? image : `${BASE_URL}/${image}`) : null
              ).filter(Boolean)
            : [];

          return {
            ...product,
            images,
            totalRating,
            totalRatingsCount,
          };
        })
      );

      dispatch({
        type: 'SET_CATEGORY_PRODUCTS',
        payload: { categoryId, products },
      });

      return products;
    } catch (error) {
      console.error('Error fetching category products:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch category products' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.categoryProducts]);
  const fetchSellerData = useCallback(async () => {
    if (sellerDataCache.current) {
      return sellerDataCache.current;
    }

    if (sellerDataPromise.current) {
      return sellerDataPromise.current;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    sellerDataPromise.current = axios.get(`${BASE_URL}/api/seller/data`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(response => {
        sellerDataCache.current = response.data;
        dispatch({ type: 'SET_PRODUCTS', payload: response.data.products || [] });
        dispatch({ type: 'SET_CATEGORIES', payload: response.data.categories || [] });
        dispatch({ type: 'SET_ITEM_TYPES', payload: response.data.itemTypes || [] });
        dispatch({ type: 'SET_BRANDS', payload: response.data.brands || [] });
        dispatch({ type: 'SET_LOADING', payload: false });
        sellerDataPromise.current = null;
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching seller data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch seller data' });
        dispatch({ type: 'SET_LOADING', payload: false });
        sellerDataPromise.current = null;
        throw error;
      });

    return sellerDataPromise.current;
  }, []);

const updateProduct = useCallback(async (productId, formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${BASE_URL}/api/products/${productId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: response.data,
    });

    // Update the cache
    if (sellerDataCache.current) {
      sellerDataCache.current.products = sellerDataCache.current.products.map(product =>
        product._id === productId ? response.data : product
      );
    }

    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    dispatch({ type: 'SET_ERROR', payload: error.message });
    throw error;
  }
}, []);


  // const deleteProduct = useCallback(async (productId) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     await axios.delete(`${BASE_URL}/api/products/${productId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     dispatch({
  //       type: 'DELETE_PRODUCT',
  //       payload: productId,
  //     });

  //     // Update the cache
  //     if (sellerDataCache.current) {
  //       sellerDataCache.current.products = sellerDataCache.current.products.filter(product => product._id !== productId);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //     dispatch({ type: 'SET_ERROR', payload: error.message });
  //     throw error;
  //   }
  // }, []);
  const contextValue = useMemo(() => ({
    ...state,
    login,
    logout,
    verifyTokenAndFetchUser,
    setSearchTerm,
    setCategoriesPage,
    fetchCategories,
    performSearch,
    clearSearch,
    addToCart,
    removeFromCart,
    clearCart,
    fetchUserProfile,
    updateUserProfile,
    fetchUsers,
    fetchAdminReports,
    fetchAdminData,
    fetchOrders,
    updateOrderStatus,
    toggleProductStatus,
    deleteProduct,
    fetchCategoryProducts,
    fetchProductDetails,
    addComment,
    reactToComment,
    fetchSellerData,
    updateProduct,
  }), [
    state,
    login,
    logout,
    verifyTokenAndFetchUser,
    setSearchTerm,
    setCategoriesPage,
    fetchCategories,
    performSearch,
    clearSearch,
    addToCart,
    removeFromCart,
    clearCart,
    fetchUserProfile,
    updateUserProfile,
    fetchUsers,
    fetchAdminReports,
    fetchAdminData,
    fetchOrders,
    updateOrderStatus,
    toggleProductStatus,
    deleteProduct,
    fetchCategoryProducts,
    fetchProductDetails,
    addComment,
    reactToComment,
    fetchSellerData,
    updateProduct,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
export const useAppContext = () => useContext(AppContext);