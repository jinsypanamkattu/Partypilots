const express = require("express");
//const { createEvent } = require("../controllers/eventController");
const  eventController = require("../controllers/eventController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

//const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();
//router.post("/create", createEvent);
const upload = require("../middleware/upload");


// Routes for event management
router.get('/adminEventList', eventController.getAllAdminEvents); // List all events
router.post("/create", upload.single('image'), authenticate, authorizeRoles("admin", "organizer"), eventController.createOrUpdateEvent); // Create an event
router.get('/list', eventController.getAllEvents); // List all events
router.get('/adminEventList', eventController.getAllAdminEvents); // List all events

router.get("/organizer/:id", authenticate, authorizeRoles("admin", "organizer"), eventController.getAllOrganizerEvents);// Only admins and organizers can access their own events

router.patch("/:id/status", eventController.toggleEventActiveStatus);
 
router.get('/latest',eventController.getEventsLatest);

router.get('/published', eventController.getAllPublishedEvents); // Get event by ID
router.get('/:id', eventController.getEventById); // Get event by ID
router.get('/name/:id', eventController.getEventNameById);

// Route to update event active status
router.patch("/:id/status", eventController.toggleEventActiveStatus);

router.put('/:id', upload.single('image'), authenticate, authorizeRoles("admin", "organizer"), eventController.createOrUpdateEvent); // Update event by ID
router.delete('/:id', authenticate, authorizeRoles("admin", "organizer"), eventController.deleteEvent); // Delete event by ID
router.get("/list/report", eventController.getAllEventsForReport);




//router.post("/add", protect,authorize("owner"),addBike);
module.exports = router;