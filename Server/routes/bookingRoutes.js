const express = require('express');
const router = express.Router();
//const BookingController = require('../controllers/bookingController');
const { bookEvent, getBookingById, cancelBooking, getBookingByUserId, getAllBooking, getAllOrganizerBooking,cancelFromProfilePage} = require('../controllers/bookingController');
router.get('/book/:bookingId', getBookingById);
router.post('/create', bookEvent);
router.get('/all', getAllBooking);
router.get('/organizer/:id', getAllOrganizerBooking);

router.get('/user/:id', getBookingByUserId);
//router.patch('/:bookingId', cancelBooking);
router.post('/:bookingId/cancel', cancelBooking);
router.post('/cancelBookingByUser/:bookingId', cancelFromProfilePage)


module.exports = router;
