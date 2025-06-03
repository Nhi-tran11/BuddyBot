const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  total: Number
});

module.exports = mongoose.model('Score', scoreSchema);
