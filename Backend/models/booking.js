const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace',
    required: true,
  },
//   date: {
//     type: Date,
//     required: true,
//   },
  fromTime: {
    type: Date,
  },
  toTime: {
    type: Date,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
