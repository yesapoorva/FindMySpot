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
    console.log('hey')

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


  function haversine(lat1, lon1, lat2, lon2) {


    const radLat1 = (Math.PI / 180) * lat1;
    const radLon1 = (Math.PI / 180) * lon1;
    const radLat2 = (Math.PI / 180) * lat2;
    const radLon2 = (Math.PI / 180) * lon2;
  
    const deltaLat = radLat2 - radLat1;
    const deltaLon = radLon2 - radLon1;
  
    // Haversine formula
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    
    const R = 6371; // Radius of Earth in kilometers
  
    const distance = R * c;
  
    return distance; // in kms
  }
  
  const MAX_ALLOWABLE_DISTANCE = 10; // 1 degree of long and lat is approx equal to 100 kms 

const nearestParkingSpace = async (req, res) => {
    
  try {
    console.log('hey')
    const { destinationLatitude, destinationLongitude } = req.query;

    if (!destinationLatitude || !destinationLongitude) {
      return res.status(400).json({ error: 'Destination coordinates are required.' });
    }

    const destLat = parseFloat(destinationLatitude);
    const destLng = parseFloat(destinationLongitude);

    const allParkingSpaces = await ParkingSpace.find();

    if (!allParkingSpaces || allParkingSpaces.length === 0) {
      return res.status(404).json({ error: 'No parking spaces found.' });   
       
    }

    const nearbyParkingSpaces = allParkingSpaces.filter((parkingSpace) => {
      const { coordinates } = parkingSpace.location;
      const parkingSpaceLat = coordinates[1];
      const parkingSpaceLng = coordinates[0];

      const distance = haversine(destLat, destLng, parkingSpaceLat, parkingSpaceLng);

      console.log(`Parking Space ${parkingSpace._id}: Distance - ${distance} meters`);

      return distance <= MAX_ALLOWABLE_DISTANCE;
    });

    if (nearbyParkingSpaces.length === 0) {
      console.log('No parking spaces found near the destination.');
      return res.status(404).json({ error: 'No parking spaces found near the destination.' });
    }

    nearbyParkingSpaces.sort((a, b) => {
      const distanceA = haversine(destLat, destLng, a.location.coordinates[1], a.location.coordinates[0]);
      const distanceB = haversine(destLat, destLng, b.location.coordinates[1], b.location.coordinates[0]);
      return distanceA - distanceB;
    });

    res.json(nearbyParkingSpaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  

  module.exports = {getParkingSpaces, 
                    addParkingSpaces, 
                    updateParkingSpaces, 
                    deleteParkingSpaces, 
                    nearestParkingSpace}