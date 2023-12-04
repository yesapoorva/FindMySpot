const express = require('express');
const router = express.Router();
const {requireSignin} = require('../middleware/requireSignin'); // Assuming you have authentication middleware

const Booking = require('../models/booking'); // Replace with your Booking model
const ParkingSpace = require('../models/parkingSpace'); // Replace with your ParkingSpace model
const { getBookings } = require('../controllers/booking');

// Endpoint to get all user's previous bookings
router.get('/bookings', requireSignin , getBookings);

module.exports = router;
