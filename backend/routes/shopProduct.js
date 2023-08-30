const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,},
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopkeeper',
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
