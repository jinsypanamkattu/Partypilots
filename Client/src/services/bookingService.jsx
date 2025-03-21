import axiosInstance from './axios.jsx';


const API_URL = "/booking";  // Replace with your actual API URL

// Fetch all bookings
export const fetchAllBookings = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/all`);
    return response;

  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};



// Fetch all bookings
export const fetchAllOrganizerBookings = async (userId) => {
  try {
    //console.log("userId", userId);
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get(`${API_URL}/organizer/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    //console.log("response", response);
    return response;

  } catch (error) {
    console.error("Error fetching bookings for this organizer", error.message);
    throw error;
  }
};


// Fetch a single booking by its ID
export const getBookingById = async (id) => {
  try {
    console.log("servicebookingidd",id);
    const response = await axiosInstance.get(`${API_URL}/book/${id}`);
    console.log("service",response.data);
    return response;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

// Fetch a single booking by its ID
export const getUserBookings = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/user/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};




// Create a new booking
export const createBookings = async (bookingData) => {
  try {
    console.log("service",bookingData);
    const response = await axiosInstance.post(`${API_URL}/create`, bookingData, {
      headers: {

        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Update a booking
export const updateBooking = async (id, bookingData) => {
  try {
    const response = await axiosInstance.put(`${API_URL} / ${id}`, bookingData);
    return response;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

// Cancel a booking



export const cancelBooking = async (bookingId, reason) => {
  try {
    console.log("Service - Booking ID:", bookingId);
    
    const token = localStorage.getItem("token");

    const response = await axiosInstance.post(
      `${API_URL}/${bookingId}/cancel`, // Corrected API endpoint
      { reason }, // Pass reason inside the body
      {
        headers: { Authorization: `Bearer ${token}` }, // Headers should be outside the body
      }
    );

    console.log("Service Response:", response);
    return response;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};


export const cancelBookingById = async (bookingId) => {
  try {
    console.log("Service - Booking ID:", bookingId);
    
    const token = localStorage.getItem("token");

    const response = await axiosInstance.post(
      `${API_URL}/cancelBookingByUser/${bookingId}`, // Corrected API endpoint
     
      {
        headers: { Authorization: `Bearer ${token}` }, // Headers should be outside the body
      }
    );

    console.log("Service Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};



// Optional: Add a helper function for error handling
export const handleBookingError = (error) => {
  // Centralized error handling logic
  if (error.response) {
    // The request was made and the server responded with a status code
    switch (error.response.status) {
      case 400:
        return 'Invalid booking details. Please check your information.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'You do not have permission to book these tickets.';
      case 404:
        return 'Event or ticket type not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.response.data.message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request
    return error.message || 'Error creating booking. Please try again.';
  }
};
