import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { EditProfileForm } from '../components/EditProfileForm';
import { BookingDetails } from '../components/BookingDetails';
import { Container, Typography, Button, Avatar, Box, Paper, Tab, Tabs, Alert, Snackbar } from '@mui/material';



export default function UserProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    // Get tab from URL query parameters
    const getTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') || 'profile';
    };

    const [activeTab, setActiveTab] = useState(getTabFromURL());
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setActiveTab(getTabFromURL());
    }, [location.search]); // Update tab when URL changes

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        navigate(`/profile?tab=${newValue}`); // Update URL when tab changes
    };

    // Callback function for profile update
    const handleProfileUpdate = () => {
        setSuccessMessage('Profile updated successfully!'); // Show success message
        setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h2"
                align="center"
                fontWeight="bold"
                gutterBottom
                sx={{ color: '#789972' }} // Sage green color
            >
                User Profile
            </Typography>


            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                {user?.profileImage && (
                    <Avatar
                        src={user.profileImage}
                        alt="Profile"
                        sx={{ width: 120, height: 120, mb: 2, boxShadow: 3 }}
                    />
                )}
                <Typography variant="h5" fontWeight="bold">
                    {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {user?.email}
                </Typography>
                {/* Success Message */}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

            </Box>

            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Edit Profile" value="profile" />
                    <Tab label="My Bookings" value="bookings" />
                </Tabs>

                <Box p={3}>
                    {activeTab === 'profile' && <EditProfileForm user={user} onProfileUpdate={handleProfileUpdate} />}
                    {activeTab === 'bookings' && <BookingDetails userId={user?._id} />}
                </Box>
            </Paper>
        </Container>
    );
}