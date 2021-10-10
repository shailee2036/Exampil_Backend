require('dotenv').config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
const app = express();
const PORT = process.env.PORT || 4000;
// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Database Models
import AirlinesModel from './database/Airlines';
import PassengerModel from './database/Passenger';
//DB config
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('connection estblished'));

app.get('/', (req, res) => res.status(200).send('running'));
/*
Route             /airlines
Description     Get all airlines
Access          Public
Parameter       None
Method          GET
*/
app.get('/airlines', async (req, res) => {
  try {
    const getAllAirlines = await AirlinesModel.find();
    return res.json(getAllAirlines);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
/*
Route             /airlines/new
Description     ADD new Airline
Access          Public
Parameter       None
Method          POST
*/
app.post('/airlines/new', async (req, res) => {
  try {
    const { newAirlines } = req.body;
    await AirlinesModel.findAirline(newAirlines.id);

    const addNewAirlines = AirlinesModel.create(newAirlines);
    return res.json({
      Airlines: addNewAirlines,
      message: 'Airlines was added',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
/*
Route             /airlines/:id
Description     Get specific airline based on id
Access          Public
Parameter       id
Method          Get
*/
app.get('/airlines/:id', async (req, res) => {
  const getSpecificAirline = await AirlinesModel.findOne({ id: req.params.id });

  if (!getSpecificAirline) {
    return res.json({
      error: `No Airline found for the id ${req.params.id}`,
    });
  }
  return res.json({ Airline: getSpecificAirline });
});

/*
Route            /passengers
Description     ADD a passenger
Access          Public
Parameter       none
Method          POST
*/
app.post('/passengers', async (req, res) => {
  try {
    const { newPassenger } = req.body;
    await AirlinesModel.findAirlineByID(newPassenger);
    const airid = newPassenger.airline;
    const airline = await AirlinesModel.findOne({ id: airid });
    newPassenger.airline = airline;
    const addNewPassenger = PassengerModel.create(newPassenger);
    return res.json({
      Passenger: addNewPassenger,
      message: 'Passenger was added',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Route             /passengers/:id
Description     Get specific passenger based on id
Access          Public
Parameter       id
Method          Get
*/
app.get('/passengers/:id', async (req, res) => {
  const getSpecificPassenger = await PassengerModel.findOne({
    _id: req.params.id,
  });

  if (!getSpecificPassenger) {
    return res.json({
      error: `No Passenger found for the id ${req.params.id}`,
    });
  }
  return res.json({ Passenger: getSpecificPassenger });
});

/*
Route            /passengers/delete
Description     Delete a passenger
Access          Public
Parameter       _id
Method          DELETE
*/

app.delete('/passengers/delete/:id', async (req, res) => {
  const updatedPassengers = await PassengerModel.findOneAndDelete({
    _id: req.params.id,
  });

  return res.json({
    Passengers: updatedPassengers,
  });
});

/*
Route            /passengers/:id
Description     Update a passenger name
Access          Public
Parameter       _id
Method          PATCH
*/
app.patch('/passengers/:id', async (req, res) => {
  try {
    const updatedDetails = req.body;
    const id = req.params.id;
    const result = await PassengerModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedDetails }
    );
    return res.json({
      Passenger: updatedDetails,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Route            /passengers/:id
Description     Update a passenger name,trips and airline
Access          Public
Parameter       _id
Method          PUT
*/
app.put('/passengers/:id', async (req, res) => {
  try {
    const updatedDetails = req.body;
    await AirlinesModel.findAirlineByID(updatedDetails);
    const id = req.params.id;
    const airid = updatedDetails.airline;
    const airline = await AirlinesModel.findOne({ id: airid });
    updatedDetails.airline = airline;
    const result = await PassengerModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedDetails }
    );
    return res.json({
      Passenger: updatedDetails,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
/*
Route            /passengers
Description     Getting passengers based on pagination
Access          Public
Parameter       page & size
Method          GEt
*/
app.get('/passengers', async (req, res) => {
  const page = req.query.page;
  const size = req.query.size;
  const startIndex = (page - 1) * size;
  const endIndex = page * size;
  const getAllPassengers = await PassengerModel.find();
  const result = getAllPassengers.slice(startIndex, endIndex);

  res.json({
    'Total Passengers': getAllPassengers.length,
    'total Pages': Math.floor(getAllPassengers.length / size),
    ' data': result,
  });
});

app.listen(PORT, () => {
  console.log('server is up and running at port 4000');
});