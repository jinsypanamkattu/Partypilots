// Bookings Slice (redux/slices/bookingsSlice.js)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createBookings, getUserBookings, getBookingById, cancelBookingById } from "../../services/bookingService";



export const cancelBooking = createAsyncThunk("bookings/cancelBooking", async (bookingId) => {


  const response = await cancelBookingById(bookingId);
  //console.log("respoinseSlice",response.data);
  return response.data;
  //const response = await axiosinstance.delete("/bookings");
  //return response.data;
});

export const fetchUserBookings = createAsyncThunk("bookings/fetchUserBookings", async (userId) => {
 //console.log("userIdslice",userId);
  const response = await getUserBookings(userId);
  //console.log("respoinseSlice",response.data);
  return response.data;
  
});


export const fetchBookingsById = createAsyncThunk("bookings/fetchBookingsById", async (bookingId) => {
  console.log("useslicerId",bookingId);
   const response = await getBookingById(bookingId);
   console.log("bookingSlice",response.data);
   return response.data;
   
 });


export const createBooking = createAsyncThunk("booking/createbooking", async (bookingData, thunkAPI) => {
  try {
    //console.log("slice",bookingData);
    return await createBookings(bookingData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Booking Failed");
  }
  

});

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { bookings: [], loading: false, bookingDetails: null, status: 'idle', error: null },
  reducers: {
    setBooking: (state, action) => {
        state.selectedBooking = action.payload; // Manually set the booking
    },
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
       })
       .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        console.log(action.payload);
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
       })
       .addCase(fetchBookingsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingsById.fulfilled, (state, action) => {
        
        state.bookings = action.payload;
        state.selectedBooking = action.payload;
        //console.log("result",action.payload);
        state.loading = false;
      })
      .addCase(fetchBookingsById.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
              
       })
       .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        console.log(action.payload);
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
              
       });
  },
});
export const { setBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
