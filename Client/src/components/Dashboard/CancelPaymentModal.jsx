import React, { useState } from "react";

const CancelPaymentModal = ({ isOpen, onClose, onConfirm, payment }) => {
    const [cancellationReason, setCancellationReason] = useState("");

    if (!isOpen) return null; // Hide modal if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Cancel Payment</h2>
                <p className="text-gray-600 mb-3">
                    Please enter a reason for canceling the payment for <strong>{payment.eventName}</strong>.
                </p>
                <textarea
                    className="w-full border p-2 rounded-md focus:ring focus:ring-indigo-300"
                    rows="3"
                    placeholder="Enter cancellation reason..."
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                ></textarea>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onConfirm(cancellationReason)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelPaymentModal;
