import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography
} from '@mui/material';

import userService from '../services/userService';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

const VerifyOTP = () => {

    const [otp, setOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || ""; // Get email from state
    const role = location.state?.role || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.verifyOtpForm({ email, role, otp });
            // await axiosInstance.post("/user/verify-otp", { email, role, otp });

            // Show success toast and delay navigation
            toast.success("OTP Verified! Proceed to reset password.", {
                autoClose: 2000, // Toast will auto-close after 2 seconds
                onClose: () => {
                    // Navigate after the toast is closed
                    navigate("/reset-password", { state: { email, role, otp } }); // Pass email and OTP to reset password page
                },
            });

            //toast.success("OTP Verified! Proceed to reset password.");
            //navigate("/reset-password", { state: { email, role, otp } }); // Pass email and OTP to reset password page
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        }
    };

    return (
        <>
            {/* Add ToastContainer here */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
            />

            <Paper
                elevation={3}
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '300px', // Setting a specific height
                    maxWidth: '400px',
                    margin: '0 auto',
                    justifyContent: 'space-between',
                    mt: 4,
                    mb: 4
                }}
            >
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    OTP Verification
                </Typography>

                <TextField
                    fullWidth
                    label="Enter OTP"
                    variant="outlined"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP"
                    sx={{ mb: 3 }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                        background: "linear-gradient(45deg, #40E0D0, #8FBC8F)", // Turquoise to Sage Green
                        color: "#fff",
                        fontWeight: "bold",
                        textTransform: "none",
                        transition: "background 0.3s ease",
                        "&:hover": {
                            background: "linear-gradient(45deg, #8FBC8F, #40E0D0)", // Reverse gradient on hover
                        },
                    }}
                >
                    Verify OTP
                </Button>

            </Paper>
        </>
    );
};

export default VerifyOTP;