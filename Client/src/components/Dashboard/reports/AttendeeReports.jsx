import axiosInstance from '../../../services/axios';
// AttendeeReports.jsx
import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, Grid, TextField, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, MenuItem, Box, Card, CardContent, 
  Divider, List, ListItem, ListItemText
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import { fetchEvents, fetchEventAttendees, getExportBooking } from "../../../services/reportService";
import { jwtDecode } from 'jwt-decode';


const AttendeeReports = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventDetails, setEventDetails] = useState({});
  const [attendees, setAttendees] = useState([]);
  const [summary, setSummary] = useState({
    totalAttendees: 0,
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [bookingTimelineData, setBookingTimelineData] = useState([]);




  useEffect(() => {
    // Fetch events for dropdown
     
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        let role, userId, res;
        if (token) {
            
               const decoded = jwtDecode(token);
               console.log(decoded);
               role = decoded.role;  // Assign values
               userId = decoded.id;
        }    
        console.log(role);
       if(role === "admin") {
        console.log("asda");
          res = await axiosInstance.get('/event/list');
       } else if(role === "organizer") {
        console.log("orgg");
          res = await axiosInstance.get(`/event/organizer/${userId}`);
        }
        console.log(res,"resr");
        if (res) {  // Ensure res is defined before using it
          setEvents(res.data);
  console.log("tesss");
          if (res.data.length > 0) {
              setSelectedEvent(res.data[0]._id);
              fetchAttendeeReport(res.data[0]._id);
          }
      }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchBookingTimeline = async () => {
      try {
          const response = await axiosInstance.get("/reports/timeline");
          setBookingTimelineData(response.data);
      } catch (error) {
          console.error("Error fetching booking timeline:", error);
      }
  };

  fetchBookingTimeline();

    fetchEvents();
  }, []);

  const fetchAttendeeReport = async (eventId = selectedEvent) => {
    console.log("first",eventId);
    if (!eventId) return;
    
    setLoading(true);
    try {
     // const res = await axiosInstance.get(`/api/reports/event-attendees/${eventId}`);
     const res = await fetchEventAttendees(eventId);
     console.log("front-end",res)
      setEventDetails(res.eventDetails);
      setAttendees(res.attendees);

      setSummary(res.summary);
    } catch (error) {
      console.error('Error fetching attendee report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
    fetchAttendeeReport(e.target.value);
  };

  const handleExportCSV = async () => {
    if (!selectedEvent) return;
    
    try {
      const reportType = "attendees";
      const res = await axiosInstance.get(`/reports/export/${reportType}?eventId=${selectedEvent}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendees_${eventDetails.name}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Data for occupancy chart
  const occupancyData = [
    { name: 'Occupied', value: summary.totalAttendees },
    { name: 'Available', value: eventDetails.capacity ? eventDetails.capacity - summary.totalAttendees : 0 }
  ];

  // Data for booking timeline (for demo purposes, we'll create sample data)
  // In a real app, this would come from the API
  /*const bookingTimelineData = Array.from({ length: 10 }, (_, i) => {
    const daysAgo = 9 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Generate a random number of bookings decreasing as we approach event date
    const randomBookings = Math.floor(Math.random() * 10) + (10 - daysAgo);
    
    return {
      date: dateString,
      bookings: randomBookings
    };
  });*/

  const COLORS = ['#0088FE', '#DDDDDD'];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Attendee Reports
      </Typography>

      {/* Event Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={10}>
            <TextField
              fullWidth
              select
              label="Select Event"
              value={selectedEvent}
              onChange={handleEventChange}
            >
              {events.map(event => (
                <MenuItem key={event._id} value={event._id}>
                  {event.name} - {formatDate(event.startDate)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              color="secondary"
              onClick={handleExportCSV}
              disabled={!selectedEvent}
            >
              Export List
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {selectedEvent && !loading && (
        <>
          {/* Event Details Card */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Name" 
                      secondary={eventDetails.name} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Venue" 
                      secondary={eventDetails.venue} 
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Start Date" 
                      secondary={formatDate(eventDetails.startDate)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="End Date" 
                      secondary={formatDate(eventDetails.endDate)} 
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Attendees
                  </Typography>
                  <Typography variant="h4">{summary.totalAttendees}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Bookings
                  </Typography>
                  <Typography variant="h4">{summary.totalBookings}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Occupancy Rate
                  </Typography>
                  <Typography variant="h4">
                    {summary.occupancyRate?.toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${summary.totalRevenue?.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300 }}>
                <Typography variant="h6" gutterBottom>
                  Capacity Utilization
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
           
          </Grid>

          {/* Attendees Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="attendees table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Booking Date</TableCell>
                    <TableCell align="right">Ticket Quantity</TableCell>
                    <TableCell>Booking ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.userId + attendee.bookingId}>
                      <TableCell>{attendee.name}</TableCell>
                      <TableCell>{attendee.email}</TableCell>
                      <TableCell>{attendee.phone || 'N/A'}</TableCell>
                      <TableCell>{new Date(attendee.bookingDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                      {attendee.tickets?.map(ticket => `${ticket.quantity} ${ticket.type}`).join(', ') || 'N/A'}
                      </TableCell>
                      <TableCell>{attendee.bookingId.substring(0, 8)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
      
      {selectedEvent && loading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Loading attendee data...</Typography>
        </Box>
      )}
      
      {!selectedEvent && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Please select an event to view attendee reports</Typography>
        </Box>
      )}
    </div>
  );
};

export default AttendeeReports;