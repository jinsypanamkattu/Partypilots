import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
import CancelPaymentModal from "../../components/Dashboard/CancelPaymentModal";

const AdminPaymentsDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentsPerPage] = useState(5);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axiosInstance.get("/payments/adminListPayments");
                if (Array.isArray(response.data)) {
                    setPayments(response.data);
                } else {
                    setStatusMessage({ type: "error", text: "Unexpected API response" });
                }
            } catch (error) {
                setStatusMessage({ type: "error", text: "Failed to fetch payments" });
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // Open Modal with selected payment
    const openModal = (payment) => {
        setSelectedPayment(payment);
        setShowModal(true);
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedPayment(null);
    };

    // Handle Payment Cancellation and Email Notification
    const handleCancelPayment = async (cancellationReason) => {
        if (!selectedPayment || !cancellationReason.trim()) {
            setStatusMessage({ type: "error", text: "Please provide a cancellation reason!" });
            return;
        }

        try {
            const response = await axiosInstance.post("/payments/cancel-payment", {
                paymentIntentId: selectedPayment.paymentIntentId,
                cancellationReason,
            });

            setStatusMessage({
                type: "success",
                text: response.data.message || "Payment canceled successfully!",
            });

            setPayments((prevPayments) =>
                prevPayments.map((payment) =>
                    payment.paymentIntentId === selectedPayment.paymentIntentId
                        ? { ...payment, paymentStatus: "Cancelled", cancellationReason }
                        : payment
                )
            );

            closeModal();
        } catch (error) {
            setStatusMessage({ type: "error", text: "Error canceling payment" });
        }
    };

    // Pagination Logic
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

    const totalPages = Math.ceil(payments.length / paymentsPerPage);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Manage Payments</h1>
        
            {statusMessage.text && (
                <div
                    className={`mb-4 p-3 rounded-md ${
                        statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                    {statusMessage.text}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center">
                    <p className="text-xl text-gray-600">Loading payments...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg border border-gray-300">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="px-6 py-3 border border-gray-300 text-left text-sm font-semibold">Booking ID</th>
                                <th className="px-6 py-3 border border-gray-300 text-left text-sm font-semibold">Event Name</th>
                                <th className="px-6 py-3 border border-gray-300 text-left text-sm font-semibold">User Email</th>
                                <th className="px-6 py-3 border border-gray-300 text-left text-sm font-semibold">Payment Amount</th>
                                <th className="px-6 py-3 border border-gray-300 text-left text-sm font-semibold">Payment Status</th>
                                <th className="px-6 py-3 border border-gray-300 text-left text-sm font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {currentPayments.length > 0 ? (
                                currentPayments.map((payment) => (
                                    <tr key={payment.paymentIntentId} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 border border-gray-300">{payment.bookingId}</td>
                                        <td className="px-6 py-4 border border-gray-300">{payment.eventName}</td>
                                        <td className="px-6 py-4 border border-gray-300">{payment.userEmail}</td>
                                        <td className="px-6 py-4 border border-gray-300">${(payment.paymentAmount / 100).toFixed(2)}</td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs ${
                                                    payment.paymentStatus === "Cancelled"
                                                        ? "bg-red-500 text-white"
                                                        : "bg-green-500 text-white"
                                                }`}
                                            >
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border border-gray-300">
                                            {payment.paymentStatus !== "Cancelled" && (
                                                <button
                                                    onClick={() => openModal(payment)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                                                >
                                                    Cancel Payment
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 mx-1 border rounded-md ${
                                    currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 mx-1 border rounded-md ${
                                        currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 mx-1 border rounded-md ${
                                    currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            <CancelPaymentModal isOpen={showModal} onClose={closeModal} onConfirm={handleCancelPayment} payment={selectedPayment} />
        </div>
    );
};

export default AdminPaymentsDashboard;


