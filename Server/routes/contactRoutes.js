// routes/contactRoutes.js
const express = require("express");
const  contactController  = require('../controllers/contactController');

const router = express.Router();

    router.post('/', contactController.contactFormSubmit);
    

    module.exports = router;
