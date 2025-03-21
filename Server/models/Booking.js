const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["registered", "checked-in"], default: "registered" },
  tickets: [
    {
      type: { type: String, enum: ['General', 'VIP', 'Student'], required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  

  bookingStatus: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Pending' },
  qrCode: { type: String }, // Store QR Code URL
  badgeUrl: { type: String }, // Store Badge URL
  badgeGenerated: { type: Boolean, default: false },
  reasonForCancel: { type: String },
  checkInTime: { type: Date },
}, { timestamps: true });






module.exports = mongoose.model("Booking", BookingSchema);
