const mongoose = require('mongoose');

const parkingSpaceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  status: { type: String, enum: ['Available', 'Occupied'], default: 'Available' }, 
  type: { type: String, enum: ['Compact', 'Standard', 'Handicap'], default: 'Standard' }, 
  reserved: { type: Boolean, default: false }, 
  reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reservationDuration: { type: Number }
});

const ParkingSpace = mongoose.model('ParkingSpace', parkingSpaceSchema);

module.exports = ParkingSpace;