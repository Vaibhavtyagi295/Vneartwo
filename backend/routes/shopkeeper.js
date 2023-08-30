const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const shopkeeperSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Ensure unique phone numbers for each shopkeeper
  },
  password:{
    type: String,
  },
  description:{
  type:String
  }
});

shopkeeperSchema.plugin(passportLocalMongoose); // Add passport-local-mongoose plugin

const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);

module.exports = Shopkeeper;
