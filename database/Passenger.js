import mongoose from 'mongoose';

//create Passenger schema
const PassengerSchema = mongoose.Schema({
  name: String,
  trips: Number,
  airline: Object,
});

const PassengerModel = mongoose.model('passenger', PassengerSchema);

module.exports = PassengerModel;