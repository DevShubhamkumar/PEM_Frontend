import React, { createContext, useReducer, useContext, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  searchTerm: '',
  categoriesPage: 1,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_CATEGORIES_PAGE':
      return { ...state, categoriesPage: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const categoriesCache = useRef(null);
  const categoriesPromise = useRef(null);

  const fetchCategories = useCallback(async () => {
    if (categoriesCache.current) {
      return categoriesCache.current;
    }

    if (categoriesPromise.current) {
      return categoriesPromise.current;
    }

    categoriesPromise.current = axios.get(`${BASE_URL}/api/categories`)
      .then(response => {
        categoriesCache.current = response.data;
        categoriesPromise.current = null;
        return response.data;
      })
      .catch(error => {
        categoriesPromise.current = null;
        throw new Error('Failed to fetch categories');
      });

    return categoriesPromise.current;
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

  const setSearchTerm = useCallback((term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const setCategoriesPage = useCallback((page) => {
    dispatch({ type: 'SET_CATEGORIES_PAGE', payload: page });
  }, []);

  const contextValue = useMemo(() => ({
    ...state,
    login,
    logout,
    setSearchTerm,
    setCategoriesPage,
    fetchCategories,
  }), [state, login, logout, setSearchTerm, setCategoriesPage, fetchCategories]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);