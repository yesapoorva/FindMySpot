const express = require('express');
const router = express.Router();
const ParkingSpace = require('../models/parkingSpace'); 
const { getParkingSpaces, 
        addParkingSpaces, 
        updateParkingSpaces, 
        deleteParkingSpaces} = require('../controllers/parkingSpace');

router.get('/', getParkingSpaces);
router.post('/', addParkingSpaces);
router.put('/:id', updateParkingSpaces);
router.delete('/:id', deleteParkingSpaces);

module.exports = router;


