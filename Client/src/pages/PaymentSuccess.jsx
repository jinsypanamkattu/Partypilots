import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (sessionId) {
          const response = await axios.get(`/api/payment-success?session_id=${sessionId}`);
          setOrderDetails(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [sessionId]);

  if (loading) return <div>Loading order details...</div>;
  
  return (
    <div className="container mx-auto p-6 flex justify-center items-center">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
        {/* Success Message */}
        <h1 className="text-3xl font-extrabold text-green-700 mb-4 drop-shadow-md">Payment Successful!</h1>
        <p className="text-gray-600 text-lg mb-6">Thank you for your purchase.</p>

        {/* Order Details */}
        {orderDetails && (
            <div className="mb-6 text-left bg-gray-100 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Order Details</h2>
                <p className="text-gray-800"><strong>Order ID:</strong> {orderDetails.session.payment_intent}</p>
                <p className="text-gray-800"><strong>Amount:</strong> ${(orderDetails.session.amount_total / 100).toFixed(2)}</p>
            </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
            <Link
                to="/profile?tab=bookings"
                className="block w-full py-3 text-lg font-semibold text-white rounded-lg transition-all duration-300 bg-gradient-to-r from-turquoise-400 to-green-500 hover:from-turquoise-500 hover:to-green-600 shadow-md transform hover:scale-105"
            >
                View My Tickets
            </Link>
            <Link
                to="/"
                className="block w-full py-3 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg transition-all duration-300 hover:bg-gray-300 shadow-md transform hover:scale-105"
            >
                Back to Events
            </Link>
        </div>
    </div>
</div>

  );
};

export default PaymentSuccess;