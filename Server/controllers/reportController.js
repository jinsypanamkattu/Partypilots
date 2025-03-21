const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Payment = require("../models/Payment");
const User = require("../models/User");
const { ObjectId } = mongoose.Types;

// Get overview report (total bookings, revenue, etc.)
exports.getOverviewReport = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch overview report", error: error.message });
  }
};

// Get revenue report (total revenue)
exports.getRevenueReport = async (req, res) => {
  try {

    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenueInDollars = totalRevenue.length ? totalRevenue[0].total / 100 : 0;
    /*res.status(200).json({

        totalRevenue: totalRevenue[0]?.total || 0,
    });*/
    res.status(200).json({
      totalRevenue: parseFloat(totalRevenueInDollars.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue report", error: error.message });
  }
};

// Get revenue report (total revenue) for organizer
exports.getOrganizerRevenueReport = async (req, res) => {
  try {
    const organizerId = req.params.id; // Extract organizer ID from the request
    //console.log("organizerid",organizerId);

    // Ensure the organizerId is a valid ObjectId
    if (!ObjectId.isValid(organizerId)) {
      return res.status(400).json({ message: 'Invalid organizer ID format' });
    }


    const totalRevenue = await Payment.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: "$booking" },
      {
        $lookup: {
          from: "events",
          localField: "booking.eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $match: { "event.organizer": new ObjectId(organizerId) },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenueInDollars = totalRevenue.length ? totalRevenue[0].total / 100 : 0;

    //console.log(`Total Revenue: $${totalRevenueInDollars.toFixed(2)}`);


    //res.status(200).json({

    // totalRevenue: totalRevenue[0]?.total || 0,
    //});
    res.status(200).json({
      totalRevenue: parseFloat(totalRevenueInDollars.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue report", error: error.message });
  }
};


// Get total booking report (total booking)
exports.getBookingReport = async (req, res) => {
  try {
   // console.log("booki");
    const totalBookings = await Booking.countDocuments();

    //console.log("totalbookings", totalBookings);
    res.status(200).json({
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking report", error: error.message });
  }
};

// Get total booking report (total booking) for organizer
exports.getOrganizerBookingReport = async (req, res) => {
  try {
    const organizerId = req.params.id; // Extract organizer ID from the request
    //console.log("organizerid",organizerId);

    // Ensure the organizerId is a valid ObjectId
    if (!ObjectId.isValid(organizerId)) {
      return res.status(400).json({ message: 'Invalid organizer ID format' });
    }
    const totalBookings = await Booking.aggregate([
      {
        $lookup: {
          from: "events", // Match the event collection
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $match: { "event.organizer": new ObjectId(organizerId) }, // Match organizer ID
      },
      {
        $count: "totalBookings", // Count the matching bookings
      },
    ]);


    res.status(200).json({
      totalBookings: totalBookings[0]?.totalBookings || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking report", error: error.message });
  }
};



// Get all events report (total events)
exports.getEventCountReport = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();


    res.status(200).json({
      totalEvents
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event count report", error: error.message });
  }
};



// Get report for a specific event

exports.getEventReport = async (req, res) => {
  try {
    const { eventId } = req.params;  // Get eventId from request params

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid Event ID" });
    }

    const revenue = await Payment.aggregate([
      {
        $match: { eventId: new mongoose.Types.ObjectId(eventId) } //  Convert eventId to ObjectId
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }  //  Calculate total revenue
        }
      }
    ]);

    res.json({ totalRevenue: revenue.length > 0 ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};




// Get attendee report (all attendees with event details)
exports.getAttendeeReport = async (req, res) => {
  try {
    const attendees = await Booking.find().populate("attendeeId eventId");
    //console.log(attendees);

    const report = attendees.map((b) => ({
      attendee: b.attendeeId.name,
      email: b.attendeeId.email,
      event: b.eventId.name,
      ticketType: b.ticketType,
    }));

    res.status(200).json({ attendees: report });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendee report", error: error.message });
  }
};

exports.getOrganizerEventsReport = async (req, res) => {
  try {
    const organizerId = req.params.id; // Extract organizer ID from the request
    console.log("organizerid", organizerId);

    // Ensure the organizerId is a valid ObjectId
    if (!ObjectId.isValid(organizerId)) {
      return res.status(400).json({ message: 'Invalid organizer ID format' });
    }

    // Query the database for events using the valid ObjectId
    const events = await Event.find({ organizer: new ObjectId(organizerId) });

    // Count the number of events for the given organizer
    const eventCount = events.length;
    //console.log("eventcount",eventCount);
    if (eventCount === 0) {
      //console.log(eventCount);
      return res.status(200).json({ eventCount: 0, message: 'No events found for this organizer' });
    }

    // Respond with the event count
    return res.status(200).json({ eventCount: eventCount });

  } catch (error) {
    console.error("Error fetching organizer's events:", error);
    return res.status(500).json({ message: "Failed to retrieve events", error: error.message });
  }
};

//to get total attendees for a specific event

exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Count total attendees by summing up the 'quantity' field in bookings for this event
    const result = await Booking.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } }, // Filter by event ID
      { $group: { _id: "$eventId", totalAttendees: { $sum: "$quantity" } } } // Sum quantity
    ]);

    // If no attendees found, return 0
    const totalAttendees = result.length > 0 ? result[0].totalAttendees : 0;

    res.status(200).json({
      eventId,
      totalAttendees,
    });
  } catch (error) {
    console.error("Error fetching attendee count:", error);
    res.status(500).json({ message: "Error fetching attendee count", error: error.message });
  }
};



// Get monthly event data
//router.get('/monthly-stats', async (req, res) => {
exports.getMonthlyStats = async (req, res) => {
  //console.log('monthly-stats');
  try {
    // Aggregate events by month and type
    const monthlyData = await Event.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$start" },
            year: { $year: "$start" },
            type: "$eventType"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Transform into the format needed for charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = [];

    // Process data into the format needed for charts
    // This creates the structure needed for the stacked bar chart
    monthlyData.forEach(item => {
      const monthIndex = item._id.month - 1;
      const monthName = months[monthIndex];

      let monthData = formattedData.find(d => d.month === monthName);
      if (!monthData) {
        monthData = {
          month: monthName,
          totalEvents: 0,
          corporateEvents: 0,
          socialEvents: 0,
          virtualEvents: 0
        };
        formattedData.push(monthData);
      }

      // Update counts based on event type
      monthData[`${item._id.type.toLowerCase()}Events`] = item.count;
      monthData.totalEvents += item.count;
    });
    //console.log(formattedData,"test");
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching event data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get monthly stats of an organizer
exports.getOrganizerMonthlyStats = async (req, res) => {
  //console.log('monthly-stats');
  const organizerId = req.params.id;
  //console.log("month",organizerId);
  try {
    // Aggregate events by month and type
    const monthlyData = await Event.aggregate([
      {
        $match: { organizer: new mongoose.Types.ObjectId(organizerId) } // Match by organizer ID
      },
      {
        $group: {
          _id: {
            month: { $month: "$start" },
            year: { $year: "$start" },
            type: "$eventType",
            status: "$status" // Include event status
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    //console.log(monthlyData,"as");
    // Transform into the format needed for charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = [];

    // Process data into the format needed for charts
    // This creates the structure needed for the stacked bar chart
    monthlyData.forEach(item => {
      const monthIndex = item._id.month - 1;
      const monthName = months[monthIndex];

      let monthData = formattedData.find(d => d.month === monthName);
      if (!monthData) {
        monthData = {
          month: monthName,
          totalEvents: 0,
          corporateEvents: 0,
          socialEvents: 0,
          virtualEvents: 0
        };
        formattedData.push(monthData);
      }

      // Update counts based on event type
      monthData[`${item._id.type.toLowerCase()}Events`] = item.count;
      monthData.totalEvents += item.count;
    });
    //console.log(formattedData,"test");
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching event data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event type distribution
//router.get('/event-types', async (req, res) => {
exports.getEventTypes = async (req, res) => {
  try {
    //console.log('event-types');
    const eventTypes = await Event.aggregate([
      {
        $group: {
          _id: "$eventType",
          value: { $sum: 1 }
        }
      }
    ]);

    // Map the colors to event types
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const formattedData = eventTypes.map((type, index) => ({
      name: type._id,
      value: type.value,
      color: colors[index % colors.length]
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching event types:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get attendee stats

exports.getAttendeeStats = async (req, res) => {
  try {
    const attendeeStats = await Booking.aggregate([
      {
        $unwind: "$tickets" // Split tickets array into separate documents
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      {
        $unwind: "$event"
      },
      {
        $group: {
          _id: "$event.eventType",
          attendeeCount: { $sum: "$tickets.quantity" }
        }
      }
    ]);

    const formattedData = attendeeStats.map(stat => ({
      eventType: stat._id,
      attendeeCount: stat.attendeeCount
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching event attendee stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get attendee stats for an organizer
exports.getOrganizerAttendeeStats = async (req, res) => {
  //console.log("attendee");
  try {
    const organizerId = req.params.id;
    //console.log("attendeeeorg",organizerId);
    const attendeeStats = await Booking.aggregate([
      {
        $unwind: "$tickets" // Split tickets array into separate documents
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      {
        $unwind: "$event"
      },
      {
        $match: { "event.organizer": new mongoose.Types.ObjectId(organizerId) } // Filter by organizer ID
      },
      {
        $group: {
          _id: "$event.eventType", // Group by event type
          attendeeCount: { $sum: "$tickets.quantity" } // Sum up ticket quantities
        }
      }
    ]);

    const formattedData = attendeeStats.map(stat => ({
      eventType: stat._id,
      attendeeCount: stat.attendeeCount
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching event attendee stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





// Get booking reports
exports.getBookingsReport = async (req, res) => {
  //console.log("entered booking report");
  //router.get('/bookings', [auth, adminAuth], async (req, res) => {
  try {
    const { startDate, endDate, eventId, status } = req.query;
    //console.log(req.query);
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (eventId) {
      query.eventId = eventId;
    }

    if (status) {

      query.bookingStatus = status;
    }
    //console.log("appended query", query);

    const bookings = await Booking.find(query)
      .populate('eventId', 'name start location')
      .populate('attendeeId', 'name email')
      .sort({ createdAt: -1 });
    //console.log("test", bookings);
    // Calculate summary statistics
    const totalBookings = bookings.length;
    // const totalTickets = bookings.reduce((sum, booking) => sum + booking.ticketQuantity, 0);
    //const totalTickets: booking.getTotalTickets(),
    const totalTickets = bookings.reduce((sum, booking) => {
      return sum + (booking.tickets?.reduce((ticketSum, ticket) => ticketSum + ticket.quantity, 0) || 0);
    }, 0);
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);



    // **Extract ticket details**
    let totalTicketsCount = 0;
    let ticketBreakdown = {};

    bookings.forEach(booking => {
      if (booking.tickets && booking.tickets.length > 0) {
        booking.tickets.forEach(ticket => {
          totalTicketsCount += ticket.quantity;
          if (ticketBreakdown[ticket.type]) {
            ticketBreakdown[ticket.type] += ticket.quantity;
          } else {
            ticketBreakdown[ticket.type] = ticket.quantity;
          }
        });
      }
    });

    // Format ticket breakdown as an array for frontend processing
    const formattedTicketBreakdown = Object.entries(ticketBreakdown).map(([type, quantity]) => ({
      type,
      quantity
    }));



    // Calculate total revenue from payments
    const paymentQuery = {};
    if (startDate && endDate) {
      paymentQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (eventId) {
      paymentQuery.eventId = eventId;
    }

    const paymentResult = await Payment.aggregate([
      { $match: paymentQuery },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalRevenueFromPayments = paymentResult.length > 0 ? paymentResult[0].total / 100 : 0;


    //console.log("tbook", totalBookings);
   // console.log("tottickets", totalTickets);
   // console.log("trevenu", totalRevenue);
   // console.log("totalRevenueFromPayments", totalRevenueFromPayments);
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.bookingStatus] = (acc[booking.bookingStatus] || 0) + 1;
      return acc;
    }, {});

    res.json({
      bookings,
      summary: {
        totalBookings,
        totalTickets,
        totalRevenue: totalRevenueFromPayments,
        ticketBreakdown: formattedTicketBreakdown, // New field added
        statusCounts
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Get payment reports
//  router.get('/payments', [auth, adminAuth], async (req, res) => {
exports.getPaymentsReport = async (req, res) => {
  // console.log("payment report");
  try {
    const { startDate, endDate, status, paymentMethod } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const payments = await Payment.find(query)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'eventId', select: 'name start' },
          { path: 'attendeeId', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 });

    // Calculate summary statistics
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const statusCounts = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});

    const methodCounts = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    res.json({
      payments,
      summary: {
        totalPayments,
        totalAmount,
        ticketBreakdown: formattedTicketBreakdown,
        statusCounts,
        methodCounts
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get event attendees report
//router.get('/event-attendees/:eventId', [auth, adminAuth], async (req, res) => {
exports.getEventAttendeesReport = async (req, res) => {
  //console.log("event Attendess report");
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const bookings = await Booking.find({
      eventId,
      
    }).populate('attendeeId', 'name email phone');
 
     // Calculate total attendees from the `tickets` array inside each booking
const totalAttendees = bookings.reduce((sum, booking) => {
  return sum + booking.tickets.reduce((ticketSum, ticket) => ticketSum + ticket.quantity, 0);
}, 0);


// Fetch the total available tickets from the Event model


const totalAvailableTickets = event ? event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0) : 0;
const capacity = totalAvailableTickets;

    //const totalAttendees = bookings.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

    // Calculate attendee statistics
    //const totalAttendees = bookings.reduce((sum, booking) => sum + booking.ticketQuantity, 0);
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    

    // Get list of unique attendees
    const attendees = bookings.map(booking => ({
      userId: booking.attendeeId._id,
      name: booking.attendeeId.name,
      email: booking.attendeeId.email,
      phone: booking.attendeeId.phone,
      tickets: booking.tickets,
      bookingDate: booking.createdAt,
      bookingId: booking._id
    }));

    res.json({
      eventDetails: {
        id: event._id,
        name: event.name,
        startDate: event.start,
        endDate: event.end,
        venue: event.location,
        capacity: capacity,

      },
      attendees,
      summary: {
        totalAttendees,
        totalBookings,
        totalRevenue,
        occupancyRate: totalBookings,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export report data to CSV
//router.get('/export/:reportType', [auth, adminAuth], async (req, res) => {
exports.exportReport = async (req, res) => {
 // console.log("enetred export bookings");
  try {
    const { reportType } = req.params;
    const { startDate, endDate, eventId } = req.query;
//console.log("params",req.params);

//console.log(req.query);
    let data = [];
    let fields = [];
    let filename = '';

    if (reportType === 'bookings') {
      // Query similar to /bookings endpoint but formatted for CSV
      let query = {};

      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (eventId) {
        query.eventId = eventId;
      }

      const bookings = await Booking.find(query)
        .populate('eventId', 'name start location')
        .populate('attendeeId', 'name email')
        .sort({ createdAt: -1 });
     // console.log("Raw Booking Data:", bookings);

      data = bookings.map(booking => {
       // console.log("Processing Booking:", booking);
        return {
          'Booking ID': booking._id || 'N/A',
          'Event Name': booking.eventId?.name || 'N/A',
          'Event Date': booking.eventId?.start || 'N/A',
          'Customer Name': booking.attendeeId?.name || 'N/A',
          'Customer Email': booking.attendeeId?.email || 'N/A',
          'Booking Date': booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A',
          'Status': booking.bookingStatus || 'N/A',
          'Amount': booking.totalPrice ? (booking.totalPrice / 100).toFixed(2) : 'N/A' // Convert cents to dollars if needed
        };
      });
      data = bookings.map(booking => ({

        'Booking ID': booking._id || 'N/A',
        'Event Name': booking.eventId.name || 'N/A',
        'Event Date': booking.eventId.start || 'N/A',
        'Customer Name': booking.attendeeId.name || 'N/A',
        'Customer Email': booking.attendeeId.email || 'N/A',
        'Booking Date': booking.createdAt || 'N/A',
        'Status': booking.bookingStatus || 'N/A',

        'Amount': booking.totalPrice,
      }));
      if (data.length === 0) {
        console.log("No data to export");
      }


      fields = ['Booking ID', 'Event Name', 'Event Date', 'Customer Name', 'Customer Email',
        'Booking Date', 'Status', 'Amount'];
      filename = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
    }
    else if (reportType === 'payments') {
      // Implement payment export similar to bookings
      // (implementation details would be similar to bookings but with payment fields)
    }
    else if (reportType === 'attendees' && eventId) {
      // Implement attendee export similar to bookings
      // (implementation details would be similar to event-attendees endpoint)
      // Query similar to /bookings endpoint but formatted for CSV
      let query = {};

      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (eventId) {
        query.eventId = eventId;
      }

      const bookings = await Booking.find(query)
        .populate('eventId', 'name start location')
        .populate('attendeeId', 'name email')
        .sort({ createdAt: -1 });
      //console.log("Raw Booking Data:", bookings);
     let totalTicketsCount = 0;
   

    bookings.forEach(booking => {
      if (booking.tickets && booking.tickets.length > 0) {
        booking.tickets.forEach(ticket => {
          totalTicketsCount += ticket.quantity;
          
        });
      }
    });

      data = bookings.map(booking => {
      // console.log("Processing Booking:", booking);
        return {
          'Name': booking.attendeeId.name || 'N/A',
        'Email': booking.attendeeId.email || 'N/A',
        'Phone': booking.attendeeId.phone || 'N/A',
        'Booking Date': booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A',
        'Ticket Quantity': totalTicketsCount || 'N/A',
        'Booking Id': booking._id || 'N/A',
        
        'Status': booking.bookingStatus || 'N/A',

        'Amount': booking.totalPrice ? (booking.totalPrice / 100).toFixed(2) : 'N/A' // Convert cents to dollars if needed
        };
      });

      
      data = bookings.map(booking => ({
        'Name': booking.attendeeId.name || 'N/A',
        'Email': booking.attendeeId.email || 'N/A',
        'Phone': booking.attendeeId.phone || 'N/A',
        'Booking Date': booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A',
        'Ticket Quantity': totalTicketsCount || 'N/A',
        'Booking Id': booking._id || 'N/A',
        
        'Status': booking.bookingStatus || 'N/A',

        'Amount': booking.totalPrice ? (booking.totalPrice / 100).toFixed(2) : 'N/A' // Convert cents to dollars if neede
      }));
      if (data.length === 0) {
        console.log("No data to export");
      }


      fields = ['Name', 'Email', 'Phone', 'Booking Date', 'Ticket Quantity',
        'Booking Id', 'Status', 'Amount'];
      filename = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
    }
    else {
      return res.status(400).json({ message: 'Invalid report type or missing parameters' });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'No data available for export' });
    }


    // Here we would use a CSV generation library like json2csv
    const { Parser } = require('json2csv');

    // Dynamically get the fields from the first data object
    fields = Object.keys(data[0] || {});
    console.log("CSV Fields:", fields);


    const csv = new Parser({ fields }).parse(data);
    console.log("Generated CSV:", csv);
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);

    // For this example, just send back the data that would be converted
    res.json({
      reportType,
      filename,
      fields,
      data: data.slice(0, 5), // Just send first 5 rows as example
      totalRows: data.length
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookingTimeline = async (req, res) => {
  //console.log("testt");
  try {
      const days = 10; // Last 10 days
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0); // Normalize to start of the day

      const bookingData = await Booking.aggregate([
          {
              $match: { 
                  createdAt: { $gte: startDate } // Get bookings within the last 10 days
              }
          },
          {
              $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  count: { $sum: 1 }
              }
          },
          { $sort: { _id: 1 } } // Sort by date ascending
      ]);

      // Convert data to frontend-friendly format
      const bookingTimelineData = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - (days - 1 - i));
          const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          // Find count from aggregation result
          const bookingEntry = bookingData.find(entry => entry._id === date.toISOString().split('T')[0]);
          const bookings = bookingEntry ? bookingEntry.count : 0;

          return { date: dateString, bookings };
      });

      res.json(bookingTimelineData);
  } catch (error) {
      console.error("Error fetching booking timeline:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};


