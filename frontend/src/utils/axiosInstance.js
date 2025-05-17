import axios from 'axios';

// Create Axios instance with base config
const instance = axios.create({
  baseURL: 'https://expensetrackers-84pv.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Uncomment to handle 401 unauthorized errors globally
/*
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Or navigate using React Router
    }
    return Promise.reject(error);
  }
);
*/

export default instance;
