import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material';

const EventCard = ({ event, index }) => {
    const formatDate = (isoDate) => {
        return new Date(isoDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <Card
            sx={{
                maxWidth: 345,
                minHeight: 420, // Ensures uniform card height
                boxShadow: 3,
                borderRadius: 3,
                transition: '0.3s',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)',
                },
            }}
        >
            <CardMedia
                component="img"
                image={event.image || ''}
                alt={event.name}
                sx={{
                    height: '180px', // Fixed height for image
                    objectFit: 'cover',
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                {/* Serial Number */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold', color: '#6b21a8', marginBottom: '8px' }}
                >
                    #{index + 1}
                </Typography>

                {/* Fixed Title Height */}
                <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#6b21a8',
                        height: '48px', // Fixed height for title
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // Limit title to 2 lines
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {event.name}
                </Typography>

                {/* Description with Multi-line Truncation */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        height: '40px', // Fixed height for description
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // Limit description to 2 lines
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {event.description}
                </Typography>

                {/* Event Date */}
                <Typography variant="subtitle1" color="text.primary">
                    📅 <strong>Date:</strong> {event.start ? formatDate(event.start) : 'TBD'}
                </Typography>

                {/* Event Location */}
                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    sx={{
                        height: '24px', // Ensures consistent height
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', // Prevents text from wrapping
                        display: 'block',
                    }}
                >
                    📍 <strong>Location:</strong> {event.location || 'Online'}
                </Typography>
            </CardContent>

            {/* Button Aligned at the Bottom */}
            <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
            <Button
    component={Link}
    to={`/events/${event._id}`}
    variant="contained"
    sx={{
        background: 'linear-gradient(45deg, #38b2ac, #9ae6b4)', // Turquoise to Light Green
        color: '#fff',
        padding: '8px 24px',
        borderRadius: '50px',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            background: 'linear-gradient(45deg, #2c7a7b, #81e6d9)', // Darker hover effect
        },
    }}
>
    View Details
</Button>

            </CardActions>
        </Card>
    );
};

export default EventCard;
