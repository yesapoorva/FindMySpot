const ParkingSpace = require("../models/parkingSpace");
const Booking = require("../models/booking");
// const cron = require('node-cron');
const schedule = require('node-schedule');

const reserveParkingSpace = async (req, res) => {
  try {
    const parkingSpaceId = req.params.id;
    const userId = req.user.id;

    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!parkingSpace) {
      return res.status(404).json({ error: 'Parking space not found.' });
    }

    if (parkingSpace.reserved) {
      return res.status(400).json({ error: 'Parking space is already reserved.' });
    }

    parkingSpace.status = 'Occupied';
    parkingSpace.reserved = true;
    parkingSpace.reservedBy = userId;
    
    await parkingSpace.save();
    
    const newBooking = new Booking({
      user: userId,
      parkingSpace: parkingSpaceId, 
      date: new Date(),
      fromTime: new Date(),
      toTime: null, 
    });

    await newBooking.save();

    res.json({ message: 'Reservation successful', parkingSpace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const reserveParkingSpace = async (req, res) => {
//   try {
//     console.log("API is working");
//     const parkingSpaceId = req.params.id;
//     const userId = req.user.id;
//     const { fromTime, toTime } = req.body;

//     const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
//     if (!parkingSpace) {
//       return res.status(404).json({ error: 'Parking space not found.' });
//     }

//     if (parkingSpace.reserved) {
//       return res.status(400).json({ error: 'Parking space is already reserved.' });
//     }

//     const futureReservationTime = new Date(fromTime);
//     const currentDateTime = new Date();

//     if (futureReservationTime <= currentDateTime) {
//       return res.status(400).json({ error: 'Invalid future reservation time.' });
//     }

//     const delay = futureReservationTime - currentDateTime;

//     const reservationJob = schedule.scheduleJob(futureReservationTime, async () => {
//       parkingSpace.status = 'Occupied';
//       parkingSpace.reserved = true;
//       parkingSpace.reservedBy = userId;
//       parkingSpace.reservationDuration = new Date(toTime) - futureReservationTime;
//       await parkingSpace.save();
//       console.log("Parking space saved");

//       const newBooking = new Booking({
//         user: userId,
//         parkingSpace: parkingSpaceId,
//         date: futureReservationTime,
//         fromTime: futureReservationTime,
//         toTime: new Date(toTime),
//       });
//       await newBooking.save();
//       console.log("Booking saved");

//       const releaseJob = schedule.scheduleJob(new Date(futureReservationTime.getTime() + parkingSpace.reservationDuration), () => {
//         parkingSpace.status = 'Available';
//         parkingSpace.reserved = false;
//         parkingSpace.reservedBy = null;
//         parkingSpace.reservationDuration = null;
//         parkingSpace.save().then(() => {
//           console.log("Parking space released");
//         });
//       });
//     });

//     res.json({ message: 'Reservation scheduled successfully', parkingSpace });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



const unreserveParkingSpace = async (req, res) => {
  try {
      const parkingSpaceId = req.params.id;
      const userId = req.user.id;

      const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
      if (!parkingSpace) {
          return res.status(404).json({ error: 'Parking space not found.' });
      }

      if (!parkingSpace.reserved) {
          return res.status(400).json({ error: 'Parking space is not reserved.' });
      }

      if (parkingSpace.reservedBy.toString() !== userId) {
          return res.status(403).json({ error: 'You are not the owner of this reservation.' });
      }

      const booking = await Booking.findOne({
          parkingSpace: parkingSpaceId,
          user: userId,
          toTime: null, 
      });

      if (!booking) {
          return res.status(404).json({ error: 'Booking not found.' });
      }

      booking.toTime = new Date();
      await booking.save();
      console.log("booking to time saved")

      parkingSpace.status = "Available";
      parkingSpace.reserved = false;
      parkingSpace.reservedBy = null; 
      parkingSpace.reservationDuration = null;
      await parkingSpace.save();

      res.json({ message: "Parking space unreserved successfully", parkingSpace });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

  module.exports = { reserveParkingSpace, unreserveParkingSpace};