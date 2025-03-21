import { Container, Grid, Typography, Box } from '@mui/material';

export default function AboutPage() {
    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Grid container spacing={4} alignItems="center">
                {/* Left Side - Text */}
                <Grid item xs={12} md={7}> {/* Increased width */}
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            color: '#789972', // Sage green color
                            mt: -2 // Moves the title slightly up
                        }}
                    >
                        Welcome to PartyPilot
                    </Typography>


                    <Typography variant="h5" color="text.secondary" paragraph>
                        Your ultimate event management system designed to simplify the way you plan, organize, and manage events. From booking venues to tracking attendees, we provide a seamless experience to bring your dream events to life.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Whether you're hosting a small gathering or a grand celebration, PartyPilot's intuitive tools and real-time collaboration features help you stay on top of every detail. Empower your team, engage attendees, and create unforgettable moments — all in one platform.
                    </Typography>
                </Grid>

                {/* Right Side - Image */}
                <Grid item xs={12} md={5}> {/* Reduced width */}
                    <Box
                        component="img"
                        src="/assets/about.jpg"
                        alt="Event Management"
                        sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
