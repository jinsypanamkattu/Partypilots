// services/axios.js
import axios from "axios";


const instance = axios.create({
   // baseURL: 'https://partypilot-rb4j.onrender.com/api',
   baseURL: 'http://localhost:5005/api',
    headers: { 'Content-Type': 'application/json' },
  });


// Add a request interceptor to attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or wherever you store the token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token expired or unauthorized — logging out');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Or use navigate('/login') in React Router
    }
    return Promise.reject(error);
  }
);


export default instance;
