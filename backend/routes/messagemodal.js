// messageModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  type: { type: String, },
  text: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
