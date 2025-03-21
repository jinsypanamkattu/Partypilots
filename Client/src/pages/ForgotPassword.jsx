import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from '../services/userService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, TextField, MenuItem, Button, Typography, Container, CircularProgress } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("organizer");
  const [errorMessage, setErrorMessage] = useState("");
  const [succMessage, setSuccMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submitting
    setErrorMessage("");

    try {
      const response = await userService.forgotPasswordFormSubmit({ email, role });
      if (response.error) {
        //console.log("⚠️ Error Message:", response.error);
        setErrorMessage(response.error);  // Display error in UI
      } else {
        //console.log("✅ Success Message:", response.message);
        setSuccMessage(response.message); // Show success message

        console.log("testtt", response);
        // Show success toast and delay navigation
        toast.success("OTP sent to email", {
          autoClose: 2000, // Toast will auto-close after 2 seconds
          onClose: () => {
            // Navigate after the toast is closed
            navigate("/verify-otp", { state: { email, role } });
          },
        });
      }
      // navigate("/verify-otp", { state: { email, role } });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Try Again";
      setErrorMessage(errorMsg);
      toast.error(error.response?.data?.message || "Something went wrong");

    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Container maxWidth="sm">

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          p: 4,
          mb: 2,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >

        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Forgot Password
        </Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        {succMessage && <Typography color="green">{succMessage}</Typography>}
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          select
          label="Select Role"
          value={role}
          fullWidth
          required
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="organizer">Organizer</MenuItem>
          <MenuItem value="attendee">Attendee</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            background: "linear-gradient(45deg, #40E0D0 30%, #8FBC8F 90%)", // Turquoise to Sage Green
            color: "#fff",
            transition: "background 0.3s ease",
            "&:hover": {
              background: "linear-gradient(45deg, #40E0D0 30%, #8FBC8F 90%)", // Turquoise to Sage Green
            },
            "&:disabled": {
              background: "linear-gradient(45deg, #40E0D0 30%, #8FBC8F 90%)", // Turquoise to Sage Green
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Sending OTP...
            </Box>
          ) : (
            "Send OTP"
          )}
        </Button>
        {/* Toast at the Bottom */}
        <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />

      </Box>
    </Container>
  );
};

export default ForgotPassword;