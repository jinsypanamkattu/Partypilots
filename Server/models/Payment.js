const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded", "Cancelled"], default: "Pending" },
  paymentMethod: { type: String, enum: ["card", "paypal", "stripe"], required: true },
  currency: { type: String, default: "usd" },
  paymentIntentId: { type: String, required: true }, 
  transactionDate: { type: Date, default: Date.now },
  reasonForCancel: { type:String },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
