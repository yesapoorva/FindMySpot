const express = require('express');
const router = express.Router();
const { reserveParkingSpace, unreserveParkingSpace } = require('../controllers/reservation');
const { requireSignin } = require('../middleware/requireSignin');

router.post('/reserve/:id', requireSignin, reserveParkingSpace);
router.post('/unreserve/:id', requireSignin, unreserveParkingSpace);

module.exports = router;