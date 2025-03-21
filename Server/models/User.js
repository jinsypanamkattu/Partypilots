const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:{type:String,required:true},
  password: { type: String, required: true },
  role: { type: String, enum: ["organizer", "attendee"], default: "attendee" },
  profileImage: { type: String },
  phone: { type: String },
  address: { type: String },
  status: { type:String,enum: ['active','inactive'], default:'active' },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

// Create a unique compound index on email and role
UserSchema.index({ email: 1, role: 1 }, { unique: true });


module.exports = mongoose.model("User", UserSchema);
