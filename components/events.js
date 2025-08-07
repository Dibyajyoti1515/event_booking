const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authMiddleware = require('../middelewars/auth');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, date, location, capacity } = req.body;
    if (!name || !date || !location || !capacity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const event = new Event({ name, date, location, capacity });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, date, location, capacity } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { name, date, location, capacity },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;