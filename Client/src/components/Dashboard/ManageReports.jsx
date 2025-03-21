
// ReportDashboard.jsx
import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Tab, Tabs } from '@mui/material';
import BookingReports from './reports/BookingReports';
//import PaymentReports from './reports/PaymentReports';
import AttendeeReports from './reports/AttendeeReports';

const ReportDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
      Manage Reports
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs 
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Booking Reports" />
          <Tab label="" />
          <Tab label="Attendee Reports" />
        </Tabs>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
      {activeTab === 0 && <BookingReports />}
      {activeTab === 2 && <AttendeeReports />}
       
      </Box>
    </Container>
  );
};

export default ReportDashboard;

