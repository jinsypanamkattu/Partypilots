// services/eventService.js
import axiosInstance from './axios.jsx';
import getUserIdFromToken from '../utility/auth';
import { fetchEvents } from '@/redux/slices/eventsSlice.jsx';

const API_URL = "/event";  // Replace with your actual API URL

// Fetch all events
export const getEvent = async () => {
  try {
    const response = await axiosInstance.get(API_URL + '/list');
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};


export const getAdminEvent = async () => {
  try {
    const response = await axiosInstance.get(API_URL + '/adminEventlist');
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchEventName = async (eventId) => {
  try {
    //console.log("eventId",eventId);
    const response = await axiosInstance.get(`${API_URL}/name/${eventId}`);
   // console.log("frontresponse",response);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching event name:", error);
  }
}


  export const getAllOrganizerEvent = async (id) => {

    try {
      const id = getUserIdFromToken();
      //console.log("id",id);
      const response = await axiosInstance.get(`${API_URL}/organizer/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  };


  // Fetch a single event by its ID
  export const getEventById = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  };

  // Create a new event
  export const createEvents = async (eventData) => {
    try {
      const token = localStorage.getItem('token');
      //console.log(eventData);
      //console.log(token);
      //const response = await axiosInstance.post(API_URL+'/create', eventData);
      // Send data to your backend
      const response = await axiosInstance.post(API_URL + '/create', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  // Update an event
  export const updateEvents = async (id, eventData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(`${API_URL}/${id}`, eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };


  export const updateEventStatus = async (id, eventData) => {
    try {
      const token = localStorage.getItem('token');
      //console.log("service", eventData);
      const response = await axiosInstance.patch(`${API_URL}/${id}/status`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  // Delete an event
  export const deleteEvents = async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };
