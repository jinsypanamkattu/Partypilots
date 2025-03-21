

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService'; // Import your axios instance

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      // Call the userService method
      //alert("aspi");
      //console.log('Login request payload:', { email, password, role });

      const response = await userService.login(email, password, role);
     //console.log("Login response"+JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      //console.log('Login error payload:', error.response?.data);
      // Custom error payload
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed.Please try again.',
        status: error.response?.status,
        timestamp: Date.now()
      });
    }
  }
);
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
      try {
          const response = await userService.getProfile(); // No ID needed, token is sent via headers
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
      }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('token'), status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
       
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        //console.log('Fulfilled Payload:', action.payload);
        //console.log('Token property:', action.payload.token);
        //console.log('Before state update:', { ...state });
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        state.status = 'succeeded';
       // console.log('Afdter state update:', { ...state });
        // Store token in localStorage
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        // Access the custom error payload

        state.error = action.payload?.message || 'Unknown error';
        state.errorDetails = action.payload;
        console.log("actionpayload",action.payload.message);
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
    })
    .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
    })
    .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
