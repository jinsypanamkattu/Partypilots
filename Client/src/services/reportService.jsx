// src/services/reportService.js
import axiosInstance from './axios.jsx';
// Function to get all reports
export const getAllReports = async () => {
  try {
    const response = await fetch('/api/reports');  // Adjust the endpoint URL
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    const reports = await response.json();
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error('Error fetching reports');
  }
};


export const getExportBooking = async (params) => {
  try {
    const reportType = "bookings";
    const res = await axiosInstance.get(`/reports/export/${reportType}?${params.toString()}`, {
      responseType: 'blob'
    });
    console.log("service", res);
    return res;
  } catch (error) {
    console.error('Error fetching bookings: for export', error);
    throw new Error('Error fetching bookings for export');
  }


}
export const fetchBookingQuery = async (params) => {
  try {
    const res = await axiosInstance.get(`/reports/bookings?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Error fetching bookings');
  }
}
//const res = await axios.get(`/api/reports/bookings?${params.toString()}`);

export const fetchEvents = async () => {
  try {
    const res = await axiosInstance.get('/event/list/report');
    return res;

  } catch (error) {
    console.error('Error fetching events:', error);
  }
};


export const fetchEventAttendees = async (eventId) => {
  try {
    console.log("service",eventId);
    const response = await axiosInstance.get(`/reports/event-attendees/${eventId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    throw new Error('Error fetching event attendees');
  }
}


// Function to get a specific report by ID
export const getReportById = async (reportId) => {
  try {
    const response = await fetch(`/api/reports/${reportId}`);  // Adjust the endpoint URL
    if (!response.ok) {
      throw new Error(`Failed to fetch report with ID: ${reportId}`);
    }
    const report = await response.json();
    return report;
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    throw new Error('Error fetching report');
  }
};

// Function to create a new report
export const createReport = async (reportData) => {
  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      throw new Error('Failed to create report');
    }
    const newReport = await response.json();
    return newReport;
  } catch (error) {
    console.error('Error creating report:', error);
    throw new Error('Error creating report');
  }
};

// Function to update an existing report
export const updateReport = async (reportId, reportData) => {
  try {
    const response = await fetch(`/api/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update report with ID: ${reportId}`);
    }
    const updatedReport = await response.json();
    return updatedReport;
  } catch (error) {
    console.error(`Error updating report ${reportId}:`, error);
    throw new Error('Error updating report');
  }
};

// Function to delete a report
export const deleteReport = async (reportId) => {
  try {
    const response = await fetch(`/api/reports/${reportId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete report with ID: ${reportId}`);
    }
    return true;  // Return true if deletion was successful
  } catch (error) {
    console.error(`Error deleting report ${reportId}:`, error);
    throw new Error('Error deleting report');
  }
};
