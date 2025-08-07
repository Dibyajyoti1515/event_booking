const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookedSlots: { type: Number, default: 0 },
});

module.exports = mongoose.model('Event', eventSchema);