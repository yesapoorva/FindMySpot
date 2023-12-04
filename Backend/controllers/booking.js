const ParkingSpace = require("../models/parkingSpace");
const Booking = require('../models/booking'); 

const getBookings = async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const bookings = await Booking.find({ user: userId });
  
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const parkingSpace = await ParkingSpace.findById(booking.parkingSpace);
          return {
            parkingSpaceName: parkingSpace.name,
          //   date: booking.date,
            fromTime: booking.fromTime,
            toTime: booking.toTime,
          };
        })
      );
  
      res.json(bookingsWithDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = { getBookings }