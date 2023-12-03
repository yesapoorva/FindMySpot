// const express = require('express');
// const router = express.Router();
// const requireSignin = require('../middleware/requireSignin'); // Assuming you have authentication middleware

// const Booking = require('../models/booking'); // Replace with your Booking model
// const ParkingSpace = require('../models/parkingSpace'); // Replace with your ParkingSpace model

// // Endpoint to get all user's previous bookings
// router.get('/', requireSignin, async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you have userId in the request after authentication

//     // Fetch all bookings for the user
//     const bookings = await Booking.find({ user: userId });

//     // Map the bookings to get relevant details
//     const bookingsWithDetails = await Promise.all(
//       bookings.map(async (booking) => {
//         const parkingSpace = await ParkingSpace.findById(booking.parkingSpace);
//         return {
//           parkingSpaceName: parkingSpace.name,
//         //   date: booking.date,
//           fromTime: booking.fromTime,
//           toTime: booking.toTime,
//         };
//       })
//     );

//     res.json(bookingsWithDetails);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;
