const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const foodSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
  }
});

foodSchema.plugin(passportLocalMongoose);

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
