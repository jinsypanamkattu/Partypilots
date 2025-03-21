// BookingReports.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, MenuItem, Box, Card, CardContent
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import axiosInstance from '../../../services/axios';
import { fetchEvents, fetchBookingQuery, getExportBooking } from "../../../services/reportService";
import { jwtDecode } from 'jwt-decode';



const BookingReports = () => {
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({
    totalBookings: 0,
    totalTickets: 0,
    totalRevenue: 0,
    statusCounts: {}
  });
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    eventId: '',
    status: ''
  });

  useEffect(() => {
    const fetchEventList = async () => {
      try {
        const token = localStorage.getItem('token');
        let role, userId, res;
        if (token) {

          const decoded = jwtDecode(token);
          
          role = decoded.role;  // Assign values
          userId = decoded.id;
        }

        if (role === "admin") {
         
          res = await fetchEvents();
        } else if (role === "organizer") {
          
          res = await axiosInstance.get(`/event/organizer/${userId}`);
        }
        if (res?.data?.length > 0) {
          setEvents(res.data);
          setFilters(prevFilters => ({
            ...prevFilters,
            eventId: res.data[0]._id,  // Auto-select the first event
          }));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]); // Set to an empty array in case of error
      }
    };

    fetchEventList();
    fetchBookingReport();
  }, []);
  useEffect(() => {
    if (filters.eventId) {
      fetchBookingReport(); // Fetch bookings when eventId is set
    }
  }, [filters.eventId]);

  const fetchBookingReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.eventId) params.append('eventId', filters.eventId);
      if (filters.status) params.append('status', filters.status);
      ////console.log("params",params);

      const res = await axiosInstance.get(`/reports/bookings?${params.toString()}`);
      //console.log("resr",res);
      setBookings(res.data.bookings || []);
      setSummary(res.data.summary || { totalBookings: 0, totalTickets: 0, totalRevenue: 0, statusCounts: {} });
    } catch (error) {
      console.error('Error fetching booking report:', error);
      setSummary({ totalBookings: 0, totalTickets: 0, totalRevenue: 0, statusCounts: {} });
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleExportCSV = async () => {
    try {
      console.log("exportcsv entered");
      const params = new URLSearchParams();
      if (filters.startDate) params.append('start', filters.startDate);
      if (filters.endDate) params.append('end', filters.endDate);
      if (filters.eventId) params.append('eventId', filters.eventId);
      //const res = getExportBooking(params);
      //  console.log(params);
      const res = await getExportBooking(params);




      // Create download link
      //console.log("response", res.data)
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const statusChartData = summary?.statusCounts
    ? Object.entries(summary.statusCounts).map(([name, value]) => ({ name, value }))
    : [];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Booking Reports
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2.5}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={2.5}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={2.5}>
            <TextField
              fullWidth
              select
              label="Event"
              name="eventId"
              value={filters.eventId}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Events</MenuItem>
              {events?.length ? (
                events.map((event) => (
                  <MenuItem key={event._id} value={event._id}>
                    {event.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No events available</MenuItem>
              )}

            </TextField>
          </Grid>

          <Grid item xs={12} md={2.5}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={fetchBookingReport}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleExportCSV}
          >
            Export to CSV
          </Button>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">{summary?.totalBookings ?? 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tickets
              </Typography>
              <Typography variant="h4">{summary?.totalTickets ?? 0}</Typography>
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
                {summary?.totalRevenue?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Booking Value
              </Typography>
              <Typography variant="h4">
                ${summary?.totalBookings ? (summary.totalRevenue / summary.totalBookings).toFixed(2) : '0.00'}

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
              Booking Status Distribution
            </Typography>
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography align="center">No booking status data available.</Typography>
            )}

          </Paper>
        </Grid>

        {/* Additional charts would go here */}
      </Grid>

      {/* Bookings Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="bookings table">
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Tickets</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings?.length ? (
                bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking._id.substring(0, 8)}...</TableCell>
                    <TableCell>{booking.eventId?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.attendeeId?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          bgcolor: booking.bookingStatus === 'Confirmed' ? 'success.light' :
                            booking.bookingStatus === 'Cancelled' ? 'error.light' : 'warning.light',
                          color: 'white', p: 0.5, borderRadius: 1,
                          display: 'inline-block', textAlign: 'center', minWidth: 80
                        }}
                      >
                        {booking.bookingStatus}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {booking.tickets?.map(ticket => `${ticket.quantity} ${ticket.type}`).join(', ') || 'N/A'}
                    </TableCell>
                    <TableCell align="right">${booking.totalPrice?.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No bookings found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default BookingReports;