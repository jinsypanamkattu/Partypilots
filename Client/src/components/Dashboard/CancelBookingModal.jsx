import React, { useState } from "react";

const CancelBookingModal = ({ isOpen, onClose, onConfirm, bookingId }) => {
    const [reason, setReason] = useState("");

    if (!isOpen) return null; // Don't render if modal is not open

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
                <p className="text-gray-600 mb-3">Please provide a reason for cancellation:</p>
                <textarea
                    className="w-full p-2 border rounded-lg resize-none"
                    rows="4"
                    placeholder="Enter reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-4 space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                        Close
                    </button>
                    <button
                        onClick={() => onConfirm(bookingId, reason)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        disabled={!reason.trim()}
                    >
                        Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelBookingModal;
