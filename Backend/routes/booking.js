const express = require('express');
const router = express.Router();
const {requireSignin} = require('../middleware/requireSignin'); 
const { getBookings } = require('../controllers/booking');

router.get('/bookings', requireSignin , getBookings);

module.exports = router;
