const express = require("express");
const { getOverviewReport, 
        getEventReport, 
        getAttendeeReport, 
        getEventAttendees, 
        getRevenueReport, 
        getOrganizerEventsReport, 
        getOrganizerRevenueReport,
        getBookingReport, 
        getOrganizerBookingReport,
        getEventCountReport,
        getMonthlyStats,
        getOrganizerMonthlyStats,
        getEventTypes,
        
        getOrganizerAttendeeStats,
        getAttendeeStats,
        getBookingsReport,
        getPaymentsReport,
        getEventAttendeesReport,
        getBookingTimeline,
        exportReport
     } = require("../controllers/reportController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin and organizer report overview
router.get("/overview", authenticate, authorizeRoles("admin", "organizer"), getOverviewReport);

router.get ("/monthly-stats/:id",  getOrganizerMonthlyStats);

router.get ("/attendee-stats/:id", getOrganizerAttendeeStats);

router.get ("/monthly-stats",  getMonthlyStats);
router.get ("/event-types", getEventTypes);
router.get ("/attendee-stats", getAttendeeStats);



// Event-specific report
router.get("/event/:eventId", authenticate, authorizeRoles("admin", "organizer"), getEventReport);

router.get("/revenue", authenticate, authorizeRoles("admin","organizer"), getRevenueReport);
router.get("/revenue/:id", authenticate, authorizeRoles("admin","organizer"), getOrganizerRevenueReport);
router.get("/booking", authenticate, authorizeRoles("admin","organizer"), getBookingReport);
router.get("/booking/:id", authenticate, authorizeRoles("admin","organizer"), getOrganizerBookingReport);
router.get("/event-count", authenticate, authorizeRoles("admin","organizer"), getEventCountReport);
router.get("/list/:id", authenticate, authorizeRoles("admin","organizer"), getOrganizerEventsReport);

// Attendee report
router.get("/attendees", authenticate, authorizeRoles("admin", "organizer"), getAttendeeReport);

//Attendee count for a specific event
router.get("/event/:eventId/attendees-count", authenticate, authorizeRoles("admin", "organizer"), getEventAttendees);

router.get('/bookings', getBookingsReport);

//router.get('/payments', getPaymentsReport);
router.get('/event-attendees/:eventId', getEventAttendeesReport);

router.get('/export/:reportType', exportReport);
router.get('/timeline', getBookingTimeline );







module.exports = router;