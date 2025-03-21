const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const User = require('../models/User');
const mongoose = require('mongoose');

const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const sendMail = require('../mailer/mailer');

const { ObjectId } = require('mongodb');


// Ensure badges folder exists
const badgeDir = path.join(__dirname, "../badges");
if (!fs.existsSync(badgeDir)) {
    fs.mkdirSync(badgeDir, { recursive: true });
}


const bookEvent = async (req, res) => {
   // console.log("enetred booking");
    try {
        const { attendeeId, eventId, tickets, totalPrice } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        let totalQuantity = 0;

        for (let ticket of tickets) {
            const ticketIndex = event.tickets.findIndex(t => t.type === ticket.type);

            if (ticketIndex !== -1) {
                const availableTickets = event.tickets[ticketIndex].quantity - event.tickets[ticketIndex].sold;
                if (ticket.quantity > availableTickets) {
                    return res.status(400).json({ message: `Only ${availableTickets} tickets available for ${ticket.type}.` });
                }

                event.tickets[ticketIndex].sold += ticket.quantity;
                //console.log("sold",event.tickets[ticketIndex].sold );
                totalQuantity += ticket.quantity;
            } else {
                return res.status(400).json({ message: `Ticket type ${ticket.type} not available for this event.` });
            }
        }

        await event.save();

        console.log("price",totalPrice);
        const newBooking = new Booking({
            attendeeId,
            eventId,
            tickets,
            totalPrice,

            bookingStatus: "Pending",
        });


        await newBooking.save();


        // Generate QR Code with Booking ID
        const qrCodeData = `${process.env.FRONTEND_URL}/booking/${newBooking._id}`;
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
        newBooking.qrCode = qrCodeUrl;


        // Generate PDF Badge
        const attendee = await User.findById(attendeeId);
        if (!attendee) return res.status(404).json({ message: "Attendee not found" });

        const badgePath = path.join(badgeDir, `${newBooking._id}.pdf`);
        //const doc = new PDFDocument();
        /*doc.pipe(fs.createWriteStream(badgePath));
        doc.fontSize(20).text(`Event Badge for ${attendee.name}`, { align: "center" });
        doc.image(qrCodeUrl, { width: 150, align: "center" });
        doc.fontSize(14).text(`Event: ${event.name}`, { align: "center" });
        doc.text(`Ticket: ${tickets}`, { align: "center" });
        doc.text(`Status: Confirmed`, { align: "center" });
        doc.end();*/
        const doc = new PDFDocument({ size: "A6", margin: 10 });
        doc.pipe(fs.createWriteStream(badgePath));

        const headerColor = "#D8BFD8"; // Light purple
        const textColor = "#4B0082"; // Dark purple

        // **Header**
        doc.rect(0, 0, doc.page.width, 30).fill(headerColor);
        doc.fillColor("#ffffff").fontSize(16).text("Event Badge", 0, 12, { align: "center" });
        doc.fillColor("#000000");

        // **Attendee Details**
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor(textColor).text(attendee.name, { align: "center" });
        doc.fontSize(8).fillColor("#666666").text("Attendee", { align: "center" });

        // **Event Details**
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor("#333333").text(`Event: ${event.name}`, { align: "center" });

        const eventDate = new Date(event.start).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Ensures AM/PM format
        });


        doc.fontSize(8).fillColor("#555555").text(`Date: ${eventDate}`, { align: "center" });
        doc.text(`Location: ${event.location}`, { align: "center" });

        // **Tickets Section**
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor(textColor).text("Tickets", { underline: true, align: "center" });
        doc.moveDown(0.3);
        tickets.forEach(ticket => {
            doc.fontSize(8).fillColor("#000000").text(`${ticket.type}: ${ticket.quantity}`, { align: "center" });
        });

        // **QR Code (Properly Spaced)**
        // Define spacing for QR code & status
        const qrSize = 120; // QR Code size
        const qrPadding = 10; // Space around QR code

        // Reduce spacing below QR code
        doc.image(qrCodeUrl, (doc.page.width - qrSize) / 2, doc.y, { width: qrSize });
        doc.moveDown(0); // Small spacing

        // Move status closer without overlap
        doc.fontSize(10).fillColor("#32CD32").text(` Status: Confirmed`, { align: "center" });
        doc.moveDown(0.5); // Less space before footer

        // **Footer - Improved Visibility**
        const footerHeight = 20;
        const footerY = doc.page.height - footerHeight - 5; // Ensure it stays on the same page

        // Draw Footer Background
        doc.rect(0, footerY, doc.page.width, footerHeight).fill(headerColor);

        // Place Footer Text Exactly in the Footer Area
        doc.fillColor("#4B0082") // Dark purple for visibility
            .fontSize(10)
            .text("Thank you for booking with us!", 0, footerY + 3, { align: "center", width: doc.page.width });


        doc.end();



        // Update booking with badge URL
        newBooking.badgeUrl = badgePath;
        newBooking.badgeGenerated = true;
        await newBooking.save();


        // After saving the booking and generating the badge
        const emailContent = `
                        <h1>Your Event Booking Confirmation & Badge</h1>
                        <p>Dear ${attendee.name},</p>
                        <p>Your booking for <strong>${event.name}</strong> is confirmed.</p>
                        <p>Attached is your event badge. Please bring it along for event entry.</p>
                        <p>Best regards,<br/>Partypilot</p>
                        `;

        try {
            await sendMail(attendee.email, "Partypilot", emailContent, [
                {
                    filename: "badge.pdf",
                    path: badgePath,
                },
            ]);

            console.log("Confirmation email sent to attendee.");
        } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError);
        }




        newBooking._doc.eventName = event.name;
        res.status(201).json({
            message: "Booking confirmed.",
            booking: newBooking,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBookingById = async (req, res) => {
    try {
        //console.log("bookingId:", req.params.bookingId);

        const booking = await Booking.findById(req.params.bookingId)
            .populate({ path: 'eventId', select: 'name' })
            .populate({ path: 'attendeeId', select: 'name email' });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Add eventName to the booking object if needed
        const bookingWithEventName = {
            ...booking._doc,
            eventName: booking.eventId?.name || 'Unknown Event',
        };

        console.log("Fetched Booking:", bookingWithEventName);
        res.json(bookingWithEventName);
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ error: error.message });
    }
};


