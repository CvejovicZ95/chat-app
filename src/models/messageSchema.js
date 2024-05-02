const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
    get: (timestamp) => timestamp.toLocaleString(),
  },
});

module.exports = mongoose.model('Message', messageSchema);

