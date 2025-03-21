const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-payment-intent", paymentController.createPayment);
router.post("/webhook",express.raw({ type: 'application/json' }), paymentController.confirmPayment);

router.get("/adminListPayments", paymentController.getPaymentsForAdmin);
router.get("/organizer/:id", paymentController.getPaymentsForOrganizer);

router.post("/cancel-payment", paymentController.cancelPayment);



module.exports = router;




