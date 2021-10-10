import mongoose from 'mongoose';

//create Airlines schema
const AirlinesSchema = mongoose.Schema({
  id: Number,
  name: String,
  country: String,
  logo: String,
  slogan: String,
  head_quarters: String,
  website: String,
  established: Number,
});

AirlinesSchema.statics.findAirline = async (airlineid) => {
  const checkAirlineByID = await AirlinesModel.findOne({ id: airlineid });
  if (checkAirlineByID) {
    throw new Error('Airplane with same id exists choose a different id');
  }
  return false;
};

AirlinesSchema.statics.findAirlineByID = async ({ airline }) => {
  const checkAirlineByID = await AirlinesModel.findOne({ id: airline });

  if (!checkAirlineByID) {
    throw new Error('Airplane with your selected ID doesnot exist');
  }
  return false;
};

const AirlinesModel = mongoose.model('airlines', AirlinesSchema);

module.exports = AirlinesModel;