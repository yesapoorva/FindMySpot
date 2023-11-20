const ParkingSpace = require("../models/parkingSpace");

const reserveParkingSpace = async (req, res) => {
    try {
      const parkingSpaceId = req.params.id;
      const  userId  = req.user.id;
    //   console.log(userId);

      const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
      if (!parkingSpace) {
        return res.status(404).json({ error: 'Parking space not found.' });
      }
  
      if (parkingSpace.reserved) {
        return res.status(400).json({ error: 'Parking space is already reserved.' });
      }
  
      parkingSpace.status="Occupied";
      parkingSpace.reserved = true;
      parkingSpace.reservedBy = userId;
      await parkingSpace.save();
  
      res.json({messag: "reserved successfully", parkingSpace});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

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

        // Unreserve the parking space
        parkingSpace.status = "Available";
        parkingSpace.reserved = false;
        parkingSpace.reservedBy = null; // Clear the reservedBy field
        await parkingSpace.save();

        res.json({ message: "Parking space unreserved successfully", parkingSpace });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

  module.exports = { reserveParkingSpace, unreserveParkingSpace};