const Stripe = require('stripe');
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Event = require('../models/Event');
const User = require('../models/User');
const sendMail = require('../mailer/mailer');
const { ObjectId } = require('mongodb')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.createPayment = async (req, res) => {
    console.log("entered createPayment");
    try {
        const { amount, currency, bookingId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { bookingId },
        });

        const newPayment = new Payment({
            bookingId,
            amount,
            status: 'Pending',
            paymentMethod: 'stripe',
            currency,
            paymentIntentId: paymentIntent.id,
        });

        await newPayment.save();



        
        console.log("Payment saved:", newPayment);

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ message: 'Failed to create payment intent.' });
    }
};

exports.confirmPayment = async (req, res) => {
    console.log("Entered confirmPayment webhook");
    console.log("Headers:", req.headers);
    console.log("Raw Body:", req.rawBody ? req.rawBody.toString() : "No raw body");

    const sig = req.headers["stripe-signature"];
    if (!sig) {
        console.error("No stripe-signature header found");
        return res.status(400).send("Missing stripe-signature header");
    }

    try {
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        console.log("Webhook event verified:", event.type);

        // Handle both payment_intent.succeeded and charge.succeeded
        if (event.type === "payment_intent.succeeded" || event.type === "charge.succeeded") {
            const paymentIntent = event.type === "payment_intent.succeeded" 
                ? event.data.object 
                : event.data.object.payment_intent; // For charge.succeeded, fetch the payment_intent ID

            const paymentIntentId = typeof paymentIntent === 'string' 
                ? paymentIntent 
                : paymentIntent.id; // Handle case where payment_intent is just the ID

            console.log("PaymentIntent ID:", paymentIntentId);

            // Fetch full payment intent if only ID is provided (from charge.succeeded)
            const fullPaymentIntent = typeof paymentIntent === 'string' 
                ? await stripe.paymentIntents.retrieve(paymentIntentId) 
                : paymentIntent;
            console.log("Full PaymentIntent:", fullPaymentIntent);

            // Update Payment status in DB
            const payment = await Payment.findOneAndUpdate(
                { paymentIntentId: paymentIntentId },
                { status: "Completed" },
                { new: true }
            );
            console.log("Updated Payment:", payment);

            if (!payment) {
                console.error("No Payment found for paymentIntentId:", paymentIntentId);
                return res.status(404).send("Payment not found");
            }

            // Update Booking status
            const booking = await Booking.findByIdAndUpdate(
                payment.bookingId,
                { bookingStatus: "Confirmed" },
                { new: true }
            );
            console.log("Updated Booking:", booking);

            if (!booking) {
                console.warn("No Booking found for bookingId:", payment.bookingId);
            }

            return res.status(200).json({ message: "Payment successful" });
        } else {
            console.log("Unhandled event type:", event.type);
            return res.status(200).send("Event received but not handled");
        }
    } catch (err) {
        console.error("Webhook error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};



// Endpoint to fetch payments for the admin dashboard
exports.getPaymentsForAdmin = async (req, res) => {
    try {
        //console.log("Enteres getPaymentsForAdmin");
        const payments = await Payment.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'bookingId',
                    foreignField: '_id',
                    as: 'booking',
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'booking.eventId',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'booking.attendeeId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$booking',
            },
            {
                $unwind: '$event',
            },
            {
                $unwind: '$user',
            },
            { $sort: { createdAt: -1 } }, 
            {
                $project: {
                    bookingId: '$booking._id',
                    eventName: '$event.name',
                    userEmail: '$user.email',
                    paymentAmount: '$amount',
                    paymentStatus: '$status',
                    paymentIntentId: '$paymentIntentId',
                },
            },
        ]);

        res.json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).send({ message: 'Error fetching payments.' });
    }
};



// Endpoint to fetch payments for the organizer dashboard
exports.getPaymentsForOrganizer = async (req, res) => {
    try {
        const { id } = req.params;  
        //console.log("Enteres getPaymentsForAdmin");
        const payments = await Payment.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'bookingId',
                    foreignField: '_id',
                    as: 'booking',
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'booking.eventId',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'booking.attendeeId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$booking',
            },
            {
                $unwind: '$event',
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    'event.organizer': new ObjectId(id), // Match events for a specific organizer
                },
            },
            {
                $project: {
                    bookingId: '$booking._id',
                    eventName: '$event.name',
                    userEmail: '$user.email',
                    paymentAmount: '$amount',
                    paymentStatus: '$status',
                    paymentIntentId: '$paymentIntentId',
                },
            },
        ]);

        res.json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).send({ message: 'Error fetching payments.' });
    }
};





