import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Button, CircularProgress, Box, Slide, Fade, Zoom, Card, CardContent, Divider } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import axiosInstance from "../services/axios";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

//import { setBooking } from "../redux/slices/bookingsSlice"; // Ensure correct import


import { fetchBookingsById, setBooking } from '../redux/slices/bookingsSlice';
const ConfirmPayment = () => {
    const dispatch = useDispatch();

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [eventName, setEventName] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [stripeReady, setStripeReady] = useState(false);
    const [cardReady, setCardReady] = useState(false);
    const cardElementRef = useRef(null); // Store CardElement instance
    const [bookingId, setBookingId] = useState(null);

    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const stateBooking = location.state?.booking;
    const reduxBooking = useSelector((state) => state.bookings.selectedBooking);

    const booking = stateBooking || reduxBooking; // Prioritize stateBooking


    //const bookings = useSelector((state) => state.bookings);
    const bookings = (useSelector((state) => state.bookings) || booking);

    // const { eventId } = useParams();
    const navigate = useNavigate();

    let bookingDetails = bookings?.bookings?.booking;
    //console.log(bookingDetails ? "bookingDetails exists" : "bookingDetails is undefined");
    if (bookingDetails === undefined) {
        bookingDetails = bookings?.selectedBooking;

    }


    const bookingMessage = bookings?.bookings?.message;



    useEffect(() => {

        if (stripe && elements) {
            console.log("Stripe and Elements are ready.");
            setStripeReady(true);
        } else {
            console.warn("Waiting for Stripe.js and Elements to load...");
        }
    }, [stripe, elements]);

    const handlePayment = async () => {
        if (!stripe || !elements || !cardReady) {
            setPaymentError("Payment form is not fully loaded. Please wait and try again.");
            console.error("Stripe, Elements, or CardElement not ready:", { stripe: !!stripe, elements: !!elements, cardReady });
            return;
        }

        try {
            console.log("Payment handler triggered");
            setPaymentError('');
            setPaymentLoading(true);
            const bookingId = bookingDetails?._id || '';
            console.log("Booking ID:", bookingId);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login', { state: { message: 'Please log in to complete payment.' } });
                return;
            }

            const response = await axiosInstance.post(
                `/payments/create-payment-intent`,
                { amount: bookingDetails.totalPrice * 100, currency: 'usd', bookingId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { clientSecret } = response.data;
            console.log("Client Secret:", clientSecret);

            // Use the stored CardElement reference if available, otherwise fetch it
            let cardElement = cardElementRef.current;
            if (!cardElement) {
                cardElement = elements.getElement(CardElement);
                console.log("Fetched CardElement anew:", cardElement);
            }

            if (!cardElement) {
                setPaymentError("Card input is not available. Please try again.");
                console.error("CardElement is not mounted or found. Ref:", cardElementRef.current, "Fetched:", cardElement);
                setPaymentLoading(false);
                return;
            }

            console.log("Confirming card payment with clientSecret:", clientSecret);
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            console.log("Payment result:", result);

            if (result.error) {
                setPaymentError(result.error.message);
                console.error("Stripe Error:", result.error);
            } else if (result.paymentIntent.status === 'succeeded') {
                setPaymentSuccess(true);
                navigate('/payment-success');
                console.log("Payment Successful:", result.paymentIntent);
            }
        } catch (err) {
            console.error("Payment error:", err);
            setPaymentError('Failed to initiate payment. Please try again later.');
        } finally {
            setPaymentLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Container maxWidth="sm" sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Zoom in={true} timeout={1000}>
                <Typography
                    variant="h2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        color: '#789972', // Sage green color
                        mt: -2 // Moves the title slightly up
                    }}
                >
                    Confirm Payment
                </Typography>

            </Zoom>
            {bookingMessage && (
                <Typography color="success" sx={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {bookingMessage}
                </Typography>
            )}

            {bookingDetails ? (
                <Fade in={true} timeout={1500}>
                    <Card sx={{ width: '100%', maxWidth: '600px', marginBottom: '20px', boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Booking Details</Typography>
                            <Typography
                                variant="h5" // Increased font size
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1.75rem', // Adjust font size as needed
                                    background: 'linear-gradient(to right, #40E0D0, #789972)', // Turquoise to Sage Green
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                <strong>Event Name: </strong> {bookingDetails.eventName}
                            </Typography>

                            <Typography variant="body1"><strong>Booking Status:</strong> {bookingDetails.bookingStatus}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Tickets</Typography>
                            {bookingDetails.tickets && bookingDetails.tickets.length > 0 ? (
                                bookingDetails.tickets.map((ticket, index) => (
                                    <Box key={index} sx={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                                        <Typography variant="body1"><strong>Type:</strong> {ticket.type}</Typography>
                                        <Typography variant="body1"><strong>Quantity:</strong> {ticket.quantity}</Typography>

                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary">No tickets selected.</Typography>
                            )}
                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Total Price: ${bookingDetails.totalPrice.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Fade>
            ) : (
                <Typography color="error">No booking details found. Please try again.</Typography>
            )}

            {paymentError && (
                <Slide direction="up" in={true} timeout={1000}>
                    <Typography color="error" sx={{ marginBottom: '20px' }}>{paymentError}</Typography>
                </Slide>
            )}

            {paymentSuccess && (
                <Typography color="success" sx={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    Payment Successful! 🎉
                </Typography>
            )}

            <Box sx={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {stripeReady && bookingDetails && showButton && (
                    <Box sx={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', backgroundColor: '#fff' }}>
                        <CardElement
                            options={{
                                hidePostalCode: true,
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': { color: '#aab7c4' },
                                    },
                                    invalid: { color: '#9e2146' },
                                },
                            }}
                            onReady={(element) => {
                                console.log("CardElement mounted successfully!");
                                setCardReady(true);
                                cardElementRef.current = element; // Store the CardElement instance
                            }}
                            onChange={(e) => console.log("CardElement status:", e.complete ? "Complete" : "Incomplete", e)}
                        />
                    </Box>
                )}
                {paymentLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
                ) : (
                    stripeReady && bookingDetails && showButton && (
                        <Slide direction="up" in={true} timeout={1500}>
                            <Button
                                variant="contained"
                                onClick={handlePayment}
                                disabled={!stripe || !elements || !cardReady || paymentLoading}
                                sx={{
                                    padding: '10px 20px',
                                    fontSize: '1.1rem',
                                    width: '100%',
                                    maxWidth: '300px',
                                    background: 'linear-gradient(to right, #40E0D0, #789972)', // Turquoise Blue to Sage Green
                                    color: '#fff',
                                    transition: 'background 0.3s ease-in-out',
                                    '&:hover': {
                                        background: 'linear-gradient(to right, #38B2AC, #6B8E75)', // Slightly darker gradient on hover
                                    },
                                }}
                            >
                                Proceed to Payment
                            </Button>

                        </Slide>
                    )
                )}
            </Box>
            {!stripeReady && (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                    Waiting for Stripe to initialize...
                </Typography>
            )}
        </Container>
    );
};

export default ConfirmPayment;