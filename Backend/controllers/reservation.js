const ParkingSpace = require("../models/parkingSpace");

// const reserveParkingSpace = async (req, res) => {
//     try {
//       const parkingSpaceId = req.params.id;
//       const  userId  = req.user.id;
//     //   console.log(userId);

//       const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
//       if (!parkingSpace) {
//         return res.status(404).json({ error: 'Parking space not found.' });
//       }
  
//       if (parkingSpace.reserved) {
//         return res.status(400).json({ error: 'Parking space is already reserved.' });
//       }
  
//       parkingSpace.status="Occupied";
//       parkingSpace.reserved = true;
//       parkingSpace.reservedBy = userId;
//       await parkingSpace.save();
  
//       res.json({messag: "reserved successfully", parkingSpace});
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }

// const reserveParkingSpace = async (req, res) => {
//   try {
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

//     const reservationDuration = new Date(toTime) - new Date(fromTime);

//     // Set the reservation details
//     parkingSpace.status = 'Occupied';
//     parkingSpace.reserved = true;
//     parkingSpace.reservedBy = userId;
//     parkingSpace.reservationDuration = reservationDuration; // Store the duration in the database
//     await parkingSpace.save();

//     // Schedule an automatic unreservation using setTimeout
//     setTimeout(async () => {
//       // Unreserve the parking space after the specified duration
//       parkingSpace.status = 'Available';
//       parkingSpace.reserved = false;
//       parkingSpace.reservedBy = null;
//       parkingSpace.reservationDuration = null;
//       await parkingSpace.save();
//     }, reservationDuration);

//     res.json({ message: 'Reserved successfully', parkingSpace });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const reserveParkingSpace = async (req, res) => {
  try {
    const parkingSpaceId = req.params.id;
    const userId = req.user.id;
    const { fromTime, toTime } = req.body;

    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!parkingSpace) {
      return res.status(404).json({ error: 'Parking space not found.' });
    }

    if (parkingSpace.reserved) {
      return res.status(400).json({ error: 'Parking space is already reserved.' });
    }

    const futureReservationTime = new Date(fromTime);
    const currentDateTime = new Date();

    // Check if the future reservation time is valid
    if (futureReservationTime <= currentDateTime) {
      return res.status(400).json({ error: 'Invalid future reservation time.' });
    }
    
    const delay = futureReservationTime - currentDateTime;
    // Schedule the reservation for the future using setTimeout
    setTimeout(async () => {
      // Set the reservation details
      parkingSpace.status = 'Occupied';
      parkingSpace.reserved = true;
      parkingSpace.reservedBy = userId;
      parkingSpace.reservationDuration = new Date(toTime) - futureReservationTime; // Store the duration in the database
      await parkingSpace.save();

      // Schedule an automatic unreservation using setTimeout
      setTimeout(async () => {
        // Unreserve the parking space after the specified duration
        parkingSpace.status = 'Available';
        parkingSpace.reserved = false;
        parkingSpace.reservedBy = null;
        parkingSpace.reservationDuration = null;
        await parkingSpace.save();
      }, parkingSpace.reservationDuration);
    }, delay);

    res.json({ message: 'Reservation scheduled successfully', parkingSpace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




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