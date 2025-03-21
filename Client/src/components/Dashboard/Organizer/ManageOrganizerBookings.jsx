import React, { useEffect, useState } from 'react';
import { fetchAllOrganizerBookings, cancelBooking } from '../../../services/bookingService';
import  getUserIdFromToken  from '../../../utility/auth';
import CancelBookingModal from "../CancelBookingModal";
const ManageOrganizerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchOrganizerBookings();
    }, []);

    const fetchOrganizerBookings = async () => {
        try {
            const  userId = getUserIdFromToken();
            
            const response = await fetchAllOrganizerBookings(userId);
           console.log("response",response.data);
           // setBookings(response.data || []);
            if (response.data.message) {
                setError(response.data.message);
                setBookings(response.data.bookings); // which would be an empty array
              } else {
                setBookings(response.data || []);
              }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to fetch bookings');
            }
        } finally {
            setLoading(false);
        }
        
    };

    const cancelOrganizerBooking = async (bookingId) => {
        try {
           // alert("Do U want to cancel the booking");
            const response = await cancelBooking(bookingId);
            //console.log("responseofcancel",response);
            setSuccess('Booking cancelled successfully!');
            setModalOpen(false);
            fetchOrganizerBookings(); // Refresh bookings after cancel
           // fetchOrganizerBookings();
        } catch (err) {
            setError('Failed to cancel booking');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    const openCancelModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setModalOpen(true);
    };

    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div className="text-center text-gray-500 text-2xl font-semibold mt-5">Loading bookings...</div>;
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>
            {error && <div className="text-red-500 p-4 mb-4 bg-red-100 rounded-lg">{error}</div>}
            {success && <div className="text-green-500 p-4 mb-4 bg-green-100 rounded-lg">{success}</div>}
            <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Event Name</th>
                        <th className="border p-2">User Name</th>
                        <th className="border p-2">Booking Status</th>
                        <th className="border p-2">Booking Date</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="border p-2">{booking.eventId?.name || "Event not available"}</td>
                            <td className="border p-2">{booking.attendeeId?.name || "User not available"}</td>
                            <td className="border p-2">
                                <span className={`px-2 py-1 rounded ${booking.bookingStatus === 'confirmed' ? 'bg-green-200 text-green-800' : booking.bookingStatus === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                    {booking.bookingStatus}
                                </span>
                            </td>
                            <td className="border p-2">{formatDate(booking.createdAt)}</td>
                            <td className="border p-2">
                                {booking.bookingStatus !== 'Cancelled' && (
                                    <button
                                    onClick={() => openCancelModal(booking._id)}
                                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <CancelBookingModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={cancelOrganizerBooking}
                bookingId={selectedBookingId}
            />

            <div className="mt-4 flex justify-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                    Previous
                </button>
                <span className="text-lg font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageOrganizerBookings;
