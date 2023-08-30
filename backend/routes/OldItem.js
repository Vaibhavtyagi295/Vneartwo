// models/OldItem.js
const mongoose = require('mongoose');

const oldItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  condition: { type: String },
   category: {
    type: String,
    required: true,
  },
  image: { type: String },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required:true
  },
});

const OldItem = mongoose.model('OldItem', oldItemSchema);

module.exports = OldItem;
