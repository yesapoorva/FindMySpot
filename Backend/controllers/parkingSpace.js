const ParkingSpace = require("../models/parkingSpace");

const getParkingSpaces = async (req, res) => {
    try {
      const parkingSpaces = await ParkingSpace.find();
      res.json(parkingSpaces);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  const addParkingSpaces = async (req, res) => {
    try {
      const newParkingSpace = new ParkingSpace(req.body);
      const savedParkingSpace = await newParkingSpace.save();
      res.json(savedParkingSpace);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  const updateParkingSpaces = async (req, res) => {
    try {
      const updatedParkingSpace = await ParkingSpace.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedParkingSpace);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  const deleteParkingSpaces = async (req, res) => {
    try {
      await ParkingSpace.findByIdAndDelete(req.params.id);
      res.json({ message: 'Parking space deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  const nearestParkingSpaces = async (req, res) => {
    try {
      const { destinationLongitude, destinationLatitude } = req.query;
  
      if (!destinationLongitude || !destinationLatitude) {
        return res.status(400).json({ error: 'Destination coordinates are required.' });
      }
  
      const destLng = parseFloat(destinationLongitude);
      const destLat = parseFloat(destinationLatitude);
  
      const nearestParkingSpace = await ParkingSpace.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [destLng, destLat],
            },
            $maxDistance: 10000, 
          },
        },
      }).limit(1);
  
      if (!nearestParkingSpace || nearestParkingSpace.length === 0) {
        return res.status(404).json({ error: 'No parking space found near the destination.' });
      }
  
      res.json(nearestParkingSpace[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = {getParkingSpaces, 
                    addParkingSpaces, 
                    updateParkingSpaces, 
                    deleteParkingSpaces, 
                    nearestParkingSpaces}