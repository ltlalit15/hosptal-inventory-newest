import axios from 'axios';
import BaseUrl from './BaseUrl';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL:BaseUrl,
});

// Request Interceptor to attach the token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 