const getBookingByUserId = async (req, res) => {
    try {
        const { id } = req.params;  // Assuming user ID is available from the authenticated user (e.g., from JWT)
        //console.log("id",id);
        // Fetch all bookings for the user and populate event name
        const bookings = await Booking.find({ attendeeId: id })
            .populate({ path: 'eventId', select: 'name' })
            .populate({ path: 'attendeeId', select: 'name email' })

            .select('bookingStatus totalPrice bookingStatus createdAt')
            .sort({ createdAt: -1 });

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user.' });
        }

        // Map bookings to include the event name and formatted date
        const formattedBookings = bookings.map((booking) => ({
            id: booking._id,
            name: booking.attendeeId.name,
            email: booking.attendeeId.email,
            eventName: booking.eventId.name,
            bookingStatus: booking.bookingStatus,
            totalPrice: booking.totalPrice,
            dateOfBooking: booking.createdAt,  // You can format this date as needed
        }));

        // Return the formatted booking data
        return res.json(formattedBookings);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while fetching bookings.' });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { reason } = req.body;

        console.log("Cancelling Booking ID:", bookingId);

        // Validate Booking ID
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }

        // Find the Booking and populate eventId
        const booking = await Booking.findById(bookingId).populate("eventId");
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // Fetch Event and Update Ticket Quantities
        const event = await Event.findById(booking.eventId._id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Loop through booked tickets and restock them
        booking.tickets.forEach((bookedTicket) => {
            const eventTicket = event.tickets.find(ticket => ticket.type === bookedTicket.type);
            if (eventTicket) {
               // eventTicket.quantity += bookedTicket.quantity; // Restock tickets
                eventTicket.sold = Math.max(eventTicket.sold - bookedTicket.quantity, 0); // Prevent negative sold count
                //console.log("Updated Ticket:", eventTicket.type, "Sold:", eventTicket.sold);
            }
        });


        // Save updated event details
        await event.save();

        // Update Booking Status and Add Cancellation Reason
        booking.bookingStatus = "Cancelled"; // Use the correct field name
        booking.reasonForCancel = reason;
        await booking.save();


        // Updating Payment schema
        const payment = await Payment.findOne({ bookingId: booking._id });
        if (payment) {
            payment.status = "Cancelled";
            payment.reasonForCancel = reason;
            await payment.save();

        }

        // Fetch User Details for Email Notification
        const user = await User.findById(booking.attendeeId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Send Cancellation Email to User



        // Send cancellation email
        const formattedAmount = (booking.totalPrice / 100).toFixed(2); // Convert cents to dollars
        const formattedDateTime = new Date(booking.createdAt).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Ensures AM/PM format
        });


        const emailContent = `
                       <!DOCTYPE html>
                       <html>
                       <head><title>Payment Cancellation Notice</title></head>
                       <body style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
                           <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
                               <h2 style="color: #e63946; text-align: center;">Payment Cancellation Notice</h2>
                               <p>Dear <strong>${user.name}</strong>,</p>
                               <p>We regret to inform you that your payment for <strong>${event.name}</strong> scheduled on <strong>${formattedDateTime}</strong> has been <span style="color: #e63946; font-weight: bold;">canceled</span>.</p>
                       

                               <div style="background: #f8d7da; padding: 10px; border-radius: 5px;">
                                   <p style="margin: 0;"><strong>Cancellation Reason:</strong> ${reason}</p>
                               </div>
                       
                               <h3 style="color: #2d3436; margin-top: 20px;">Payment Details</h3>
                               <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                   <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Event Name:</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;">${event.name}</td>
                                   </tr>
                                   
                                   <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Refund Amount:</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;">$${formattedAmount}</td>
                                   </tr>
                                   <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Status</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;">${booking.bookingStatus}</td>
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
        await sendMail(user.email, `Partypilot:  Subject: Important Update: Booking Cancellation Notice`, emailContent);



        res.status(200).json({ message: "Booking cancelled successfully! and Email send to  user" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const cancelFromProfilePage = async (req, res) => {
    try {
        const { bookingId } = req.params;

        //console.log("Cancelling Booking ID:", bookingId);

        // Validate Booking ID
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }

        // Find the Booking and populate eventId
        const booking = await Booking.findById(bookingId).populate("eventId");
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // Fetch Event and Update Ticket Quantities
        const event = await Event.findById(booking.eventId._id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Loop through booked tickets and restock them
        booking.tickets.forEach((bookedTicket) => {
            const eventTicket = event.tickets.find(ticket => ticket.type === bookedTicket.type);
            if (eventTicket) {
                //eventTicket.quantity += bookedTicket.quantity; // Restock tickets
                eventTicket.sold = Math.max(eventTicket.sold - bookedTicket.quantity, 0); // Prevent negative sold count
                console.log("Updated Ticket:", eventTicket.type, "Sold:", eventTicket.sold);
            }
        });


        // Save updated event details
        await event.save();

        // Update Booking Status and Add Cancellation Reason
        booking.bookingStatus = "Cancelled"; // Use the correct field name

        await booking.save();

        //const organizerName = booking.eventId.organizer?.name; // Check if organizerId exists

        //const organizer = await User.findById(event.organizer).select("name email");
        const organizer = await User.findById(event.organizer).select("name email");
        // console.log("Organizer Name:", );


        //console.log("Organizer Name:", organizerName);


        // Updating Payment schema
        const payment = await Payment.findOne({ bookingId: booking._id });
        if (payment) {
            payment.status = "Cancelled";

            await payment.save();

        }

        // Fetch User Details for Email Notification
        const user = await User.findById(booking.attendeeId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Send Cancellation Email to User



        // Send cancellation email
        const formattedAmount = (booking.totalPrice / 100).toFixed(2); // Convert cents to dollars
        const formattedDateTime = new Date(booking.createdAt).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Ensures AM/PM format
        });

        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

        const emailContent = `<!DOCTYPE html>
                       <html>
                       <head><title>Booking Cancellation Notice</title></head>
                       <body style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
                           <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
                               <h2 style="color: #e63946; text-align: center;">Booking Cancellation Notice</h2>
                               <p>Dear <strong>${organizer.name}</strong>,</p>
                               <p> We would like to inform you that <strong>${user.name}</strong> has canceled their booking for <strong>${event.name}</strong> scheduled on <strong>${formattedDateTime}</strong> at <strong>${event.location}</strong>.</p>
                       

                                                   
                               <h3 style="color: #2d3436; margin-top: 20px;">Booking Details</h3>
                               <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>User Name:</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;">${user.name}</td>
                                   </tr>
                                   <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Event Name:</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;">${event.name}</td>
                                   </tr>
                                   
                                   <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Booking Id:</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;"> ${booking._id}</td>
                                   </tr>
                                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Booked Date</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;">${formattedDateTime}</td>
                                   </tr>
                                   <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Cancelled Date</strong></td>
                                       <td style="padding: 8px; border: 1px solid #ddd;">${formattedDate}</td>
                                   </tr>
                               </table>
                       
                              <p>
            If any action is required, such as processing a refund or updating the attendee list, please proceed accordingly.
            Feel free to reach out to <span class="font-semibold">${user.email}</span> for any clarifications.
        </p>

        <p>
            Should you need any assistance regarding this cancellation, please dont hesitate to contact us at 
            <a href="mailto:partypilot@gmail.com" class="text-blue-500 font-semibold">support@partypilot.com</a> or call 
            <span class="font-semibold">099111992</span>.
        </p>

                               <p style="margin-top: 20px; font-size: 14px; color: #555;">Best regards,</p>
                               <p style="font-size: 16px; font-weight: bold; color: #1d3557;">Partypilot</p>
                           </div>
                       </body>
                       </html>
                               `;



        // Use the reusable mailer function
        await sendMail(organizer.email, `Partypilot:  Subject: Booking Cancellation Notification - ${event.name}`, emailContent);



        res.status(200).json({ message: "Booking cancelled successfully! and Email send to  Organizer." });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


//get all bookings
const getAllBooking = async (req, res) => {
    try {

        const bookings = await Booking.find({})
            .populate({ path: 'eventId', select: 'name' })
            .populate({ path: 'attendeeId', select: 'name email' })
            .select('bookingStatus totalPrice  createdAt')
            .sort({ createdAt: -1 });
        if (!bookings.length) {
            return res.status(200).json({ message: 'No bookings found for this user.' });
        }
        //console.log(bookings);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//Get all bookings for a particular organizer
const getAllOrganizerBooking = async (req, res) => {
    //console.log(localStorage.getItem("token"));
    try {

        const { id } = req.params; // Organizer ID from request params
        const organizerObjectId = new ObjectId(id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });

        }
        // Find all events created by the organizer
        const events = await Event.find({ organizer: organizerObjectId }).select('_id');
        //console.log(events.message);

        if (!events.length) {
            return res.status(404).json({ message: 'No events found for this organizer.' });
        }
        //console.log(events.length,"tesr");
        // Extract event IDs
        const eventIds = events.map(event => event._id);

        // Find bookings related to the organizer's events
        const bookings = await Booking.find({ eventId: { $in: eventIds } })
            .populate({ path: 'eventId', select: 'name' }) // Populate event name
            .populate({ path: 'attendeeId', select: 'name email' }) // Populate attendee details
            .select('bookingStatus totalPrice createdAt') // Select only required fields
            .sort({ createdAt: -1 });

        if (!bookings.length) {
            return res.status(200).json({ message: 'No bookings found for this organizer.', bookings: [] });
        }
        //console.log(bookings);
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: error.message });
    }

}



// Export all functions
module.exports = {
    bookEvent,
    getBookingById,
    cancelBooking,
    getBookingByUserId,
    getAllBooking,
    getAllOrganizerBooking,
    cancelFromProfilePage

};
