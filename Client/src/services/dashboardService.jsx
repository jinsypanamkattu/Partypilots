import axiosInstance  from './axios.jsx';

const dashboardService = {
  async getDashboardStats() {
    try {
     
      // Simulate API calls
      const [usersResponse, revenueResponse, eventsResponse, bookingResponse, eventTotalResponse] = await Promise.all([
        axiosInstance.get('/user/list'),
        axiosInstance.get('/reports/revenue'), 
        axiosInstance.get('/event/list'), 
        axiosInstance.get('/reports/booking'), 
        axiosInstance.get('/reports/event-count'),
        
      ]);

      // Transform the data
      const totalUsers = usersResponse.data.length;
      const totalRevenue = revenueResponse.data.totalRevenue;
      const totalEvents = eventTotalResponse.data.totalEvents;
      const totalBookings = bookingResponse.data.totalBookings;
      //console.log("totalUsers",totalUsers);
      //console.log("totalRevenue",totalRevenue);
      //console.log("totalEvents",totalEvents);
      //console.log("total bookings",totalBookings);
      // Access the 'events' array properly
      const upcomingEvents = eventsResponse.data.map((event) => ({
        id: event._id,
        name: event.name,
        date: new Date(event.date).toLocaleDateString(),
        attendees: event.tickets.reduce((total, ticket) => total + ticket.sold, 0), // Sum up ticket sales
      }));


      return {
        totalUsers,
        totalRevenue,
        totalEvents,
        totalBookings,
        upcomingEvents,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  },
};

export default dashboardService;