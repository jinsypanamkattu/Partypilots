import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventDetails } from '../redux/slices/eventsSlice';
import { createBooking } from '../redux/slices/bookingsSlice';
//import { createBooking } from '../services/bookingService';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loaders';
import { Container, Card, CardMedia, CardContent, Typography, Grid, Button, TextField, Alert } from '@mui/material';
import getUserIdFromToken from '../utility/auth';

const EventDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { eventId } = useParams();
    const { eventDetails, loading, error } = useSelector((state) => state.upcomingevents);
    const user = useSelector((state) => state.auth.user);


    //console.log("user",user);

    const [selectedTickets, setSelectedTickets] = useState({}); // To store selected ticket types and quantities
    const [bookingError, setBookingError] = useState('');
    const [quantityError, setQuantityError] = useState('');
    // const [booking, setBooking] = useState('');

    useEffect(() => {
        if (eventId) {
            dispatch(fetchEventDetails(eventId));
        }
    }, [dispatch, eventId]);

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="text-center text-red-500 py-12">
                <p>Failed to load event details. Please try again later.</p>
                <button
                    onClick={() => dispatch(fetchEventDetails(eventId))}
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const handleQuantityChange = (ticketType, value) => {
        const newQuantity = parseInt(value);
        const availableTickets = getAvailableTickets(ticketType);


        if (newQuantity < 1) {
            setSelectedTickets((prev) => ({ ...prev, [ticketType]: 1 }));
        } else if (newQuantity > availableTickets) {
            setQuantityError(`Only ${availableTickets} tickets available for ${ticketType}.`);
        } else {
            setQuantityError('');
            setSelectedTickets((prev) => ({ ...prev, [ticketType]: newQuantity }));
        }
    };

    const getAvailableTickets = (ticketType) => {
        const ticket = eventDetails?.tickets?.find((t) => t.type === ticketType);
        return ticket ? ticket.quantity - ticket.sold : 0;
    };

    const getTotalPrice = () => {
        return Object.keys(selectedTickets).reduce((total, ticketType) => {
            const ticket = eventDetails?.tickets?.find((t) => t.type === ticketType);
            if (ticket) {
                return total + ticket.price * selectedTickets[ticketType];
            }
            return total;
        }, 0);
    };

    const handleBookTicket = async () => {
        try {
            setBookingError('');

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login', { state: { message: 'Please log in to continue booking tickets.' } });
                return;
            }

            if (Object.keys(selectedTickets).length === 0) {
                setBookingError('Please select at least one ticket type.');
                return;
            }


            const attendeeIdUser = getUserIdFromToken();
            const attendeeId = user?._id || attendeeIdUser;
            if (!attendeeId) {

                //console.log("user",attendeeId);
                setBookingError('User not found. Please log in.');
                return;
            }

            const bookingData = {
                eventId,
                attendeeId,
                tickets: Object.keys(selectedTickets).map((ticketType) => ({
                    type: ticketType,
                    quantity: selectedTickets[ticketType],
                })),
                totalPrice: getTotalPrice(),
            };
            // console.log("Booking Payload", bookingData);
            const resultAction = await dispatch(createBooking(bookingData));
            //console.log("Booking Payload", resultAction);
            // console.log(booking,"test");
            if (createBooking.fulfilled.match(resultAction)) {
                navigate(`/confirmPayment`);
            } else {
                setBookingError('Booking failed. Please try again later.');
                console.error("Booking error:", resultAction.payload || resultAction.error);
            }

        } catch (err) {
            setBookingError('Failed to book tickets. Please try again.');
        }
    };

    if (!eventDetails) return <div className="text-center py-12">Event not found.</div>;

    return (
        <div className="min-h-screen py-12">
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
                     Event Details
                   </Typography>
           
            <Container maxWidth="lg">
                <Card className="shadow-lg rounded-lg overflow-hidden">
                    {eventDetails.image && (
                        <CardMedia
                            component="img"
                            height="400"
                            image={eventDetails.image}
                            alt={eventDetails.name || 'Event'}
                            className="object-cover transition-transform duration-500 transform hover:scale-105"
                        />
                    )}
                    <CardContent className="text-white">
                        <Typography
                            variant="h3"
                            component="h1"
                            className="font-black text-7xl text-center bg-gradient-to-r from-green-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-4"
                        >
                            {eventDetails.name}
                        </Typography>


                        <Typography variant="body1" color="textSecondary" paragraph className="text-lg text-gray-200 mb-4">
                            {eventDetails.description}
                        </Typography>
                        <Typography variant="h6" color="textPrimary" className="text-xl mb-2">
                            <strong>Date:</strong> {new Date(eventDetails.start).toLocaleString()}
                        </Typography>
                        <Typography variant="h6" color="textPrimary" className="text-xl mb-4">
                            <strong>Location:</strong> {eventDetails.location}
                        </Typography>

                        <Typography
                            variant="h4"
                            className="text-3xl font-semibold bg-gradient-to-r from-blue-400 via-purple-500 to-purple-700 bg-clip-text text-transparent mb-4"
                        >
                            Available Tickets
                        </Typography>


                        {eventDetails.tickets && eventDetails.tickets.length > 0 ? (
                            <Grid container spacing={3}>
                                {eventDetails.tickets.map((ticket, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <Card
                                            className={`cursor-pointer transition-transform transform hover:scale-105 ${selectedTickets[ticket.type] ? 'border-4 border-yellow-500' : 'border border-transparent'}`}
                                            onClick={() => {
                                                if (selectedTickets[ticket.type]) {
                                                    const newSelectedTickets = { ...selectedTickets };
                                                    delete newSelectedTickets[ticket.type];
                                                    setSelectedTickets(newSelectedTickets);
                                                } else {
                                                    setSelectedTickets((prev) => ({ ...prev, [ticket.type]: 1 }));
                                                }
                                            }}
                                            elevation={3}
                                        >
                                            <CardContent className="bg-gradient-to-r from-teal-400 via-cyan-500 to-purple-400 p-4 rounded-lg">
                                                <Typography variant="h5" component="div" className="text-white text-center">
                                                    {ticket.type}
                                                </Typography>
                                                <Typography color="textSecondary" className="text-center text-white">
                                                    Price: ${ticket.price}
                                                </Typography>
                                                <Typography color="textSecondary" className="text-center text-white">
                                                    Available: {ticket.quantity - ticket.sold}
                                                </Typography>
                                                {ticket.quantity - ticket.sold <= 0 && (
                                                    <Typography color="error" variant="body2" className="text-center text-white">
                                                        Sold Out
                                                    </Typography>
                                                )}
                                            </CardContent>

                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body1" color="textSecondary" className="text-center text-white">
                                No tickets available.
                            </Typography>
                        )}

                        {Object.keys(selectedTickets).length > 0 && (
                            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                                {Object.keys(selectedTickets).map((ticketType) => {
                                    const ticket = eventDetails.tickets.find((t) => t.type === ticketType);
                                    const availableTickets = getAvailableTickets(ticketType);
                                    return (
                                        <div key={ticketType} className="mb-6"> {/* Added class for spacing */}
                                            <TextField
                                                label={`${ticketType} Quantity`}
                                                type="number"
                                                variant="outlined"
                                                value={selectedTickets[ticketType]}
                                                onChange={(e) => handleQuantityChange(ticketType, e.target.value)}
                                                inputProps={{ min: 1 }}
                                                className="mb-4" // Increased spacing between text fields
                                                sx={{
                                                    width: '200px', // Custom width for TextField
                                                    '& .MuiInputLabel-root': {
                                                        fontSize: '1.25rem', // Increased font size for label
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '1.25rem', // Increased font size for input text
                                                    }
                                                }}
                                            />
                                            {quantityError && <Alert severity="error" className="mt-2">{quantityError}</Alert>}
                                        </div>
                                    );
                                })}

                                <Typography variant="h5" className="mt-4 text-lg font-semibold" color="textPrimary">
                                    Total Price: ${getTotalPrice().toFixed(2)}
                                </Typography>
                            </div>
                        )}

                        {bookingError && <Alert severity="error" className="mt-4">{bookingError}</Alert>}

                        <div className="mt-12">
                            <Button
                                onClick={handleBookTicket}
                                variant="contained"
                                size="large"
                                className="py-3 px-6 text-xl rounded-md transition-all duration-300 transform hover:scale-105 
                   bg-gradient-to-r from-green-300 via-teal-400 to-emerald-500 text-white 
                   hover:from-green-400 hover:via-teal-500 hover:to-emerald-600 mx-auto block"
                            >
                                Book Tickets
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </Container>
        </div>
    );
};

export default EventDetailPage;
