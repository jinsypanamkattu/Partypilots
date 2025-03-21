import axiosInstance from './axios.jsx';


//import axios from 'axios'; // Import your configured axios instance

const userService = {
  //export const login = async (credentials) => { ... };
  login: async (email, password, role) => {
    try {
      //console.log('Sending login request with:', { email, password });
      const response = await axiosInstance.post('/user/login', { email, password, role });
      //console.log('Login response:', response.data);
      return response.data;
      /*return {
        user: response.data.user, // Adjust based on actual API response
        token: response.data.token // Adjust based on actual API response
      };*/
    } catch (error) {
      //console.error('Login error response:', error.response);
      throw error.response?.data?.message || 'Login failed';
    }
  },

  contactFormSubmit: async(formData) => {
    try{
      //console.log("test",formData);
      const response = await axiosInstance.post('/contact', formData);
      //console.log("resp",response.data);
      return response.data;
    }catch (error){
      throw error.response?.data?.message || 'Message failed';
    }
  },

  forgotPasswordFormSubmit: async({email, role}) => {
    try{
      
      const response = await axiosInstance.post('/user/forgot-password',{ email, role });

      //console.log("resp",response.data);
      return response.data;
    }catch(error){
      //console.log("Message failed");
      //console.error("❌ API Call Failed!");
        //console.log("🔹 Full Error Object:", error);
        //console.log("🔹 Error Response:", error.response?.data);  // Backend response
        //console.log("🔹 Error Status Code:", error.response?.status);  // HTTP s
      //throw error.response?.data?.message || 'Message failed';
      // Instead of throwing, return the error message
      return { error: error.response?.data?.message || "Something went wrong" };
    }
  },

  verifyOtpForm: async({email, role, otp}) => {
    try{
      
      const response = await axiosInstance.post('/user/verify-otp',{ email, role, otp });

      //console.log("resp",response.data);
      return response.data;
    }catch(error){
      throw error.response?.data?.message || 'Message failed';
    }
  },

  

  resetPasswordForm: async({email, role, otp, newPassword}) => {
    try{
      
      const response = await axiosInstance.post('/user/reset-password',{ email, role, otp, newPassword });

      console.log("resp",response.data);
      return response.data;
    }catch(error){
     // throw error.response?.data?.message || 'Message failed';
     console.error("API error:", error);
    throw error; // Re-throw the error to be caught in the component
    }
  },





  getProfile: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.get('user/profile', {
        headers: { Authorization: `Bearer ${token}` },

      });
      return response;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users list';
    }
  },



  getUsers: async (token) => {
    try {
      const response = await axiosInstance.get('/user/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users list';
    }
  },

  getUserProfile: async (token) => {
    try {
      const response = await axiosInstance.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user profile';
    }
  },

  updateUserProfile: async (userData, token) => {
    try {
      const response = await axiosInstance.put('/users/profile', userData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },
};

export default userService;

