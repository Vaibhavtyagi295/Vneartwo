const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  username: {
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
  password: {
    type: String,
    required: true,
  },
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
