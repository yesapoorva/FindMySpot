const express = require('express');
const router = express.Router();
const ParkingSpace = require('../models/parkingSpace'); 
// const { } = require('../controllers/parkingSpace');

router.get('/availability', async (req, res) => {
    try {
      const availableParkingSpaces = await ParkingSpace.find({ status: 'Available' }, 'name availability');
  
      res.json(availableParkingSpaces);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;