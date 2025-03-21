import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchUserBookings,
    fetchBookingsById,
    cancelBooking,
} from "../redux/slices/bookingsSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Typography,
    Button,
    Box,
    Alert,
} from "@mui/material";

export function BookingDetails({ userId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(""); // State for success message

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserBookings(userId));
        }
    }, [dispatch, userId]);

    const bookings = useSelector((state) => state.bookings.bookings);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleConfirmBooking = async (bookingId) => {
        try {
            const resultAction = await dispatch(fetchBookingsById(bookingId));
            navigate("/confirmPayment", {
                state: { booking: resultAction.payload },
            });
        } catch (error) {
            console.error("Failed to fetch booking:", error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you really want to miss the event?")) {
            try {
                const resultAction = await dispatch(cancelBooking(bookingId));

                if (cancelBooking.fulfilled.match(resultAction)) {
                    setSuccessMessage("Booking cancelled successfully!"); // Set success message
                    dispatch(fetchUserBookings(userId)); // Refetch bookings to update UI
                } else {
                    setSuccessMessage("Failed to cancel the booking.");
                }
            } catch (error) {
                console.error("Error cancelling booking:", error);
                setSuccessMessage("An error occurred while cancelling the booking.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{ fontWeight: "bold" }}
            >
                My Bookings
            </Typography>

            {/* Display success message */}
            {successMessage && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Alert severity="success">{successMessage}</Alert>
                </Box>
            )}

            {bookings?.length > 0 ? (
                <>
                    <TableContainer component={Paper} elevation={6} sx={{ borderRadius: "10px" }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#789972" }}>
                                <TableRow>
                                    <TableCell align="center" sx={{ color: "white" }}>#</TableCell>
                                    <TableCell align="center" sx={{ color: "white" }}>Event Name</TableCell>
                                    <TableCell align="center" sx={{ color: "white" }}>Date</TableCell>
                                    <TableCell align="center" sx={{ color: "white" }}>Status</TableCell>
                                    <TableCell align="center" sx={{ color: "white" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((booking, index) => (
                                        <TableRow key={booking._id || index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                                            <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell align="center">{booking.eventName}</TableCell>
                                            <TableCell align="center">{formatDate(booking.dateOfBooking)}</TableCell>
                                            <TableCell align="center">{booking.bookingStatus}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleConfirmBooking(booking.id)}
                                                        disabled={booking.bookingStatus === "Confirmed" || booking.bookingStatus === "Cancelled"}
                                                        sx={{
                                                            textTransform: "none",
                                                            background: "linear-gradient(45deg, #40E0D0, #8FBC8F)", // Turquoise to Green gradient
                                                            color: "#fff",
                                                            padding: "10px 20px",
                                                            transition: "0.3s ease-in-out",
                                                            "&:hover": {
                                                                background: "linear-gradient(45deg, #36CFC9, #76A77D)", // Slightly deeper transition on hover
                                                            },
                                                        }}
                                                    >
                                                        Confirm Booking
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        disabled={booking.bookingStatus === "Cancelled"}
                                                        sx={{ textTransform: "none" }}
                                                    >
                                                        Cancel Booking
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={bookings.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </>
            ) : (
                <Typography variant="body1" color="textSecondary" align="center">
                    No bookings found.
                </Typography>
            )}
        </div>
    );
}
