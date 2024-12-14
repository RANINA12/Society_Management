const express = require('express');
const Booking = require('../Models/Booking');
const auth = require('../Middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user._id
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking.' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('serviceProvider');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
});

module.exports = router;