import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';
import organizerDashboardService from '../../services/organizerDashboardService';



// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'users/fetchDashboardData',
  async (_, thunkAPI) => {
    try {
      //alert('eee');
      return await dashboardService.getDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Async thunk for fetching dashboard data
export const fetchOrganizerDashboardData = createAsyncThunk(
  'users/fetchOrganizerDashboardData',
  async (_, thunkAPI) => {
    try {
      //alert('eee');
      
      //console.log("user",user);
      return await organizerDashboardService.getOrganizerDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardStats: {
      totalUsers: 0,
      totalEvents: 0,
      totalBookings: 0,
      totalRevenue: 0,
      upcomingEvents: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      builder
      .addCase(fetchOrganizerDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizerDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchOrganizerDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
