const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  foodProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Foodproduct',
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
