import  getUserIdFromToken  from '../utility/auth';
import axiosInstance  from './axios.jsx';

const organizerDashboardService = {
    async getOrganizerDashboardStats() {
      try {
        const id = getUserIdFromToken();
       console.log("testt",id);
        // Simulate API calls
        const [ revenueResponse, eventsResponse, bookingResponse] = await Promise.all([
          
          axiosInstance.get(`/reports/revenue/${id}`), 
          axiosInstance.get(`/reports/list/${id}`), 
          axiosInstance.get(`/reports/booking/${id}`) 
          
          
        ]);
  

        // Transform the data
        console.log("eventresponse",eventsResponse);
        const totalRevenue = revenueResponse.data.totalRevenue;
        const totalEvents = eventsResponse.data.eventCount;
        const totalBookings = bookingResponse.data.totalBookings;
        //console.log("totalUsers",totalUsers);
        //console.log("totalRevenue",totalRevenue);
        console.log("totalEvents",totalEvents);
        //console.log("total bookings",totalBookings);
        // Access the 'events' array properly
       
        return {
          
          totalRevenue,
          totalEvents,
          totalBookings
          
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to fetch dashboard data');
      }
    },
  };
  
  export default organizerDashboardService;