// Endpoint to cancel payment (for Stripe payments)
exports.cancelPayment = async (req, res) => {
    const { paymentIntentId, cancellationReason } = req.body;
    //console.log("paymentintent",paymentIntentId);

    try {
        // Fetch payment details with aggregation
        const paymentDetails = await Payment.aggregate([
            { $match: { paymentIntentId } },
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "booking",
                },
            },
            { $unwind: "$booking" }, // Unwrap booking object
            {
                $lookup: {
                    from: "users",
                    localField: "booking.attendeeId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" }, // Unwrap user object
            {
                $lookup: {
                    from: "events",
                    localField: "booking.eventId",
                    foreignField: "_id",
                    as: "event",
                },
            },
            { $unwind: "$event" }, // Unwrap event object
            {
                $project: {
                    _id: 1,
                    paymentIntentId: 1,
                    status: 1,
                    reasonForCancel: 1,
                    amount:1,
                    "user.name": 1,
                    "user.email": 1,
                    "event.name": 1,
                    "event.start":1,
                },
            },
        ]);
        


        if (!paymentDetails || paymentDetails.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const payment = paymentDetails[0];

        // Update the payment status and reason
        const updatedPayment = await Payment.findOneAndUpdate(
            { paymentIntentId },
            { status: "Cancelled", reasonForCancel: cancellationReason },
            { new: true }
        );

        await Booking.findOneAndUpdate(
            { _id: payment.bookingId },
            { $set: { bookingStatus: "Pending", cancellationReason } }, // Add reason
            { new: true }
        );
        const formattedAmount = (payment.amount / 100).toFixed(2); // Convert cents to dollars
        const formattedDateTime = new Date(payment.event.start).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Ensures AM/PM format
        });
        

                
                // Send cancellation email
       

                const emailContent = `
                <!DOCTYPE html>
                <html>
                <head><title>Payment Cancellation Notice</title></head>
                <body style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #e63946; text-align: center;">Payment Cancellation Notice</h2>
                        <p>Dear <strong>${payment.user.name}</strong>,</p>
                        <p>We regret to inform you that your payment for <strong>${payment.event.name}</strong> scheduled on <strong>${formattedDateTime}</strong> has been <span style="color: #e63946; font-weight: bold;">canceled</span>.</p>
                
                        <div style="background: #f8d7da; padding: 10px; border-radius: 5px;">
                            <p style="margin: 0;"><strong>Cancellation Reason:</strong> ${cancellationReason}</p>
                        </div>
                
                        <h3 style="color: #2d3436; margin-top: 20px;">Payment Details</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Event Name:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${payment.event.name}</td>
                            </tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Transaction ID:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${paymentIntentId}</td>
                            </tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Refund Amount:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">$${formattedAmount}</td>
                            </tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Expected Refund Time:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">5 days</td>
                            </tr>
                        </table>
                
                        <p>If you have any questions or concerns, please contact our support team at 
                        <a href="mailto:support@example.com" style="color: #1d4ed8; text-decoration: none;">support@example.com</a>.</p>
                
                        <p>We sincerely apologize for any inconvenience caused and appreciate your understanding.</p>
                
                        <p style="margin-top: 20px; font-size: 14px; color: #555;">Best regards,</p>
                        <p style="font-size: 16px; font-weight: bold; color: #1d3557;">Partypilot</p>
                    </div>
                </body>
                </html>
                `;
                
       
       
               // Use the reusable mailer function
               await sendMail(payment.user.email, `Partypilot:  Subject: Important Update: Payment Cancellation Notice`, emailContent);
       
       

        res.status(200).json({ message: "Payment canceled successfully and email sent!", payment: updatedPayment });


       // res.json({ message: 'Payment cancelled successfully', payment: updatedPayment });
    } catch (err) {
        console.error('Error cancelling payment:', err);
        res.status(500).send({ message: 'Error cancelling payment.' });
    }
};



