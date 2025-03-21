import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userService from '../services/userService';

import {
    Box,
    TextField,
    Button,
    Paper,
    Typography
} from '@mui/material';

import axiosInstance from "../services/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const role = location.state?.role || "";
    const otp = location.state?.otp || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting reset password with:", { email, role, otp, newPassword });

            // Add this to see if the API call is even starting
            console.log("Starting API call");
            const result = await userService.resetPasswordForm({ email, role, otp, newPassword });

            // Add this to see if the API call completed successfully
            console.log("API call successful:", result);
            // Show success toast and delay navigation
            toast.success("Password Reset Successful!", {
                autoClose: 2000, // Toast will auto-close after 2 seconds
                onClose: () => {
                    // Navigate after the toast is closed
                    navigate("/login");
                },
            });
            //toast.success("Password Reset Successful!");
            //navigate("/login"); // Redirect user to login page after resetting password
        } catch (error) {
            console.error("Error in reset password:", error);
            toast.error(error.response?.data?.message || "Password reset failed. Please try again.");
        }
    };

    return (
        <>
            {/* Add ToastContainer component */}
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
                    height: '280px', // Fixed height
                    maxWidth: '400px',
                    margin: '0 auto',
                    justifyContent: 'space-between',
                    mt: 4,
                    mb: 4
                }}
            >
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Reset Password
                </Typography>

                <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
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
                    Reset Password
                </Button>

            </Paper>
        </>
    );
};

export default ResetPassword;