const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    eventType: { type: String, enum: ['Corporate', 'Social', 'Public', 'Virtual'], default: 'Public' },
    name: { type: String, required: true },
    
    start: {type:Date,
        required: true,
       
    },
    end: {type:Date,
        required:true,
       
    },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Draft', 'Published', 'Closed'], default: 'Draft' },
    state: { type:String, enum: ['active','inactive'], default:'active' },
    
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String },
    tickets: [
        {
            type: { type: String, enum: ['General', 'VIP', 'Student'], default: 'General',required: true }, // e.g., General, VIP, Student
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            sold: { type: Number, default: 0, min: 0 },
        }
    ],
    
    
    
    createdAt: { type: Date, default: Date.now }
});

// Virtual field for total event capacity (sum of all ticket quantities)
/*EventSchema.virtual("capacity").get(function () {
    console.log("Tickets:", this.tickets); // Debugging
    if (!Array.isArray(this.tickets)) {
      console.log("Tickets is undefined or not an array!");
      return 0;
    }
    return this.tickets.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0);
  });
  

// Ensure virtuals are included in JSON and object responses
EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });
*/
module.exports = mongoose.model("Event", EventSchema);