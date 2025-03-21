// src/redux/slices/eventCalendarSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import { eventService } from '../../services/eventService';
import { getAdminEvent, getEventById, createEvents, updateEvents, deleteEvents, getAllOrganizerEvent,updateEventStatus  } from '../../services/eventService';




// Initial state
const initialState = {
  events: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get all events
export const getEvents = createAsyncThunk(
  'events/getAll',
  async (_, thunkAPI) => {
    try {
        const response = await getAdminEvent(); 
        //console.log("Data",response.data);
        return response.data; 
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Get all events
export const getOrganizerEvents = createAsyncThunk(
  'events/getOrganizerAll',
  async (_, thunkAPI) => {
    try {
        const response = await getAllOrganizerEvent(); 
        //console.log("Data",response.data);
        return response.data; 
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create event
export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData, thunkAPI) => {
    try {
      return await createEvents(eventData);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update event
export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, eventData }, thunkAPI) => {
    try {
      return await updateEvents(id, eventData);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update event
export const updateEventsStatus = createAsyncThunk(
  'events/statusUpdate',
  async ({ id, eventData }, thunkAPI) => {
    try {
      //console.log("slice",state);
      return await updateEventStatus(id, eventData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete event
export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, thunkAPI) => {
    try {
      await deleteEvents(id);
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Event slice
export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Get events
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.events = action.payload;
        //state.events = action.payload || [];
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get events
      .addCase(getOrganizerEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrganizerEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //console.log("action-payload",action.payload);
        //state.events = action.payload;
        //state.events = action.payload || [];
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getOrganizerEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
       // state.events.push(action.payload);
       state.events = [...state.events, action.payload];

      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = state.events.map(event => 
          event._id === action.payload._id ? action.payload : event
        );
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update event
      .addCase(updateEventsStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEventsStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = state.events.map(event => 
          event._id === action.payload._id ? action.payload : event
        );
      })
      .addCase(updateEventsStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        //console.log("sliceerror",action.payload);
      })
      
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = state.events.filter(event => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = eventSlice.actions;
export default eventSlice.reducer;