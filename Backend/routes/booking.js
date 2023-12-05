const express = require('express');
const router = express.Router();
const {requireSignin} = require('../middleware/requireSignin'); 
const { getBookings , getCurrentBookings} = require('../controllers/booking');

router.get('/bookings', requireSignin , getBookings);
router.get('/currentBookings', requireSignin , getCurrentBookings);

module.exports = router;
