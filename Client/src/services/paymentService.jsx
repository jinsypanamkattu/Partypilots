// services/paymentService.js
import axiosinstance from "./axios";
import getUserIdFromToken from "../utility/auth";

const API_URL = "/payments";  // Replace with your actual API URL

// Fetch all payments
export const getPayments = async () => {
  try {
    
    const response = await axiosinstance.get(`${API_URL}/adminListPayments`);
    return response;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const fetchOrganizerPayments = async() => {
  try {
    const userId = getUserIdFromToken();
    const response = await axiosinstance.get(`${API_URL}/organizer/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
}

// Create a new payment (e.g., for a Stripe payment)
export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(API_URL, paymentData);
    return response;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/status`, { status });
    return response;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// Fetch a single payment by its ID
export const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
};
