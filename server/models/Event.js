import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  sold: { type: Number, default: 0, min: 0 },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  summary: String,
  category: String,
  date: String,
  time: String,
  startTime: String,
  endTime: String,
  location: String,
  image_url: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  tickets: [ticketSchema],
  // For backward compatibility with existing API
  ticket_price: Number,
  total_tickets: Number,
  available_tickets: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Virtual for available tickets calculation
eventSchema.virtual('calculated_available_tickets').get(function() {
  if (this.tickets && this.tickets.length > 0) {
    return this.tickets.reduce((total, ticket) => total + (ticket.quantity - ticket.sold), 0);
  }
  return this.total_tickets - (this.sold_tickets || 0);
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Event", eventSchema);
