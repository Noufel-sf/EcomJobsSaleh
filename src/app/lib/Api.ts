import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/Redux/store';
import { logout } from '@/Redux/slices/AuthSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://wadkniss-r6ar.onrender.com/api/v1';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with every request
  timeout: 15000, // 15 second timeout
});

// Request interceptor - add auth token to headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from cookies (Next.js will handle this)
    // The token is already included via withCredentials
    
    // Add custom headers for better security and tracking
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle token expiration (401)
    if (error.response?.status === 401) {
      console.warn('Unauthorized (401) - Token likely expired');
      
      // Dispatch logout action to clear auth state
      store.dispatch(logout());
      
      // Redirect to login on client side
      if (typeof window !== 'undefined') {
        // Delete auth token from cookies
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Redirect to login
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Handle forbidden (403) - insufficient permissions
    if (error.response?.status === 403) {
      console.warn('Forbidden (403) - Insufficient permissions');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
      
      return Promise.reject(error);
    }

    // Handle server errors (5xx)
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data);
    }

    // Log other errors for debugging
    if (error.config) {
      console.error('API Error:', {
        method: error.config.method?.toUpperCase(),
        url: error.config.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
