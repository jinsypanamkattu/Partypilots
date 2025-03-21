const express = require("express");
require('dotenv').config();
const cors = require("cors");

const connectDB = require("./config/db");
connectDB();

const app = express();
const PORT = process.env.PORT || 5005;
app.use(express.json())
// Middlewareapp.use(express.json())
app.use(cors());

  
// Single middleware for JSON parsing with raw body preservation for webhooks
app.use(
    express.json({
        verify: (req, res, buf) => {
            if (req.originalUrl === '/api/payments/webhook') {
                req.rawBody = buf; // Store raw body only for webhook
            }
        }
    })
);

const { errorHandler } = require('./middleware/errorHandler');

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/event", eventRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/booking", bookingRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// Error handler (after routes)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));