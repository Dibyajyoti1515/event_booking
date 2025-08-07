const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const authMiddleware = require('../middelewars/auth');

router.post('/', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.bookedSlots >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const existingBooking = await Booking.findOne({ user: req.user.id, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    const booking = new Booking({ user: req.user.id, event: eventId });
    await booking.save();

    event.bookedSlots += 1;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const event = await Event.findById(booking.event);
    if (event) {
      event.bookedSlots -= 1;
      await event.save();
    }

    await booking.deleteOne();
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my-bookings', authMiddleware(['user', 'admin']), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;