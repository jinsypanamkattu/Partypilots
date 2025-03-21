import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/slices/eventsSlice';
import EventCard from '../components/EventCard';
import Loader from '../components/Loaders';
import { Container, Typography, Grid, Box } from '@mui/material';

const EventListingPage = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.upcomingevents);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="text-center text-red-500 py-12">
        <p>Failed to load events. Please try again later.</p>
        <button
          onClick={() => dispatch(fetchEvents())}
          className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const eventList = events;

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 0,
      position: 'relative',
      borderRadius: '8px',
    }}>
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '2px 2px 10px rgba(0, 0, 0, 0.4)',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          Explore Events
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {eventList.length > 0 ? (
            eventList.map((event, index) => (
              <Grid item key={event.id || index} xs={12} sm={6} md={3}>
                <EventCard event={event} index={index} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ color: '#fff', mt: 4 }}>
              No events available. Check back later! 🚀
            </Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default EventListingPage;

