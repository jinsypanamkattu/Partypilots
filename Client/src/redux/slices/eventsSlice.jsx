import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEvent, getEventById } from '../../services/eventService';

// Async thunk for fetching events
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEvent();
      //console.log("data from db",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchEventDetails = createAsyncThunk(
  'events/fetchEventDetails',
  async ( eventId , { rejectWithValue }) => {
    try {
      console.log("eventid",eventId);
      const response = await getEventById(eventId);
      //console.log("data from db",response.data);
       // Filter out tickets with no availability
       const availableTickets = response.data.tickets.filter(ticket => 
        ticket.quantity > ticket.sold
    );
    return {
      ...response.data,
      tickets: availableTickets.length > 0 
          ? availableTickets 
          : []
  };
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const eventSlice = createSlice({
  name: 'upcomingevents',
  initialState: {
    events: [],
    eventDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Listing event detail
      .addCase(fetchEventDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.eventDetails = action.payload;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
